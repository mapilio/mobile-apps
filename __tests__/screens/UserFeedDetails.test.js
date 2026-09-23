import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { Modal, Platform } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { captureException } from '@sentry/react-native';
import UserFeedDetails from '../../screens/UserFeed/UserFeedDetails';
import { api } from '../../util/helpers/api';
import { setCameraBounds } from '../../util/maplibreCamera';

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

describe('feed detail screen', () => {
  let tree;
  const originalOS = Platform.OS;

  beforeEach(() => {
    jest.clearAllMocks();
    Platform.OS = 'ios';
    ScreenOrientation.lockAsync.mockResolvedValue(undefined);
    api.get.mockReset().mockResolvedValue({ data: [] });
  });

  afterEach(async () => {
    if (tree) await act(async () => tree.unmount());
    tree = null;
    Platform.OS = originalOS;
  });

  const renderScreen = async (params = { id: 'group', user_id: 1 }) => {
    await act(async () => {
      tree = renderer.create(<UserFeedDetails route={{ params }} />, {
        createNodeMock: () => ({ setStop: jest.fn(), snapToIndex: jest.fn() }),
      });
    });
  };

  const renderPhoto = async () => {
    await renderScreen();
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

  it('handles the API empty-result envelope without fitting an empty map', async () => {
    api.get.mockResolvedValue({ data: null });
    await renderScreen();
    const list = tree.root.findByType('BottomSheetFlatList');
    expect(list.props.data).toEqual([]);
    expect(list.props.refreshing).toBe(false);
    expect(list.props.ListEmptyComponent.props.children).toBe('no_feed');
    expect(setCameraBounds).not.toHaveBeenCalled();
    expect(captureException).not.toHaveBeenCalled();
  });

  it.each(['roads', 'photos'])('can refresh after a failed %s request', async (stage) => {
    const error = new Error('feed unavailable');
    if (stage === 'photos') api.get.mockResolvedValueOnce({ data: [] });
    api.get.mockRejectedValueOnce(error);
    await renderScreen();
    let list = tree.root.findByType('BottomSheetFlatList');
    expect(list.props.refreshing).toBe(false);
    expect(list.props.ListEmptyComponent.props.children).toBe('fetch_error');
    expect(captureException).toHaveBeenCalledWith(error);

    api.get.mockClear();
    await act(async () => list.props.onRefresh());
    list = tree.root.findByType('BottomSheetFlatList');
    expect(api.get).toHaveBeenCalledTimes(2);
    expect(list.props.refreshing).toBe(false);
    expect(list.props.ListEmptyComponent.props.children).toBe('no_feed');
  });

  it('does not start another refresh while a request is pending', async () => {
    let resolveRoads;
    api.get.mockReturnValueOnce(
      new Promise((resolve) => {
        resolveRoads = resolve;
      })
    );
    await renderScreen();
    const list = tree.root.findByType('BottomSheetFlatList');
    expect(list.props.refreshing).toBe(true);
    expect(list.props.ListEmptyComponent).toBeNull();
    await act(async () => list.props.onRefresh());
    expect(api.get).toHaveBeenCalledTimes(1);
    await act(async () => resolveRoads({ data: null }));
    expect(tree.root.findByType('BottomSheetFlatList').props.refreshing).toBe(false);
  });

  it.each(['resolve', 'reject'])(
    'ignores an old feed request when it later %ss',
    async (outcome) => {
      let finishOld;
      api.get.mockImplementation((url) => {
        if (url.includes('roads-group')) return Promise.resolve({ data: [] });
        if (url.includes('group_key]=group&')) {
          return new Promise((resolve, reject) => {
            finishOld = outcome === 'resolve' ? resolve : reject;
          });
        }
        return Promise.resolve({ data: [{ id: 2 }] });
      });
      await renderScreen();
      await act(async () =>
        tree.update(<UserFeedDetails route={{ params: { id: 'new-group', user_id: 2 } }} />)
      );
      await act(async () =>
        finishOld(outcome === 'resolve' ? { data: [{ id: 1 }] } : new Error('old failure'))
      );
      const list = tree.root.findByType('BottomSheetFlatList');
      expect(list.props.data).toEqual([{ id: 2 }]);
      expect(list.props.refreshing).toBe(false);
      expect(captureException).not.toHaveBeenCalled();
    }
  );

  it('does not display an error from a request completed after leaving the screen', async () => {
    let rejectRoads;
    api.get.mockReturnValueOnce(
      new Promise((resolve, reject) => {
        rejectRoads = reject;
      })
    );
    await renderScreen();
    await act(async () => tree.unmount());
    tree = null;
    await act(async () => rejectRoads(new Error('late failure')));
    expect(captureException).not.toHaveBeenCalled();
    expect(api.get).toHaveBeenCalledTimes(1);
  });

  it('treats malformed photo data as an error rather than an empty feed', async () => {
    api.get.mockResolvedValueOnce({ data: [] }).mockResolvedValueOnce({ data: {} });
    await renderScreen();
    const list = tree.root.findByType('BottomSheetFlatList');
    expect(list.props.ListEmptyComponent.props.children).toBe('fetch_error');
    expect(list.props.refreshing).toBe(false);
    expect(setCameraBounds).not.toHaveBeenCalled();
  });

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

  it('passes the selected photo ID to both report controls', async () => {
    await renderPhoto();
    await toggle(false);
    expect(tree.root.findAllByType('ActiveImage').map((node) => node.props.pointID)).toEqual([
      1, 1,
    ]);

    const item = { id: 2, img_code: 'next', filename: 'next.jpg', longitude: 1, latitude: 2 };
    const photo = tree.root.findByType('BottomSheetFlatList').props.renderItem({ item });
    await act(async () => photo.props.onPress(item));
    expect(tree.root.findAllByType('ActiveImage').map((node) => node.props.pointID)).toEqual([
      2, 2,
    ]);
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
