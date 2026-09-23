import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { Alert } from 'react-native';
import DeleteAccount from '../../screens/Profile/DeleteAccount';
import { EXIT_USER } from '../../store/actionsName';
import { Routes } from '../../navigator/Routes';

const mockDelete = jest.fn();
const mockAuthorizeGoogle = jest.fn();
const mockDispatch = jest.fn();
const mockNavigate = jest.fn();
const mockRemoveEmail = jest.fn();
const mockFacebookLogout = jest.fn();
const mockAppleState = jest.fn();
const mockAppleRefresh = jest.fn();
let mockCredential;

jest.mock('../../util/helpers/api/MobileAccountApi', () => ({
  mobileAccountApi: { deleteAccount: (...args) => mockDelete(...args) },
}));
jest.mock('../../components/SocialLogin/googleDeletionAuthorization', () => ({
  authorizeGoogleDeletion: (...args) => mockAuthorizeGoogle(...args),
}));
jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: (select) =>
    select({
      getTokenReducer: {
        credential: mockCredential,
        userInformation: { email: 'mapper@example.test' },
      },
    }),
}));
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
}));
jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key) => key }) }));
jest.mock('../../components', () => ({ Button: 'Button', FocusAwareStatusBar: 'StatusBar' }));
jest.mock('../../assets/svg/illustrations', () => ({ SadWorld: 'SadWorld' }));
jest.mock('../../screens/Profile/DeleteAccount.styles', () => ({}));
jest.mock('react-native-onesignal', () => ({
  OneSignal: { User: { removeEmail: (...args) => mockRemoveEmail(...args) } },
}));
jest.mock('react-native-fbsdk-next', () => ({
  LoginManager: { logOut: (...args) => mockFacebookLogout(...args) },
}));
jest.mock('expo-apple-authentication', () => ({
  AppleAuthenticationCredentialState: { AUTHORIZED: 1 },
  getCredentialStateAsync: (...args) => mockAppleState(...args),
  refreshAsync: (...args) => mockAppleRefresh(...args),
}));

describe('account deletion screen', () => {
  let tree;
  beforeEach(() => {
    jest.clearAllMocks();
    mockCredential = { type: 'default' };
    mockDelete.mockResolvedValue({ status: true, response: { success: true } });
    mockAuthorizeGoogle.mockResolvedValue('fresh-google-token');
    mockAppleState.mockResolvedValue(1);
    mockAppleRefresh.mockResolvedValue({ authorizationCode: 'fresh-apple-code' });
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  });
  afterEach(() => {
    if (tree) act(() => tree.unmount());
    jest.restoreAllMocks();
  });

  const confirmDeletion = () => {
    act(() => {
      tree = renderer.create(<DeleteAccount />);
    });
    act(() => tree.root.findByType('Button').props.onPress());
    expect(mockDelete).not.toHaveBeenCalled();
    return Alert.alert.mock.calls[0][2][1].onPress;
  };

  it('does nothing when the confirmation is cancelled', () => {
    confirmDeletion();
    const cancel = Alert.alert.mock.calls[0][2][0];
    expect(cancel.text).toBe('cancel');
    expect(cancel.onPress).toBeUndefined();
    expect(mockAuthorizeGoogle).not.toHaveBeenCalled();
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it.each(['default', 'openstreetmap'])('preserves %s deletion', async (type) => {
    mockCredential = { type };
    const confirm = confirmDeletion();
    await act(async () => confirm());
    expect(mockDelete).toHaveBeenCalledWith({ delete: true, login_type: 'default' });
    expect(mockDispatch).toHaveBeenCalledWith({ type: EXIT_USER });
    expect(mockNavigate).toHaveBeenCalledWith(Routes.tabNavigator, { screen: Routes.map });
  });

  it('sends fresh Google proof without replacing or persisting the signed-in session', async () => {
    mockCredential = { type: 'google' };
    const confirm = confirmDeletion();
    await act(async () => confirm());
    expect(mockDelete).toHaveBeenCalledWith({
      delete: true,
      login_type: 'google',
      provider_token: 'fresh-google-token',
    });
    expect(mockDispatch.mock.calls).toEqual([[{ type: EXIT_USER }]]);
    expect(mockFacebookLogout).not.toHaveBeenCalled();
    expect(tree.root.findByType('Button').props.loading).toBe(false);
  });

  it('keeps the account and clears loading when Google authorization is cancelled', async () => {
    mockCredential = { type: 'google' };
    mockAuthorizeGoogle.mockResolvedValue(null);
    const confirm = confirmDeletion();
    await act(async () => confirm());
    expect(mockDelete).not.toHaveBeenCalled();
    expect(mockDispatch).not.toHaveBeenCalled();
    expect(toast.show).not.toHaveBeenCalled();
    expect(tree.root.findByType('Button').props.disabled).toBe(false);
  });

  it('does not fall back to default deletion when Google authorization fails', async () => {
    mockCredential = { type: 'google' };
    mockAuthorizeGoogle.mockRejectedValue(new Error('provider failure'));
    const confirm = confirmDeletion();
    await act(async () => confirm());
    expect(mockDelete).not.toHaveBeenCalled();
    expect(mockDispatch).not.toHaveBeenCalled();
    expect(toast.show).toHaveBeenCalledWith('delete_error', { type: 'error' });
    expect(tree.root.findByType('Button').props.loading).toBe(false);
  });

  it('uses server-side Facebook revocation before local SDK logout', async () => {
    mockCredential = { type: 'facebook' };
    const confirm = confirmDeletion();
    await act(async () => confirm());
    expect(mockDelete).toHaveBeenCalledWith({ delete: true, login_type: 'facebook' });
    expect(mockFacebookLogout).toHaveBeenCalledTimes(1);
    expect(mockDelete.mock.invocationCallOrder[0]).toBeLessThan(
      mockFacebookLogout.mock.invocationCallOrder[0]
    );
  });

  it.each(['google', 'facebook', 'apple'])(
    'keeps the session on %s backend failure',
    async (type) => {
      mockCredential = { type, user: 'apple-user' };
      mockDelete.mockRejectedValue(new Error('provider could not be revoked'));
      const confirm = confirmDeletion();
      await act(async () => confirm());
      expect(mockDelete).toHaveBeenCalledTimes(1);
      expect(mockDispatch).not.toHaveBeenCalled();
      expect(mockFacebookLogout).not.toHaveBeenCalled();
      expect(mockRemoveEmail).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
      expect(tree.root.findByType('Button').props.loading).toBe(false);
    }
  );

  it('requires an explicit success response before clearing the session', async () => {
    mockDelete.mockResolvedValue({ success: false });
    const confirm = confirmDeletion();
    await act(async () => confirm());
    expect(mockDispatch).not.toHaveBeenCalled();
    expect(toast.show).toHaveBeenCalledWith('delete_error', { type: 'error' });
  });

  it('prevents duplicate submissions while a deletion is pending', async () => {
    let resolve;
    mockDelete.mockReturnValue(new Promise((done) => (resolve = done)));
    const confirm = confirmDeletion();
    let pending;
    await act(async () => {
      pending = confirm();
      await confirm();
    });
    expect(mockDelete).toHaveBeenCalledTimes(1);
    expect(tree.root.findByType('Button').props.loading).toBe(true);
    await act(async () => {
      resolve({ status: true, response: { success: true } });
      await pending;
    });
  });

  it('finishes local sign-out even if optional SDK cleanup fails', async () => {
    mockCredential = { type: 'facebook' };
    mockFacebookLogout.mockImplementationOnce(() => {
      throw new Error('SDK unavailable');
    });
    mockRemoveEmail.mockImplementationOnce(() => {
      throw new Error('SDK unavailable');
    });
    const confirm = confirmDeletion();
    await act(async () => confirm());
    expect(mockDispatch).toHaveBeenCalledWith({ type: EXIT_USER });
    expect(mockNavigate).toHaveBeenCalled();
    expect(toast.show).not.toHaveBeenCalled();
  });

  it('preserves Apple authorization-code deletion', async () => {
    mockCredential = { type: 'apple', user: 'apple-user' };
    const confirm = confirmDeletion();
    await act(async () => confirm());
    expect(mockAppleRefresh).toHaveBeenCalledWith({ user: 'apple-user' });
    expect(mockDelete).toHaveBeenCalledWith({
      delete: true,
      login_type: 'apple',
      auth_code: 'fresh-apple-code',
    });
    expect(tree.root.findByType('Button').props.loading).toBe(false);
  });

  it.each(['unauthorized', 'missing code', 'cancelled'])(
    'does not fall through from Apple %s',
    async (scenario) => {
      mockCredential = { type: 'apple', user: 'apple-user' };
      if (scenario === 'unauthorized') mockAppleState.mockResolvedValue(0);
      if (scenario === 'missing code') mockAppleRefresh.mockResolvedValue({});
      if (scenario === 'cancelled')
        mockAppleRefresh.mockRejectedValue({ code: 'ERR_REQUEST_CANCELED' });
      const confirm = confirmDeletion();
      await act(async () => confirm());
      expect(mockDelete).not.toHaveBeenCalled();
      expect(mockDispatch).not.toHaveBeenCalled();
      expect(tree.root.findByType('Button').props.loading).toBe(false);
    }
  );

  it('asks for sign-in when the credential type is missing', async () => {
    mockCredential = undefined;
    const confirm = confirmDeletion();
    await act(async () => confirm());
    expect(mockDelete).not.toHaveBeenCalled();
    expect(Alert.alert.mock.calls[1][0]).toBe('login_again');
  });

  it('rejects an unknown provider without deleting the account', async () => {
    mockCredential = { type: 'unknown' };
    const confirm = confirmDeletion();
    await act(async () => confirm());
    expect(mockDelete).not.toHaveBeenCalled();
    expect(mockDispatch).not.toHaveBeenCalled();
  });
});
