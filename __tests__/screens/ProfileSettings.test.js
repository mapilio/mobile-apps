const mockDispatch = jest.fn();
const mockNavigate = jest.fn();
const mockLogoutUser = jest.fn();
const mockRemoveEmail = jest.fn();
const mockGetCurrentProfile = jest.fn();
const mockFacebookLogout = jest.fn();

jest.mock('../../helper/user', () => ({
  logoutUser: (...args) => mockLogoutUser(...args),
}));

jest.mock('react-native-onesignal', () => ({
  OneSignal: { User: { removeEmail: (...args) => mockRemoveEmail(...args) } },
}));

jest.mock('react-native-fbsdk-next', () => ({
  LoginManager: { logOut: (...args) => mockFacebookLogout(...args) },
  Profile: { getCurrentProfile: (...args) => mockGetCurrentProfile(...args) },
}));

jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: () => ({
    generalReducer: { debugMode: false },
    getTokenReducer: { auth, credential, userInformation },
  }),
}));

jest.mock('../../highordercomponents', () => ({ CustomText: 'CustomText' }));
jest.mock('../../components/FocusAwareStatusBar', () => 'FocusAwareStatusBar');
jest.mock('expo-application', () => ({ nativeApplicationVersion: '1.2.1' }));
jest.mock('react-native-responsive-fontsize', () => ({ RFValue: (value) => value }));

const { EXIT_USER } = require('../../store/actionsName');
const { Routes } = require('../../navigator/Routes');
const { signOutUser } = require('../../screens/ProfileSettings');

const auth = { access_token: 'access-snapshot', refresh_token: 'refresh-snapshot' };
const credential = {
  access_token: 'provider-access',
  refresh_token: 'provider-refresh',
  type: 'facebook',
};
const userInformation = { email: 'person@example.test' };

const signOut = () =>
  signOutUser({
    auth,
    credential,
    dispatch: mockDispatch,
    navigation: { navigate: mockNavigate },
    userInformation,
  });

describe('ProfileSettings sign out', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetCurrentProfile.mockResolvedValue({ id: 'facebook-profile' });
  });

  it('clears local auth and navigates while server logout is still pending', () => {
    mockLogoutUser.mockReturnValue(new Promise(() => {}));

    signOut();

    expect(mockDispatch).toHaveBeenCalledWith({ type: EXIT_USER });
    expect(mockNavigate).toHaveBeenCalledWith(Routes.tabNavigator, { screen: Routes.map });
    expect(mockRemoveEmail).toHaveBeenCalledWith('person@example.test');
    expect(mockLogoutUser).toHaveBeenCalledWith({
      access_token: 'access-snapshot',
      refresh_token: 'refresh-snapshot',
    });
    expect(mockDispatch.mock.invocationCallOrder[0]).toBeLessThan(
      mockLogoutUser.mock.invocationCallOrder[0]
    );
  });

  it('keeps local cleanup complete when server logout rejects', async () => {
    mockLogoutUser.mockRejectedValue(new Error('network rejected'));

    expect(() => signOut()).not.toThrow();
    await Promise.resolve();

    expect(mockDispatch).toHaveBeenCalledWith({ type: EXIT_USER });
    expect(mockNavigate).toHaveBeenCalledWith(Routes.tabNavigator, { screen: Routes.map });
    expect(mockRemoveEmail).toHaveBeenCalledWith('person@example.test');
    expect(mockGetCurrentProfile).toHaveBeenCalledTimes(1);
    await Promise.resolve();
    expect(mockFacebookLogout).toHaveBeenCalledTimes(1);
  });

  it('starts revocation and continues provider cleanup when navigation throws', () => {
    mockLogoutUser.mockResolvedValue(true);
    mockNavigate.mockImplementationOnce(() => {
      throw new Error('navigation failed');
    });

    expect(() => signOut()).not.toThrow();

    expect(mockLogoutUser).toHaveBeenCalledWith({
      access_token: 'access-snapshot',
      refresh_token: 'refresh-snapshot',
    });
    expect(mockRemoveEmail).toHaveBeenCalledWith('person@example.test');
    expect(mockGetCurrentProfile).toHaveBeenCalledTimes(1);
    expect(mockLogoutUser.mock.invocationCallOrder[0]).toBeLessThan(
      mockNavigate.mock.invocationCallOrder[0]
    );
  });

  it('starts revocation and continues Facebook cleanup when OneSignal throws', () => {
    mockLogoutUser.mockResolvedValue(true);
    mockRemoveEmail.mockImplementationOnce(() => {
      throw new Error('OneSignal failed');
    });

    expect(() => signOut()).not.toThrow();

    expect(mockLogoutUser).toHaveBeenCalledWith({
      access_token: 'access-snapshot',
      refresh_token: 'refresh-snapshot',
    });
    expect(mockNavigate).toHaveBeenCalledWith(Routes.tabNavigator, { screen: Routes.map });
    expect(mockGetCurrentProfile).toHaveBeenCalledTimes(1);
    expect(mockLogoutUser.mock.invocationCallOrder[0]).toBeLessThan(
      mockRemoveEmail.mock.invocationCallOrder[0]
    );
  });

  it('consumes a rejected Facebook profile lookup', async () => {
    mockLogoutUser.mockResolvedValue(true);
    mockGetCurrentProfile.mockRejectedValue(new Error('profile lookup failed'));

    expect(() => signOut()).not.toThrow();
    await Promise.resolve();
    await Promise.resolve();

    expect(mockGetCurrentProfile).toHaveBeenCalledTimes(1);
    expect(mockFacebookLogout).not.toHaveBeenCalled();
  });
});
