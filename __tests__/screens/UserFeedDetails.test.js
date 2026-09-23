import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { Modal, Platform } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { captureException } from '@sentry/react-native';
import UserFeedDetails from '../../screens/UserFeed/UserFeedDetails';

jest.mock('react-native', () => ({
  View: 'View',
  TouchableOpacity: 'TouchableOpacity',
  Modal: 'Modal',
  StyleSheet: { create: (styles) => styles },
  Platform: { OS: 'ios', select: (options) => options.ios ?? options.default },
  NativeModules: {},
  TurboModuleRegistry: { get: jest.fn(() => null), getEnforcing: jest.fn(() => ({})) },
}));
jest.mock('react-native-responsive-fontsize', () => ({ RFValue: (value) => value }));
jest.mock('expo-screen-orientation', () => ({
  OrientationLock: { LANDSCAPE_RIGHT: 4, PORTRAIT_UP: 1 },
  lockAsync: jest.fn(),
}));
jest.mock('@sentry/react-native', () => ({ captureException: jest.fn() }));
jest.mock('../../util/helpers/api', () => ({
  api: {
    get: jest.fn(async () => ({ data: [] })),
  },
}));
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ goBack: jest.fn() }),
}));
jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key) => key }) }));
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: 'SafeAreaProvider',
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));
jest.mock('../../highordercomponents', () => ({
  CustomText: 'CustomText',
  CustomTextBold: 'CustomTextBold',
  MapView: 'MapView',
}));
jest.mock('../../assets/svg/illustrations', () => ({ ArrowLeft: 'ArrowLeft' }));
jest.mock('../../components', () => ({ FocusAwareStatusBar: 'StatusBar' }));
jest.mock('../../components/Map', () => ({ Heading: 'Heading' }));
jest.mock('../../components/UserFeed/ActiveImage', () => 'ActiveImage');
jest.mock('../../components/UserFeed/ListImage', () => 'ListImage');
jest.mock('@maplibre/maplibre-react-native', () => ({
  Camera: 'Camera',
  GeoJSONSource: 'GeoJSONSource',
  Layer: 'Layer',
}));
jest.mock('@gorhom/bottom-sheet', () => ({
  __esModule: true,
  default: 'BottomSheet',
  BottomSheetFlatList: 'BottomSheetFlatList',
}));
jest.mock('../../helper/geojson', () => ({ setGeoJson: () => ({}) }));
jest.mock('../../helper/helper', () => ({
  dateConvert: () => '',
  maxCharacterHandler: (value) => value,
}));
jest.mock('../../util/maplibreCamera', () => ({
  getGeoJsonBounds: () => [],
  setCameraBounds: jest.fn(),
}));

describe('feed photo fullscreen orientation', () => {
  let tree;
  const originalOS = Platform.OS;

  beforeEach(() => {
    jest.clearAllMocks();
    Platform.OS = 'ios';
    ScreenOrientation.lockAsync.mockResolvedValue(undefined);
  });

  afterEach(async () => {
    if (tree) await act(async () => tree.unmount());
    tree = null;
    Platform.OS = originalOS;
  });

  const renderPhoto = async () => {
    await act(async () => {
      tree = renderer.create(<UserFeedDetails route={{ params: { id: 'group', user_id: 1 } }} />, {
        createNodeMock: () => ({ setStop: jest.fn(), snapToIndex: jest.fn() }),
      });
    });
    const item = { id: 1, img_code: 'image', filename: 'photo.jpg', longitude: 1, latitude: 2 };
    const photo = tree.root.findByType('BottomSheetFlatList').props.renderItem({ item });
    await act(async () => photo.props.onPress(item));
  };

  const toggle = async (fullScreen) => {
    const photo = tree.root
      .findAllByType('ActiveImage')
      .find((node) => Boolean(node.props.isFullScreen) === fullScreen);
    await act(async () => photo.props.onToggleFullScreen());
  };

  it('keeps the modal compatible with portrait and landscape during native transitions', async () => {
    await renderPhoto();
    expect(tree.root.findByType(Modal).props.supportedOrientations).toEqual([
      'portrait',
      'portrait-upside-down',
      'landscape',
    ]);
    expect(ScreenOrientation.lockAsync).not.toHaveBeenCalled();
    await toggle(false);
    expect(tree.root.findByType(Modal).props.visible).toBe(true);
    expect(
      tree.root.findByType(Modal).findByType('SafeAreaProvider').findByType('ActiveImage').props
        .isFullScreen
    ).toBe(true);
    expect(ScreenOrientation.lockAsync.mock.calls).toEqual([[4]]);
    await toggle(true);
    expect(tree.root.findByType(Modal).props.visible).toBe(false);
    expect(ScreenOrientation.lockAsync.mock.calls).toEqual([[4], [1]]);
    await toggle(false);
    await toggle(true);
    expect(ScreenOrientation.lockAsync.mock.calls).toEqual([[4], [1], [4], [1]]);
  });

  it('closes the viewer and restores portrait on Android back', async () => {
    Platform.OS = 'android';
    await renderPhoto();
    await toggle(false);
    await act(async () => tree.root.findByType(Modal).props.onRequestClose());
    expect(tree.root.findByType(Modal).props.visible).toBe(false);
    expect(ScreenOrientation.lockAsync.mock.calls).toEqual([[4], [1]]);
  });

  it('restores portrait if navigation unmounts the open viewer', async () => {
    await renderPhoto();
    await toggle(false);
    await act(async () => tree.unmount());
    tree = null;
    expect(ScreenOrientation.lockAsync.mock.calls).toEqual([[4], [1]]);
  });

  it('keeps the photo closable when native orientation locking fails', async () => {
    const error = new Error('orientation unavailable');
    await renderPhoto();
    ScreenOrientation.lockAsync.mockRejectedValue(error);
    await toggle(false);
    expect(tree.root.findByType(Modal).props.visible).toBe(true);
    expect(captureException).toHaveBeenCalledWith(error);
    await toggle(true);
    expect(tree.root.findByType(Modal).props.visible).toBe(false);
    expect(captureException).toHaveBeenCalledTimes(2);
  });
});
