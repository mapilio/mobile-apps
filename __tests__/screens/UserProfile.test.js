import React from 'react';
import renderer, { act } from 'react-test-renderer';

const mockLoadProfile = jest.fn();
const mockStore = { dispatch: jest.fn(), getState: jest.fn() };

jest.mock('react-redux', () => ({
  useDispatch: () => mockStore.dispatch,
  useSelector: (selector) => selector(mockStore.getState()),
  useStore: () => mockStore,
}));

jest.mock('react-native', () => ({
  View: 'View',
  Platform: { OS: 'ios', select: (options) => options.ios ?? options.default },
  NativeModules: {},
  TurboModuleRegistry: { get: jest.fn(() => null), getEnforcing: jest.fn(() => ({})) },
}));

jest.mock('../../styles/globalStyles', () => ({ globalStyles: { container: {} } }));
jest.mock('react-native-responsive-fontsize', () => ({ RFValue: (value) => value }));
jest.mock('../../components', () => ({
  FeedList: 'FeedList',
  FocusAwareStatusBar: 'FocusAwareStatusBar',
}));
jest.mock('../../util/helpers', () => ({ translate: (key) => key }));
jest.mock('../../store/reducers/loginReducer/getUserInformation', () => ({
  getUserInformation:
    () =>
    (...args) =>
      mockLoadProfile(...args),
}));

const UserProfile = require('../../screens/UserProfile').default;
const getTokenReducer = require('../../store/reducers/loginReducer/getTokenReducer').default;
const { EXIT_USER, GET_TOKEN_SUCCESS } = require('../../store/actionsName');
const { Routes } = require('../../navigator/Routes');

describe('UserProfile request ownership', () => {
  let tree;
  let store;
  let navigation;
  let parentNavigation;
  let resolveProfile;
  let rejectProfile;

  const renderProfile = async () => {
    await act(async () => {
      tree = renderer.create(<UserProfile navigation={navigation} />);
    });
  };

  beforeEach(() => {
    mockLoadProfile.mockReset();
    global.toast.show.mockClear();
    store = mockStore;
    let authState = getTokenReducer(undefined, { type: '@@INIT' });
    store.getState.mockImplementation(() => ({ getTokenReducer: authState }));
    store.dispatch.mockReset();
    store.dispatch.mockImplementation((action) => {
      if (typeof action === 'function') return action(store.dispatch, store.getState);
      authState = getTokenReducer(authState, action);
      return action;
    });
    store.dispatch({
      type: GET_TOKEN_SUCCESS,
      payload: { access_token: 'stored-access', refresh_token: 'stored-refresh' },
    });
    parentNavigation = { replace: jest.fn() };
    navigation = { getParent: () => parentNavigation, goBack: jest.fn() };
    mockLoadProfile.mockImplementation(
      () =>
        new Promise((resolve, reject) => {
          resolveProfile = resolve;
          rejectProfile = reject;
        })
    );
  });

  afterEach(async () => {
    if (tree) {
      await act(async () => {
        tree.unmount();
      });
      tree = null;
    }
  });

  it('keeps the profile view after successful hydration', async () => {
    await renderProfile();

    expect(mockLoadProfile).toHaveBeenCalledTimes(1);
    expect(tree.root.findAllByType('FeedList')).toHaveLength(1);

    await act(async () => {
      resolveProfile();
    });

    expect(tree.root.findAllByType('FeedList')).toHaveLength(1);
    expect(parentNavigation.replace).not.toHaveBeenCalled();
    expect(navigation.goBack).not.toHaveBeenCalled();
  });

  it('handles an expired refresh rejection and replaces the protected navigator with sign-in', async () => {
    await renderProfile();

    await act(async () => {
      store.dispatch({ type: GET_TOKEN_SUCCESS, payload: null });
      store.dispatch({ type: EXIT_USER });
      tree.update(<UserProfile navigation={navigation} />);
      rejectProfile(new Error('Your session has expired. Please login again.'));
    });

    expect(tree.root.findAllByType('FeedList')).toHaveLength(0);
    expect(parentNavigation.replace).toHaveBeenCalledTimes(1);
    expect(parentNavigation.replace).toHaveBeenCalledWith(Routes.auth, { screen: Routes.login });
    expect(navigation.goBack).not.toHaveBeenCalled();
    expect(global.toast.show).not.toHaveBeenCalled();
    expect(store.getState().getTokenReducer.auth).toBeNull();
  });

  it('stops the profile loading view and reports a failure without clearing a valid session', async () => {
    const auth = store.getState().getTokenReducer.auth;
    await renderProfile();

    await act(async () => {
      rejectProfile(new Error('network unavailable'));
    });

    expect(tree.root.findAllByType('FeedList')).toHaveLength(0);
    expect(global.toast.show).toHaveBeenCalledWith('fetch_error', { type: 'error' });
    expect(navigation.goBack).toHaveBeenCalledTimes(1);
    expect(parentNavigation.replace).not.toHaveBeenCalled();
    expect(store.getState().getTokenReducer.auth).toBe(auth);
  });

  it('handles a profile failure after its own session refresh rotates tokens', async () => {
    const refreshedAuth = { access_token: 'refreshed-access', refresh_token: 'refreshed-refresh' };
    await renderProfile();

    await act(async () => {
      store.dispatch({
        type: GET_TOKEN_SUCCESS,
        payload: refreshedAuth,
        meta: { isTokenRefresh: true },
      });
      tree.update(<UserProfile navigation={navigation} />);
      rejectProfile(new Error('profile unavailable after refresh'));
    });

    expect(mockLoadProfile).toHaveBeenCalledTimes(1);
    expect(tree.root.findAllByType('FeedList')).toHaveLength(0);
    expect(navigation.goBack).toHaveBeenCalledTimes(1);
    expect(global.toast.show).toHaveBeenCalledWith('fetch_error', { type: 'error' });
    expect(parentNavigation.replace).not.toHaveBeenCalled();
    expect(store.getState().getTokenReducer.auth).toBe(refreshedAuth);
  });

  it.each([
    ['a different account', { access_token: 'new-access', refresh_token: 'new-refresh' }],
    [
      'a new login with identical tokens',
      { access_token: 'stored-access', refresh_token: 'stored-refresh' },
    ],
  ])(
    'does not change the current profile after an old request fails for %s',
    async (_, newAuth) => {
      await renderProfile();

      await act(async () => {
        store.dispatch({ type: GET_TOKEN_SUCCESS, payload: newAuth });
        tree.update(<UserProfile navigation={navigation} />);
        rejectProfile(new Error('old session request failed'));
      });

      expect(mockLoadProfile).toHaveBeenCalledTimes(1);
      expect(tree.root.findAllByType('FeedList')).toHaveLength(1);
      expect(parentNavigation.replace).not.toHaveBeenCalled();
      expect(navigation.goBack).not.toHaveBeenCalled();
      expect(global.toast.show).not.toHaveBeenCalled();
      expect(store.getState().getTokenReducer.auth).toBe(newAuth);
    }
  );

  it('opens sign-in without requesting a profile when no session exists', async () => {
    store.dispatch({ type: EXIT_USER });

    await renderProfile();

    expect(mockLoadProfile).not.toHaveBeenCalled();
    expect(tree.root.findAllByType('FeedList')).toHaveLength(0);
    expect(parentNavigation.replace).toHaveBeenCalledWith(Routes.auth, { screen: Routes.login });
  });

  it('consumes a request rejection after the profile screen unmounts', async () => {
    await renderProfile();

    await act(async () => {
      tree.unmount();
    });
    tree = null;

    await act(async () => {
      rejectProfile(new Error('late profile failure'));
    });

    expect(parentNavigation.replace).not.toHaveBeenCalled();
    expect(navigation.goBack).not.toHaveBeenCalled();
    expect(global.toast.show).not.toHaveBeenCalled();
  });
});
