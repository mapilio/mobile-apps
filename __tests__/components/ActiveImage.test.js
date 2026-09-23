import React from 'react';
import renderer, { act } from 'react-test-renderer';
import ActiveImage from '../../components/UserFeed/ActiveImage';

const mockPost = jest.fn();
const mockActionSheet = jest.fn();

jest.mock('react-native', () => ({
  View: 'View',
  ImageBackground: 'ImageBackground',
  TouchableOpacity: 'TouchableOpacity',
  StyleSheet: { create: (styles) => styles },
  Platform: { OS: 'ios' },
  NativeModules: {},
  TurboModuleRegistry: { get: jest.fn(() => null), getEnforcing: jest.fn(() => ({})) },
}));
jest.mock('react-native-responsive-fontsize', () => ({ RFValue: (value) => value }));
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, left: 0 }),
}));
jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key) => key }) }));
jest.mock('@expo/react-native-action-sheet', () => ({
  useActionSheet: () => ({ showActionSheetWithOptions: mockActionSheet }),
}));
jest.mock('expo-linear-gradient', () => ({ LinearGradient: 'LinearGradient' }));
jest.mock('../../assets/svg/illustrations', () => ({
  ArrowLeft: 'ArrowLeft',
  ToggleOrientation: 'ToggleOrientation',
}));
jest.mock('../../assets/svg/illustrations/ReportIcon', () => 'ReportIcon');
jest.mock('../../assets/svg/illustrations/LogoWatermark', () => 'LogoWatermark');
jest.mock('../../highordercomponents', () => ({
  CustomText: 'CustomText',
  CustomTextBold: 'CustomTextBold',
}));
jest.mock('../../components/Loading', () => 'Loading');
jest.mock('../../helper/helper', () => ({
  dateConvert: () => '',
  maxCharacterHandler: (value) => value,
}));
jest.mock('../../util/helpers/api', () => ({ api: { post: (...args) => mockPost(...args) } }));

describe('feed photo reports', () => {
  let tree;
  beforeEach(() => {
    jest.clearAllMocks();
    mockPost.mockResolvedValue({ data: {} });
  });
  afterEach(() => {
    if (tree) act(() => tree.unmount());
    tree = null;
  });

  const chooseReason = () => {
    act(() => tree.root.findByType('ReportIcon').parent.props.onPress());
    return mockActionSheet.mock.calls[0][1];
  };

  it.each([false, true])(
    'reports the current photo after changing images (fullscreen: %s)',
    async (isFullScreen) => {
      const props = { isFullScreen, showToast: jest.fn(), hideToast: jest.fn() };
      act(() => {
        tree = renderer.create(<ActiveImage {...props} pointID={123} />);
      });
      act(() => tree.update(<ActiveImage {...props} pointID={456} />));
      const select = chooseReason();
      expect(mockPost).not.toHaveBeenCalled();
      await act(async () => select(1));
      expect(mockPost).toHaveBeenCalledWith('/api/image-report', {
        options: { parameters: { imagery_id: 456, message: 'Privacy Violation' } },
      });
      const notification = isFullScreen ? props.showToast : toast.show;
      expect(notification).toHaveBeenCalledWith(
        'report_success',
        expect.objectContaining({ type: 'success' })
      );
    }
  );

  it.each([0, undefined])(
    'does not send a report when the sheet is cancelled (%s)',
    async (choice) => {
      act(() => {
        tree = renderer.create(<ActiveImage pointID={123} />);
      });
      const select = chooseReason();
      await act(async () => select(choice));
      expect(mockPost).not.toHaveBeenCalled();
    }
  );

  it.each([false, true])(
    'shows a report failure without claiming success (fullscreen: %s)',
    async (isFullScreen) => {
      mockPost.mockRejectedValue(new Error('report unavailable'));
      const showToast = jest.fn();
      act(() => {
        tree = renderer.create(
          <ActiveImage pointID={123} isFullScreen={isFullScreen} showToast={showToast} />
        );
      });
      const select = chooseReason();
      await act(async () => select(1));
      const notification = isFullScreen ? showToast : toast.show;
      expect(notification).toHaveBeenCalledTimes(1);
      expect(notification).toHaveBeenCalledWith(
        'report_error',
        expect.objectContaining({ type: 'error' })
      );
    }
  );
});
