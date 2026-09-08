jest.mock('react-native', () => ({
  Alert: { alert: jest.fn() },
  Linking: { openURL: jest.fn() },
  Platform: { OS: 'android' },
}));

jest.mock('expo-application', () => ({
  __esModule: true,
  nativeApplicationVersion: '1.2.1',
}));
jest.mock('expo-network', () => ({}));
jest.mock('../../util/helpers/api', () => ({ api: {}, cdn: {} }));
jest.mock('../../util/helpers', () => ({
  translate: (key) => key,
}));

const mockReactNative = jest.requireMock('react-native');
const mockAlert = mockReactNative.Alert.alert;
const mockOpenURL = mockReactNative.Linking.openURL;
const mockPlatform = mockReactNative.Platform;
const mockApplication = jest.requireMock('expo-application');
const { checkVersion } = require('../../store/actions/generalReducer');

describe('checkVersion', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPlatform.OS = 'android';
    mockApplication.nativeApplicationVersion = '1.2.1';
  });

  it.each([
    ['reported Android version is newer than the server version', '1.2.1', '1.0.56', false],
    ['multi-digit server version is newer', '1.9.10', '1.10.0', true],
    ['installed version is older', '1.0.56', '1.2.1', true],
    ['versions are equal', '1.2.1', '1.2.1', false],
  ])('%s', (_, installedVersion, serverVersion, shouldAlert) => {
    mockApplication.nativeApplicationVersion = installedVersion;

    checkVersion({ version: serverVersion });

    expect(mockAlert).toHaveBeenCalledTimes(shouldAlert ? 1 : 0);
  });

  it.each([
    ['ios', 'https://apps.apple.com/tr/app/mapilio/id1609035791'],
    ['android', 'https://play.google.com/store/apps/details?id=com.mapilio.app'],
  ])('keeps the %s update alert copy and store URL', (platform, storeURL) => {
    mockPlatform.OS = platform;
    mockApplication.nativeApplicationVersion = '1.0.56';

    checkVersion({ version: '1.2.1' });

    expect(mockAlert).toHaveBeenCalledWith('update_required_title', 'update_required_description', [
      { text: 'later', style: 'cancel' },
      { text: 'update', onPress: expect.any(Function) },
    ]);
    const buttons = mockAlert.mock.calls[0][2];
    buttons[1].onPress();
    expect(mockOpenURL).toHaveBeenCalledWith(storeURL);
  });

  it.each([
    [null, '1.2.1'],
    [undefined, '1.2.1'],
    ['not-a-version', '1.2.1'],
    ['1.2.1', null],
    ['1.2.1', undefined],
    ['1.2.1', 'not-a-version'],
  ])('ignores missing or malformed version data (%p, %p)', (installedVersion, serverVersion) => {
    mockApplication.nativeApplicationVersion = installedVersion;

    expect(() =>
      checkVersion(serverVersion === undefined ? {} : { version: serverVersion })
    ).not.toThrow();
    expect(mockAlert).not.toHaveBeenCalled();
  });

  it('ignores null version data', () => {
    expect(() => checkVersion(null)).not.toThrow();
    expect(mockAlert).not.toHaveBeenCalled();
  });

  it('keeps unsupported platform behavior without showing an update', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    mockPlatform.OS = 'web';

    expect(() => checkVersion({ version: '1.2.1' })).not.toThrow();

    expect(warn).toHaveBeenCalledWith(
      'Platform is not supported for version check. Expected ios or android, got web'
    );
    expect(mockAlert).not.toHaveBeenCalled();
    warn.mockRestore();
  });
});
