import React from 'react';
import renderer, { act } from 'react-test-renderer';

const mockRemove = jest.fn();
const mockNavigationDispatch = jest.fn();
const mockExitCapture = jest.fn();
const mockUseOrientation = jest.fn(() => mockOrientation);
const mockDispatch = jest.fn();
const mockAppStateRemove = jest.fn();
const mockWatchCallbacks = [];
const mockWatchSubscriptions = [];
const mockWatchPositionAsync = jest.fn((...args) => {
  const callback = args[1];
  const subscription = { remove: jest.fn() };
  mockWatchCallbacks.push(callback);
  mockWatchSubscriptions.push(subscription);
  return Promise.resolve(subscription);
});
let mockOrientation = 'LANDSCAPE';
let mockAppStateHandler;

jest.mock('react-native', () => {
  const ReactNative = require('react');

  return {
    BackHandler: {
      addEventListener: jest.fn(() => ({ remove: mockRemove })),
    },
    AppState: {
      currentState: 'active',
      addEventListener: jest.fn((event, handler) => {
        mockAppStateHandler = handler;
        return { remove: mockAppStateRemove };
      }),
    },
    Platform: {},
    StatusBar: { setHidden: jest.fn() },
    StyleSheet: { create: (styles) => styles },
    Text: ({ children, ...props }) => ReactNative.createElement('Text', props, children),
    TouchableOpacity: ({ children, ...props }) =>
      ReactNative.createElement('TouchableOpacity', props, children),
    View: ({ children, ...props }) => ReactNative.createElement('View', props, children),
    NativeModules: {},
    TurboModuleRegistry: {
      get: jest.fn(() => null),
      getEnforcing: jest.fn(() => ({})),
    },
  };
});

jest.mock('../../components', () => ({
  Camera: () => require('react').createElement('Camera'),
  CameraSidebar: () => null,
}));
jest.mock('../../hooks/ui', () => ({ useOrientation: mockUseOrientation }));
jest.mock('react-redux', () => ({ useDispatch: () => mockDispatch }));
jest.mock('@react-navigation/native', () => ({
  CommonActions: { reset: jest.fn() },
  useNavigation: () => ({ dispatch: mockNavigationDispatch }),
}));
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) =>
      ({
        exit_camera: 'Exit camera',
        orientation_required: 'Landscape orientation required',
      })[key] || key,
  }),
}));
jest.mock('expo-location', () => ({
  LocationAccuracy: { BestForNavigation: 6 },
  watchPositionAsync: mockWatchPositionAsync,
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
jest.mock('../../helper/camera', () => ({ exitCapture: mockExitCapture }));
jest.mock('expo-linear-gradient', () => ({ LinearGradient: () => null }));
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children, ...props }) =>
    require('react').createElement('SafeAreaProvider', props, children),
  SafeAreaView: ({ children, ...props }) =>
    require('react').createElement('SafeAreaView', props, children),
}));
jest.mock('../../assets/svg/illustrations', () => ({
  GoBackIcon: () => require('react').createElement('GoBackIcon'),
}));

const { AppState, BackHandler } = require('react-native');
const ScreenOrientation = require('expo-screen-orientation');
const { watchPositionAsync } = require('expo-location');
const { captureException } = require('@sentry/react-native');
const AppCamera = require('../../screens/AppCamera').default;

describe('AppCamera', () => {
  beforeEach(() => {
    mockOrientation = 'LANDSCAPE';
    AppState.currentState = 'active';
    mockAppStateHandler = undefined;
    mockWatchCallbacks.length = 0;
    mockWatchSubscriptions.length = 0;
    jest.clearAllMocks();
  });

  it('shows the orientation message and exits from portrait mode', async () => {
    mockOrientation = 'PORTRAIT';
    let appCamera;

    await act(async () => {
      appCamera = renderer.create(<AppCamera />);
    });

    expect(appCamera.root.findByProps({ children: 'Landscape orientation required' })).toBeTruthy();
    expect(mockUseOrientation).toHaveBeenCalledWith();
    const exitButton = appCamera.root.findByProps({ accessibilityLabel: 'Exit camera' });

    expect(exitButton.props.accessibilityRole).toBe('button');
    expect(exitButton.props.style.minWidth).toBeGreaterThanOrEqual(44);
    expect(exitButton.props.style.minHeight).toBeGreaterThanOrEqual(44);

    await act(async () => {
      exitButton.props.onPress();
    });

    expect(mockExitCapture).toHaveBeenCalledTimes(1);
    expect(mockNavigationDispatch).toHaveBeenCalledTimes(1);

    await act(async () => {
      appCamera.unmount();
    });
  });

  it('reveals the camera when orientation changes to landscape', async () => {
    mockOrientation = 'PORTRAIT';
    let appCamera;

    await act(async () => {
      appCamera = renderer.create(<AppCamera />);
    });

    mockOrientation = 'LANDSCAPE';
    await act(async () => {
      appCamera.update(<AppCamera />);
    });

    expect(appCamera.root.findByType('Camera')).toBeTruthy();
    expect(
      appCamera.root.findAllByProps({ children: 'Landscape orientation required' })
    ).toHaveLength(0);

    await act(async () => {
      appCamera.unmount();
    });
  });

  it('reports a rejected landscape orientation lock', async () => {
    const error = new Error('orientation lock failed');
    ScreenOrientation.lockAsync.mockRejectedValueOnce(error);
    let appCamera;

    await act(async () => {
      appCamera = renderer.create(<AppCamera />);
    });

    expect(captureException).toHaveBeenCalledWith(error);

    await act(async () => {
      appCamera.unmount();
    });
  });

  it('restarts the GPS watcher after becoming active again', async () => {
    let appCamera;

    await act(async () => {
      appCamera = renderer.create(<AppCamera />);
    });
    expect(watchPositionAsync).toHaveBeenCalledTimes(1);

    await act(async () => {
      mockAppStateHandler('inactive');
    });
    expect(mockWatchSubscriptions[0].remove).toHaveBeenCalledTimes(1);

    await act(async () => {
      mockAppStateHandler('active');
    });
    expect(watchPositionAsync).toHaveBeenCalledTimes(2);

    await act(async () => {
      appCamera.unmount();
    });
  });

  it('waits for active state when capture mounts in the background', async () => {
    AppState.currentState = 'background';
    let appCamera;

    await act(async () => {
      appCamera = renderer.create(<AppCamera />);
    });
    expect(watchPositionAsync).not.toHaveBeenCalled();

    await act(async () => {
      mockAppStateHandler('active');
    });
    expect(watchPositionAsync).toHaveBeenCalledTimes(1);

    await act(async () => {
      appCamera.unmount();
    });
  });

  it('does not duplicate watchers for repeated active or inactive states', async () => {
    let appCamera;

    await act(async () => {
      appCamera = renderer.create(<AppCamera />);
    });

    await act(async () => {
      mockAppStateHandler('active');
      mockAppStateHandler('active');
    });
    expect(watchPositionAsync).toHaveBeenCalledTimes(1);

    await act(async () => {
      mockAppStateHandler('inactive');
      mockAppStateHandler('inactive');
    });
    expect(mockWatchSubscriptions[0].remove).toHaveBeenCalledTimes(1);

    await act(async () => {
      mockAppStateHandler('active');
      mockAppStateHandler('active');
    });
    expect(watchPositionAsync).toHaveBeenCalledTimes(2);

    await act(async () => {
      appCamera.unmount();
    });
  });

  it('removes a pending watcher when it resolves after becoming inactive', async () => {
    let resolveWatch;
    const pendingWatch = new Promise((resolve) => {
      resolveWatch = resolve;
    });
    mockWatchPositionAsync.mockImplementationOnce((...args) => {
      mockWatchCallbacks.push(args[1]);
      return pendingWatch;
    });

    let appCamera;
    await act(async () => {
      appCamera = renderer.create(<AppCamera />);
    });

    const staleSubscription = { remove: jest.fn() };
    await act(async () => {
      mockAppStateHandler('inactive');
      resolveWatch(staleSubscription);
    });

    expect(staleSubscription.remove).toHaveBeenCalledTimes(1);

    await act(async () => {
      appCamera.unmount();
    });
  });

  it('handles a current watcher rejection without calling remove on an undefined subscription', async () => {
    const error = new Error('GPS watcher failed');
    mockWatchPositionAsync.mockRejectedValueOnce(error);

    let appCamera;
    await act(async () => {
      appCamera = renderer.create(<AppCamera />);
    });

    expect(captureException).toHaveBeenCalledWith(error, {
      tags: {
        priority: 'GPSFatal',
        screen: 'AppCamera',
        function: 'watchPosition',
      },
    });
    expect(global.toast.show).toHaveBeenCalledWith('GPS Error. Please restart your app', {
      type: 'error',
    });

    await act(async () => {
      appCamera.unmount();
    });
  });

  it('ignores callbacks from a watcher that is no longer current', async () => {
    let appCamera;
    await act(async () => {
      appCamera = renderer.create(<AppCamera />);
    });
    const staleCallback = mockWatchCallbacks[0];

    await act(async () => {
      mockAppStateHandler('inactive');
      mockAppStateHandler('active');
    });
    mockDispatch.mockClear();

    const location = {
      coords: { accuracy: 10, latitude: 41, longitude: 29 },
      mocked: false,
    };
    await act(async () => {
      staleCallback(location);
    });
    expect(mockDispatch).not.toHaveBeenCalled();

    await act(async () => {
      mockWatchCallbacks[1](location);
    });
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'UPDATE_MOCKED_STATUS', payload: false });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_CAMERA_LOCATION',
      payload: location.coords,
    });
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'UPDATE_GPS_ACCURACY', payload: true });
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'UPDATE_ACCURACY_LEVEL', payload: 10 });

    await act(async () => {
      appCamera.unmount();
    });
  });

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
    expect(mockWatchSubscriptions[0].remove).toHaveBeenCalledTimes(1);
    expect(ScreenOrientation.lockAsync).toHaveBeenNthCalledWith(1, 'LANDSCAPE');
    expect(ScreenOrientation.lockAsync).toHaveBeenNthCalledWith(2, 'PORTRAIT_UP');
  });
});
