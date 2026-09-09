const getTokenReducer = require('../../store/reducers/loginReducer/getTokenReducer').default;
const {
  GET_TOKEN_START,
  GET_TOKEN_SUCCESS,
  GET_USER_INFORMATION,
  SET_CREDENTIAL,
  EXIT_USER,
} = require('../../store/actionsName');

const initialAuth = { access_token: 'initial-access', refresh_token: 'initial-refresh' };
const nextAuth = { access_token: 'next-access', refresh_token: 'next-refresh' };
const profile = { id: 42, email: 'person@example.test' };

const loggedInState = () => {
  const state = getTokenReducer(undefined, { type: GET_TOKEN_SUCCESS, payload: initialAuth });
  return getTokenReducer(state, { type: GET_USER_INFORMATION, payload: profile });
};

describe('getTokenReducer session ownership', () => {
  it.each([GET_TOKEN_START, GET_TOKEN_SUCCESS, EXIT_USER])(
    'invalidates pending session work on %s',
    (type) => {
      const state = loggedInState();
      const next = getTokenReducer(state, { type, payload: nextAuth });

      expect(next.sessionVersion).toBe(state.sessionVersion + 1);
      expect(next.userInformation).toBeNull();
      expect(next.auth).toBe(type === GET_TOKEN_SUCCESS ? nextAuth : null);
    }
  );

  it('preserves the session owner and hydrated profile when access tokens rotate', () => {
    const state = loggedInState();
    const next = getTokenReducer(state, {
      type: GET_TOKEN_SUCCESS,
      payload: nextAuth,
      meta: { isTokenRefresh: true },
    });

    expect(next.auth).toBe(nextAuth);
    expect(next.sessionVersion).toBe(state.sessionVersion);
    expect(next.userInformation).toBe(profile);
    expect(state.auth).toBe(initialAuth);
  });

  it('preserves the session owner when password-login credential setup finishes', () => {
    const state = loggedInState();
    const next = getTokenReducer(state, {
      type: SET_CREDENTIAL,
      payload: { type: 'default', ...initialAuth },
    });

    expect(next.sessionVersion).toBe(state.sessionVersion);
    expect(next.auth).toBe(initialAuth);
  });

  it.each([false, true])(
    'handles legacy state without a session counter (refresh: %s)',
    (refresh) => {
      const { sessionVersion, ...legacyState } = loggedInState();
      const next = getTokenReducer(legacyState, {
        type: GET_TOKEN_SUCCESS,
        payload: nextAuth,
        meta: { isTokenRefresh: refresh },
      });

      expect(next.sessionVersion).toBe(refresh ? 0 : 1);
      expect(next.userInformation).toBe(refresh ? profile : null);
    }
  );

  it('invalidates the owner when token clearing carries refresh metadata', () => {
    const state = loggedInState();
    const next = getTokenReducer(state, {
      type: GET_TOKEN_SUCCESS,
      payload: null,
      meta: { isTokenRefresh: true },
    });

    expect(next.sessionVersion).toBe(state.sessionVersion + 1);
    expect(next.auth).toBeNull();
    expect(next.userInformation).toBeNull();
  });
});
