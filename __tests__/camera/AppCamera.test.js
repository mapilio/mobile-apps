import React from 'react';
import renderer, { act } from 'react-test-renderer';

const mockRemove = jest.fn();

jest.mock('react-native', () => {
  return {
    BackHandler: {
      addEventListener: jest.fn(() => ({ remove: mockRemove })),
    },
    AppState: { addEventListener: jest.fn(() => ({ remove: jest.fn() })) },
    Platform: {},
    StatusBar: { setHidden: jest.fn() },
    StyleSheet: { create: (styles) => styles },
    Text: () => null,
    NativeModules: {},
    TurboModuleRegistry: {
      get: jest.fn(() => null),
      getEnforcing: jest.fn(() => ({})),
    },
  };
});

jest.mock('../../components', () => ({
  Camera: () => null,
  CameraSidebar: () => null,
  Loading: () => null,
}));
jest.mock('../../hooks/ui', () => ({ useOrientation: () => 'LANDSCAPE' }));
jest.mock('react-redux', () => ({ useDispatch: () => jest.fn() }));
jest.mock('@react-navigation/native', () => ({
  CommonActions: { reset: jest.fn() },
  useNavigation: () => ({ dispatch: jest.fn() }),
}));
jest.mock('expo-location', () => ({
  LocationAccuracy: { BestForNavigation: 6 },
  watchPositionAsync: jest.fn(() => Promise.resolve({ remove: jest.fn() })),
}));
jest.mock('expo-screen-orientation', () => ({
  OrientationLock: { LANDSCAPE: 'LANDSCAPE', PORTRAIT_UP: 'PORTRAIT_UP' },
  lockAsync: jest.fn(() => Promise.resolve()),
}));
jest.mock('expo-keep-awake', () => ({
  activateKeepAwakeAsync: jest.fn(() => Promise.resolve()),
  deactivateKeepAwake: jest.fn(() => Promise.resolve()),
}));
jest.mock('expo-brightness', () => ({ setSystemBrightnessAsync: jest.fn() }));
jest.mock('@sentry/react-native', () => ({ captureException: jest.fn() }));
jest.mock('react-native-uuid', () => ({ v4: jest.fn(() => 'test-group') }));
jest.mock('react-native-responsive-fontsize', () => ({ RFValue: (value) => value }));
jest.mock('../../helper/camera', () => ({ exitCapture: jest.fn() }));
jest.mock('expo-linear-gradient', () => ({ LinearGradient: () => null }));
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }) => children,
  SafeAreaView: ({ children }) => children,
}));

const { BackHandler } = require('react-native');
const ScreenOrientation = require('expo-screen-orientation');
const AppCamera = require('../../screens/AppCamera').default;

describe('AppCamera', () => {
  it('removes the BackHandler subscription and restores portrait mode when unmounted', async () => {
    let appCamera;

    await act(async () => {
      appCamera = renderer.create(<AppCamera />);
    });

    await act(async () => {
      appCamera.unmount();
    });

    expect(BackHandler.addEventListener).toHaveBeenCalledWith(
      'hardwareBackPress',
      expect.any(Function)
    );
    expect(mockRemove).toHaveBeenCalledTimes(1);
    expect(ScreenOrientation.lockAsync).toHaveBeenNthCalledWith(1, 'LANDSCAPE');
    expect(ScreenOrientation.lockAsync).toHaveBeenNthCalledWith(2, 'PORTRAIT_UP');
  });
});
