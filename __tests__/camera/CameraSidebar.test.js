import React from 'react';
import renderer, { act } from 'react-test-renderer';

const mockNavigation = {
  navigate: jest.fn(),
  reset: jest.fn(),
};
const mockGetCapturesByGroupID = jest.fn();
const mockExitCapture = jest.fn();

jest.mock('react-native', () => {
  const ReactNative = require('react');

  return {
    Platform: { OS: 'ios', select: (options) => options.ios || options.default },
    StyleSheet: { create: (styles) => styles },
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
jest.mock('../../highordercomponents', () => ({
  CustomText: ({ children }) => children,
  CustomTextBold: ({ children }) => children,
}));
jest.mock('../../assets/svg/illustrations', () => ({
  GoBackIcon: () => require('react').createElement('GoBackIcon'),
  InformationIcon: () => require('react').createElement('InformationIcon'),
  SettingsIcon: () => require('react').createElement('SettingsIcon'),
}));
jest.mock('../../components/CameraActionsButtons', () => () => null);
jest.mock('../../components/Tooltip', () => ({ TooltipWrapper: ({ children }) => children }));
jest.mock('../../db', () => ({
  __esModule: true,
  default: { getCapturesByGroupID: (...args) => mockGetCapturesByGroupID(...args) },
}));
jest.mock('../../helper/camera', () => ({ exitCapture: mockExitCapture }));
jest.mock('@react-navigation/native', () => ({ useNavigation: () => mockNavigation }));
jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn(),
  useSelector: (selector) =>
    selector({
      settingsReducer: { autoCaptureStart: false },
      cameraReducer: { groupId: 'group-1' },
    }),
}));
jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key) => key }) }));
jest.mock('expo-brightness', () => ({
  PermissionStatus: { GRANTED: 'granted' },
  getPermissionsAsync: jest.fn(),
  requestPermissionsAsync: jest.fn(),
  getBrightnessAsync: jest.fn(),
  setSystemBrightnessAsync: jest.fn(),
}));
jest.mock('react-native-responsive-fontsize', () => ({ RFValue: (value) => value }));

const CameraSidebar = require('../../components/CameraSidebar').default;

const pressExit = async (capturedRows) => {
  mockGetCapturesByGroupID.mockResolvedValueOnce(
    Array.from({ length: capturedRows }, (_, index) => ({ id: index }))
  );

  let sidebar;
  await act(async () => {
    sidebar = renderer.create(<CameraSidebar setLowBrightness={jest.fn()} />);
  });

  const exitButton = sidebar.root.findByProps({ accessibilityLabel: 'Exit camera' });
  await act(async () => {
    await exitButton.props.onPress();
  });
  sidebar.unmount();
};

describe('CameraSidebar exit navigation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('resets to the capture walkthrough for five or fewer captures', async () => {
    await pressExit(5);

    expect(mockNavigation.reset).toHaveBeenCalledWith({
      index: 0,
      routes: [{ name: 'UploadTab', params: { screen: 'CaptureWalkthrough' } }],
    });
    expect(mockNavigation.navigate).not.toHaveBeenCalled();
    expect(mockExitCapture).toHaveBeenCalledTimes(1);
  });

  it('keeps the completed reset for more than five captures', async () => {
    await pressExit(6);

    expect(mockNavigation.reset).toHaveBeenCalledWith({
      index: 0,
      routes: [{ name: 'UploadTab', params: { screen: 'CaptureCompleted' } }],
    });
    expect(mockNavigation.navigate).not.toHaveBeenCalled();
    expect(mockExitCapture).toHaveBeenCalledTimes(1);
  });
});
