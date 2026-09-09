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
const mockAuthenticatedPost = jest.fn();
const mockGet = jest.fn();
const mockCaptureException = jest.fn();

jest.mock('../../util/helpers/api', () => ({
  api: {
    post: (...args) => mockAuthenticatedPost(...args),
    get: (...args) => mockGet(...args),
  },
  cdn: { post: jest.fn(), get: jest.fn() },
}));

jest.mock('../../util/helpers/api/Api', () => ({
  __esModule: true,
  default: {
    post: (...args) => mockAuthenticatedPost(...args),
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

jest.mock('@sentry/react-native', () => ({
  captureException: (...args) => mockCaptureException(...args),
}));

const mockDispatch = jest.fn();
const mockGetState = jest.fn();

jest.mock('../../store/store', () => ({
  store: {
    dispatch: (...args) => mockDispatch(...args),
    getState: (...args) => mockGetState(...args),
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

describe('mobile logout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('posts the refresh token with an access bearer to the versioned logout endpoint', async () => {
    mockPost.mockResolvedValue({});

    const { logoutUser } = require('../../helper/user');
    await expect(
      logoutUser({ access_token: 'access-token', refresh_token: 'refresh-token' })
    ).resolves.toBe(true);

    expect(mockPost).toHaveBeenCalledWith(
      '/api/v1/mobile/auth/logout',
      { refresh_token: 'refresh-token' },
      {
        headers: { Authorization: 'Bearer access-token' },
        timeout: 2000,
      }
    );
    expect(mockAuthenticatedPost).not.toHaveBeenCalled();
  });

  it('does not call the API when either token is missing', async () => {
    const { logoutUser } = require('../../helper/user');

    await expect(logoutUser({ access_token: 'access-token' })).resolves.toBe(false);
    await expect(logoutUser({ refresh_token: 'refresh-token' })).resolves.toBe(false);
    expect(mockPost).not.toHaveBeenCalled();
    expect(mockCaptureException).not.toHaveBeenCalled();
  });

  it('captures a sanitized failure without rejecting sign-out', async () => {
    mockPost.mockRejectedValue(new Error('request failed with refresh-token'));

    const { logoutUser } = require('../../helper/user');
    await expect(
      logoutUser({ access_token: 'access-token', refresh_token: 'refresh-token' })
    ).resolves.toBe(false);

    expect(mockCaptureException).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Mobile logout request failed' }),
      expect.objectContaining({ tags: { functionName: 'logoutUser' } })
    );
    expect(JSON.stringify(mockCaptureException.mock.calls)).not.toContain('refresh-token');
  });
});

describe('public-client token refresh', () => {
  const getTokenReducer = require('../../store/reducers/loginReducer/getTokenReducer').default;
  const { refreshToken } = require('../../util/helpers/api/RefreshToken');
  let authState;

  const deferred = () => {
    let resolve;
    let reject;
    const promise = new Promise((resolvePromise, rejectPromise) => {
      resolve = resolvePromise;
      reject = rejectPromise;
    });
    return { promise, resolve, reject };
  };

  beforeEach(() => {
    jest.clearAllMocks();
    authState = getTokenReducer(undefined, {
      type: 'GET_TOKEN_SUCCESS',
      payload: { access_token: 'stored-access-token', refresh_token: 'stored-refresh-token' },
    });
    mockGetState.mockImplementation(() => ({ getTokenReducer: authState }));
    mockDispatch.mockImplementation((action) => {
      authState = getTokenReducer(authState, action);
    });
  });

  afterEach(() => {
    mockDispatch.mockReset();
    mockGetState.mockReset();
  });

  it('refreshes against the public-client endpoint and returns tokens for the unchanged session', async () => {
    const response = deferred();
    const user = { access_token: 'new', refresh_token: 'new-r' };
    mockPost.mockReturnValueOnce(response.promise);

    const refreshing = refreshToken();
    expect(mockDispatch).not.toHaveBeenCalled();
    response.resolve(user);

    await expect(refreshing).resolves.toBe(user);

    expect(mockPost.mock.calls[0][0]).toContain(PUBLIC_TOKEN_PATH);
    expect(mockPost.mock.calls[0][0]).not.toContain('/api/v2/login');
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'GET_TOKEN_SUCCESS',
      payload: user,
      meta: { isTokenRefresh: true },
    });
    expect(authState.auth).toBe(user);
    expect(global.toast.show).not.toHaveBeenCalled();
  });

  it('sends only the refresh token, with no client credentials', async () => {
    mockPost.mockResolvedValue({ access_token: 'new', refresh_token: 'new-r' });

    await refreshToken();

    expect(mockPost.mock.calls[0][1]).toEqual({
      grant_type: 'refresh_token',
      refresh_token: 'stored-refresh-token',
    });
  });

  it('uses the public client without retry options', async () => {
    mockPost.mockResolvedValue({ access_token: 'new', refresh_token: 'new-r' });

    await refreshToken();

    expect(mockPost.mock.calls[0]).toHaveLength(2);
  });

  it('logs out when refresh fails in the unchanged session', async () => {
    const response = deferred();
    mockPost.mockReturnValueOnce(response.promise);

    const refreshing = refreshToken();
    response.reject(new Error('refresh failed'));

    await expect(refreshing).rejects.toThrow('token_expired');

    expect(mockDispatch).toHaveBeenCalledTimes(2);
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'GET_TOKEN_SUCCESS', payload: null });
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'EXIT_USER', payload: null });
    expect(authState.auth).toBeNull();
    expect(global.toast.show).toHaveBeenCalledWith('token_expired', { type: 'error' });
  });

  const sessionChanges = [
    ['logout', { type: 'EXIT_USER' }, null],
    [
      'account replacement',
      {
        type: 'GET_TOKEN_SUCCESS',
        payload: { access_token: 'other-access', refresh_token: 'other-refresh' },
      },
      { access_token: 'other-access', refresh_token: 'other-refresh' },
    ],
    [
      'session replacement with the same token values',
      {
        type: 'GET_TOKEN_SUCCESS',
        payload: { access_token: 'stored-access-token', refresh_token: 'stored-refresh-token' },
      },
      { access_token: 'stored-access-token', refresh_token: 'stored-refresh-token' },
    ],
  ];

  it.each(sessionChanges)(
    'rejects a late refresh success after %s',
    async (_, action, expectedAuth) => {
      const response = deferred();
      mockPost.mockReturnValueOnce(response.promise);
      const refreshing = refreshToken();

      mockDispatch(action);
      const currentState = authState;
      mockDispatch.mockClear();
      response.resolve({ access_token: 'stale-access', refresh_token: 'stale-refresh' });

      await expect(refreshing).rejects.toThrow(
        'Authentication session changed during token refresh'
      );

      expect(authState).toBe(currentState);
      expect(authState.auth).toEqual(expectedAuth);
      expect(mockDispatch).not.toHaveBeenCalled();
      expect(global.toast.show).not.toHaveBeenCalled();
    }
  );

  it.each(sessionChanges)(
    'rejects a late refresh failure after %s',
    async (_, action, expectedAuth) => {
      const response = deferred();
      const failure = new Error('refresh failed');
      mockPost.mockReturnValueOnce(response.promise);
      const refreshing = refreshToken();

      mockDispatch(action);
      const currentState = authState;
      mockDispatch.mockClear();
      response.reject(failure);

      await expect(refreshing).rejects.toBe(failure);

      expect(authState).toBe(currentState);
      expect(authState.auth).toEqual(expectedAuth);
      expect(mockDispatch).not.toHaveBeenCalled();
      expect(global.toast.show).not.toHaveBeenCalled();
    }
  );

  it('accepts a refresh after an unrelated user-information update', async () => {
    const response = deferred();
    const user = { access_token: 'new', refresh_token: 'new-r' };
    mockPost.mockReturnValueOnce(response.promise);
    const refreshing = refreshToken();

    mockDispatch({ type: 'GET_USER_INFORMATION', payload: { id: 42 } });
    mockDispatch.mockClear();
    response.resolve(user);

    await expect(refreshing).resolves.toBe(user);

    expect(authState.auth).toBe(user);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'GET_TOKEN_SUCCESS',
      payload: user,
      meta: { isTokenRefresh: true },
    });
  });

  it.each(['success', 'failure'])(
    'preserves the first concurrent refresh result after a late %s',
    async (outcome) => {
      const firstResponse = deferred();
      const lateResponse = deferred();
      const user = { access_token: 'first-access', refresh_token: 'first-refresh' };
      mockPost.mockReturnValueOnce(firstResponse.promise).mockReturnValueOnce(lateResponse.promise);
      const firstRefresh = refreshToken();
      const lateRefresh = refreshToken();

      expect(mockPost).toHaveBeenCalledTimes(2);
      for (const [, body] of mockPost.mock.calls) {
        expect(body.refresh_token).toBe('stored-refresh-token');
      }
      firstResponse.resolve(user);
      await expect(firstRefresh).resolves.toBe(user);
      mockDispatch.mockClear();

      if (outcome === 'success') {
        lateResponse.resolve({ access_token: 'late-access', refresh_token: 'late-refresh' });
      } else {
        lateResponse.reject(new Error('refresh token already used'));
      }
      await expect(lateRefresh).rejects.toThrow();

      expect(authState.auth).toBe(user);
      expect(mockDispatch).not.toHaveBeenCalled();
      expect(global.toast.show).not.toHaveBeenCalled();
    }
  );

  it('rejects without calling the token endpoint when no session exists', async () => {
    mockDispatch({ type: 'EXIT_USER' });
    mockDispatch.mockClear();

    await expect(refreshToken()).rejects.toThrow('token_expired');

    expect(mockPost).not.toHaveBeenCalled();
    expect(authState.auth).toBeNull();
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
