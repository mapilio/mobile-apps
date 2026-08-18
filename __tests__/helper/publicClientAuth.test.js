/**
 * Contract tests for the public-client auth flows (mapilio/mobile-apps#84).
 *
 * The app used to send client_id and client_secret from EXPO_PUBLIC variables,
 * which are embedded in the bundle and therefore readable by anyone who
 * installs the app. These assert that login, refresh and the config fetch no
 * longer carry a shipped secret, and that they call the endpoints that do not
 * require one.
 *
 * Assertions are deliberately about structure rather than values: Expo inlines
 * EXPO_PUBLIC_* at build time, so their runtime values are not meaningful here.
 * What matters is which fields are sent and where the token travels.
 */

const mockPost = jest.fn();
const mockGet = jest.fn();

jest.mock('../../util/helpers/api', () => ({
  api: {
    post: (...args) => mockPost(...args),
    get: (...args) => mockGet(...args),
  },
  cdn: { post: jest.fn(), get: jest.fn() },
}));

jest.mock('../../util/helpers/api/Api', () => ({
  __esModule: true,
  default: {
    post: (...args) => mockPost(...args),
    get: (...args) => mockGet(...args),
  },
}));

jest.mock('../../util/helpers/api/PublicApi', () => ({
  __esModule: true,
  default: {
    post: (...args) => mockPost(...args),
    get: (...args) => mockGet(...args),
  },
}));

const mockDispatch = jest.fn();

jest.mock('../../store/store', () => ({
  store: {
    dispatch: (...args) => mockDispatch(...args),
    getState: () => ({
      getTokenReducer: {
        auth: { refresh_token: 'stored-refresh-token' },
      },
    }),
  },
}));

jest.mock('../../store/reducers/loginReducer/getUserInformation', () => ({
  getUserInformation: jest.fn(() => ({ type: 'GET_USER_INFORMATION' })),
}));

jest.mock('../../util/helpers/index', () => ({
  translate: (key) => key,
}));

const PUBLIC_TOKEN_PATH = '/api/v1/mobile/auth/public-token';

/** Records FormData appends; the jest-expo stub does not expose its contents. */
class RecordingFormData {
  constructor() {
    this.entries = {};
  }

  append(key, value) {
    this.entries[key] = value;
  }
}

describe('public-client login', () => {
  let originalFormData;

  beforeEach(() => {
    jest.clearAllMocks();
    originalFormData = global.FormData;
    global.FormData = RecordingFormData;
  });

  afterEach(() => {
    global.FormData = originalFormData;
  });

  it('posts to the public-client endpoint', async () => {
    mockPost.mockResolvedValue({ access_token: 'a', refresh_token: 'r' });

    const { fetchLogin } = require('../../helper/user');
    await fetchLogin('alice@example.test', 'correct-password');

    expect(mockPost).toHaveBeenCalledTimes(1);
    expect(mockPost.mock.calls[0][0]).toBe(PUBLIC_TOKEN_PATH);
  });

  it('sends the user credentials and nothing else', async () => {
    mockPost.mockResolvedValue({ access_token: 'a', refresh_token: 'r' });

    const { fetchLogin } = require('../../helper/user');
    await fetchLogin('alice@example.test', 'correct-password');

    expect(mockPost.mock.calls[0][1].entries).toEqual({
      email: 'alice@example.test',
      password: 'correct-password',
      grant_type: 'password',
    });
  });
});

describe('public-client token refresh', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('refreshes against the public-client endpoint', async () => {
    mockPost.mockResolvedValue({ access_token: 'new', refresh_token: 'new-r' });

    const { refreshToken } = require('../../util/helpers/api/RefreshToken');
    await refreshToken();

    expect(mockPost.mock.calls[0][0]).toContain(PUBLIC_TOKEN_PATH);
    expect(mockPost.mock.calls[0][0]).not.toContain('/api/v2/login');
  });

  it('sends only the refresh token, with no client credentials', async () => {
    mockPost.mockResolvedValue({ access_token: 'new', refresh_token: 'new-r' });

    const { refreshToken } = require('../../util/helpers/api/RefreshToken');
    await refreshToken();

    expect(mockPost.mock.calls[0][1]).toEqual({
      grant_type: 'refresh_token',
      refresh_token: 'stored-refresh-token',
    });
  });

  it('uses the public client without retry options', async () => {
    mockPost.mockResolvedValue({ access_token: 'new', refresh_token: 'new-r' });

    const { refreshToken } = require('../../util/helpers/api/RefreshToken');
    await refreshToken();

    expect(mockPost.mock.calls[0]).toHaveLength(2);
  });

  it('logs out when refresh fails', async () => {
    mockPost.mockRejectedValue(new Error('refresh failed'));

    const { refreshToken } = require('../../util/helpers/api/RefreshToken');
    await expect(refreshToken()).rejects.toThrow('token_expired');

    expect(mockDispatch).toHaveBeenCalledWith({ type: 'GET_TOKEN_SUCCESS', payload: null });
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'EXIT_USER', payload: null });
  });
});

describe('general config fetch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('sends the config token as a header rather than in the query string', () => {
    // A token in the query string is copied into access logs, proxy logs and
    // anything else that records URLs.
    mockGet.mockReturnValue({ then: () => ({ catch: () => undefined }) });

    const { getConfig } = require('../../store/actions/generalReducer');
    getConfig()(mockDispatch);

    const [path, options] = mockGet.mock.calls[0];

    expect(path).toBe('/config/general');
    expect(path).not.toContain('token=');
    expect(Object.keys(options.headers)).toContain('X-Mapilio-Config-Token');
  });
});
