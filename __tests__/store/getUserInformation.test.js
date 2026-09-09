const mockGet = jest.fn();
const mockPost = jest.fn();
const mockDispatch = jest.fn();
const mockGetState = jest.fn();
const mockSetUser = jest.fn();
const mockAddEmail = jest.fn();

jest.mock('../../util/helpers/api', () => ({
  api: {
    get: (...args) => mockGet(...args),
    post: (...args) => mockPost(...args),
  },
}));

jest.mock('@sentry/react-native', () => ({
  setUser: (...args) => mockSetUser(...args),
}));

jest.mock('react-native-onesignal', () => ({
  OneSignal: { User: { addEmail: (...args) => mockAddEmail(...args) } },
}));

class RecordingFormData {
  constructor() {
    this.entries = {};
  }

  append(key, value) {
    this.entries[key] = value;
  }
}

const {
  GET_USER_INDEX_TYPE,
  GET_USER_INFORMATION,
  GET_TOKEN_START,
  GET_TOKEN_SUCCESS,
  SET_CREDENTIAL,
  EXIT_USER,
} = require('../../store/actionsName');
const getTokenReducer = require('../../store/reducers/loginReducer/getTokenReducer').default;
const { mobileAccountPaths } = require('../../util/helpers/api/MobileAccountPaths');
const { getUserInformation } = require('../../store/reducers/loginReducer/getUserInformation');

const profile = {
  id: 42,
  email: 'person@example.test',
  display_name: 'Mapilio Person',
  user_profile_photo: 'https://cdn.example.test/person.jpg',
  username: 'person',
  str_id: 'person-key',
  user_bio: 'Mapping roads',
  meters: 1234,
};

describe('getUserInformation', () => {
  let originalFormData;
  let authState;

  const hydrate = () => getUserInformation()(mockDispatch, mockGetState);
  const deferred = () => {
    let resolve;
    let reject;
    const promise = new Promise((resolvePromise, rejectPromise) => {
      resolve = resolvePromise;
      reject = rejectPromise;
    });
    return { promise, resolve, reject };
  };

  const changeSession = (change) => {
    if (change === 'logout') {
      mockDispatch({ type: EXIT_USER });
    } else {
      const tokens =
        change === 'new login with identical tokens'
          ? { ...authState.auth }
          : { access_token: 'other-access', refresh_token: 'other-refresh' };
      mockDispatch({ type: GET_TOKEN_START });
      mockDispatch({ type: GET_TOKEN_SUCCESS, payload: tokens });
      mockDispatch({
        type: GET_USER_INFORMATION,
        payload: { id: 99, email: 'other@example.test' },
      });
    }
    mockDispatch.mockClear();
  };

  beforeEach(() => {
    jest.clearAllMocks();
    authState = getTokenReducer(undefined, {
      type: GET_TOKEN_SUCCESS,
      payload: { access_token: 'current-access', refresh_token: 'current-refresh' },
    });
    mockGetState.mockImplementation(() => ({ getTokenReducer: authState }));
    mockDispatch.mockImplementation((action) => {
      authState = getTokenReducer(authState, action);
    });
    originalFormData = global.FormData;
    global.FormData = RecordingFormData;
    mockGet.mockReset().mockResolvedValue({ data: [profile] });
    mockPost.mockReset().mockResolvedValue({ data: { verified: true } });
  });

  afterEach(() => {
    global.FormData = originalFormData;
  });

  it('maps the versioned profile envelope into the expected Redux and Sentry identities', async () => {
    await hydrate();

    expect(mockGet).toHaveBeenCalledWith(mobileAccountPaths.profile);
    expect(mockDispatch).toHaveBeenNthCalledWith(1, {
      type: GET_USER_INDEX_TYPE,
      payload: {
        index: 0,
        type: {
          accountType: 'Individual',
          displayName: 'Mapilio Person',
          picture: 'https://cdn.example.test/person.jpg',
          username: 'person',
          key: 'person-key',
          id: 42,
          bio: 'Mapping roads',
          meters: 1234,
        },
      },
    });
    expect(mockDispatch).toHaveBeenNthCalledWith(2, {
      type: GET_USER_INFORMATION,
      payload: profile,
    });
    expect(mockSetUser).toHaveBeenCalledWith({ id: '42', email: 'person@example.test' });
  });

  it('verifies the email at the versioned endpoint before registering it with OneSignal', async () => {
    await hydrate();

    expect(mockPost).toHaveBeenCalledTimes(1);
    const [path, body, options] = mockPost.mock.calls[0];
    expect(path).toBe(mobileAccountPaths.onesignalIdentityVerification);
    expect(body.entries).toEqual({
      'options[parameters][email]': 'person@example.test',
    });
    expect(options).toEqual({ headers: { 'Content-Type': 'multipart/form-data' } });
    expect(mockAddEmail).toHaveBeenCalledWith('person@example.test');
    expect(mockPost.mock.invocationCallOrder[0]).toBeLessThan(
      mockAddEmail.mock.invocationCallOrder[0]
    );
  });

  it.each(['logout', 'new login', 'new login with identical tokens'])(
    'does not apply a late profile success after %s',
    async (change) => {
      const response = deferred();
      mockGet.mockReturnValueOnce(response.promise);
      const pending = hydrate();
      changeSession(change);
      const currentState = authState;
      response.resolve({ data: [profile] });

      await expect(pending).resolves.toBeNull();

      expect(authState).toBe(currentState);
      expect(mockDispatch).not.toHaveBeenCalled();
      expect(mockSetUser).not.toHaveBeenCalled();
      expect(mockPost).not.toHaveBeenCalled();
      expect(mockAddEmail).not.toHaveBeenCalled();
    }
  );

  it.each(['logout', 'new login', 'new login with identical tokens'])(
    'consumes a stale profile failure after %s',
    async (change) => {
      const response = deferred();
      mockGet.mockReturnValueOnce(response.promise);
      const pending = hydrate();
      changeSession(change);
      const currentState = authState;
      response.reject(new Error('old request failed'));

      await expect(pending).resolves.toBeNull();

      expect(authState).toBe(currentState);
      expect(mockDispatch).not.toHaveBeenCalled();
      expect(mockSetUser).not.toHaveBeenCalled();
      expect(mockPost).not.toHaveBeenCalled();
      expect(mockAddEmail).not.toHaveBeenCalled();
    }
  );

  it.each(['success', 'failure'])(
    'ignores a late email-verification %s after a new login',
    async (outcome) => {
      const response = deferred();
      mockPost.mockReturnValueOnce(response.promise);
      const pending = hydrate();
      await Promise.resolve();
      expect(mockPost).toHaveBeenCalledTimes(1);

      changeSession('new login');
      const currentState = authState;
      mockSetUser.mockClear();
      if (outcome === 'success') response.resolve({ data: { verified: true } });
      else response.reject(new Error('old verification failed'));

      await expect(pending).resolves.toBeNull();

      expect(authState).toBe(currentState);
      expect(mockDispatch).not.toHaveBeenCalled();
      expect(mockSetUser).not.toHaveBeenCalled();
      expect(mockAddEmail).not.toHaveBeenCalled();
    }
  );

  it('keeps profile hydration valid across credential completion and normal token refresh', async () => {
    const response = deferred();
    const sessionVersion = authState.sessionVersion;
    const refreshedAuth = { access_token: 'refreshed-access', refresh_token: 'refreshed-refresh' };
    mockGet.mockReturnValueOnce(response.promise);
    const pending = hydrate();

    mockDispatch({ type: SET_CREDENTIAL, payload: { type: 'default' } });
    mockDispatch({
      type: GET_TOKEN_SUCCESS,
      payload: refreshedAuth,
      meta: { isTokenRefresh: true },
    });
    mockDispatch.mockClear();
    response.resolve({ data: [profile] });
    await pending;

    expect(authState.sessionVersion).toBe(sessionVersion);
    expect(authState.auth).toBe(refreshedAuth);
    expect(authState.userInformation).toBe(profile);
    expect(mockSetUser).toHaveBeenCalledWith({ id: '42', email: profile.email });
    expect(mockAddEmail).toHaveBeenCalledWith(profile.email);
  });

  it('keeps the hydrated profile and email registration after refresh during verification', async () => {
    const response = deferred();
    mockPost.mockReturnValueOnce(response.promise);
    const pending = hydrate();
    await Promise.resolve();
    expect(authState.userInformation).toBe(profile);

    mockDispatch({
      type: GET_TOKEN_SUCCESS,
      payload: { access_token: 'refreshed-access', refresh_token: 'refreshed-refresh' },
      meta: { isTokenRefresh: true },
    });
    response.resolve({ data: { verified: true } });
    await pending;

    expect(authState.userInformation).toBe(profile);
    expect(mockAddEmail).toHaveBeenCalledWith(profile.email);
  });

  it('propagates a profile failure to its owner while the session is still current', async () => {
    const response = deferred();
    const failure = new Error('profile unavailable');
    mockGet.mockReturnValueOnce(response.promise);
    const pending = hydrate();
    response.reject(failure);

    await expect(pending).rejects.toBe(failure);
    expect(mockDispatch).not.toHaveBeenCalled();
    expect(mockSetUser).not.toHaveBeenCalled();
  });

  it('propagates an email-verification failure while the session is still current', async () => {
    const response = deferred();
    const failure = new Error('verification unavailable');
    mockPost.mockReturnValueOnce(response.promise);
    const pending = hydrate();
    await Promise.resolve();
    response.reject(failure);

    await expect(pending).rejects.toBe(failure);
    expect(mockAddEmail).not.toHaveBeenCalled();
  });

  it('does not start profile hydration without an authenticated session', async () => {
    mockDispatch({ type: EXIT_USER });
    mockDispatch.mockClear();

    await expect(hydrate()).resolves.toBeNull();
    expect(mockGet).not.toHaveBeenCalled();
    expect(mockDispatch).not.toHaveBeenCalled();
  });
});
