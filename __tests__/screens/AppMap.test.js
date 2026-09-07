import React from 'react';
import renderer, { act } from 'react-test-renderer';

const mockSetStop = jest.fn();
const mockInitialPermissions = jest.fn();
const mockProbeVectorTile = jest.fn();
const mockNavigate = jest.fn();
const mockDispatch = jest.fn();
const mockCenterToUserButton = ({ handleSetCenter }) =>
  React.createElement('CenterToUserButton', { onPress: handleSetCenter });
const mockMapView = ({ children }) => React.createElement(React.Fragment, null, children);
let mockCurrentPosition;

jest.mock('react-native', () => {
  const React = require('react');

  return {
    ActivityIndicator: () => null,
    AppState: {
      currentState: 'active',
      addEventListener: jest.fn(() => ({ remove: jest.fn() })),
    },
    NativeModules: {},
    Platform: {
      OS: 'ios',
      select: (options) => options.ios ?? options.native ?? options.default,
    },
    StyleSheet: { absoluteFillObject: {} },
    TurboModuleRegistry: {
      get: jest.fn(() => null),
      getEnforcing: jest.fn(() => ({})),
    },
    View: ({ children }) => React.createElement('View', null, children),
  };
});

jest.mock('react-native-responsive-fontsize', () => ({ RFValue: (value) => value }));
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0 }),
}));
jest.mock('../../styles/appMapStyle', () => ({
  appMapStyle: {
    map: {},
    mapButtons: {},
    topWrapper: {},
    watermark: {},
  },
}));
jest.mock('../../highordercomponents', () => ({ MapView: mockMapView }));
jest.mock('../../components/Search', () => ({ Search: () => null }));
jest.mock('../../components/FocusAwareStatusBar', () => () => null);
jest.mock('../../components/Map', () => ({
  AttributionButton: () => null,
  CenterToUserButton: mockCenterToUserButton,
  Pano: () => null,
  ProfileButton: () => null,
}));
jest.mock('../../components/Map/MapLoading', () => () => null);
jest.mock('../../components/Map/layers', () => ({
  ActiveSources: () => null,
  Lines: () => null,
  Points: () => null,
}));
jest.mock('../../components/SocialLogin', () => ({ NewsletterModal: () => null }));
jest.mock('../../assets/svg/illustrations', () => ({ MapilioBetaWatermark: () => null }));
jest.mock('../../helper/helper', () => ({ initialPermissions: mockInitialPermissions }));
jest.mock('react-native-permissions', () => ({
  RESULTS: { DENIED: 'denied', GRANTED: 'granted' },
}));
jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: (selector) =>
    selector({
      generalReducer: {
        connection: { connectionStatus: true },
        welcomeWalkthroughStatus: false,
      },
      getTokenReducer: { auth: null },
    }),
}));
jest.mock('@maplibre/maplibre-react-native', () => {
  const React = require('react');

  return {
    Camera: React.forwardRef((props, ref) => {
      React.useImperativeHandle(ref, () => ({ setStop: mockSetStop }));
      return null;
    }),
    UserLocation: () => null,
    useCurrentPosition: jest.fn(() => mockCurrentPosition),
  };
});
jest.mock('@turf/turf', () => ({ point: jest.fn() }));
jest.mock('../../navigator/Routes', () => ({ Routes: { noInternetAccess: 'NoInternetAccess' } }));
jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key) => key }) }));
jest.mock('../../util/helpers/api', () => ({ api: { get: jest.fn() } }));
jest.mock('../../store/actions/generalReducer', () => ({
  checkMaintenance: jest.fn(),
  getConfig: jest.fn(),
}));
jest.mock('@sentry/react-native', () => ({ captureMessage: jest.fn() }));
jest.mock('../../util/mapOverlayHealth', () => ({
  probeVectorTile: (...args) => mockProbeVectorTile(...args),
}));
jest.mock('../../util/mapInteraction', () => ({
  isUserInitiatedRegionMovement: jest.fn(() => true),
}));
jest.mock('../../config/tileConfig', () => ({
  tileConfig: { pointUrl: 'points', roadUrl: 'roads' },
}));

const AppMap = require('../../screens/AppMap').default;
const { RESULTS } = require('react-native-permissions');

const position = (longitude, latitude) => ({ coords: { longitude, latitude } });

describe('AppMap center control', () => {
  let map;

  beforeEach(() => {
    jest.clearAllMocks();
    mockCurrentPosition = null;
    mockInitialPermissions.mockResolvedValue(RESULTS.GRANTED);
    mockProbeVectorTile.mockResolvedValue({ available: true });
  });

  afterEach(async () => {
    if (map) {
      await act(async () => map.unmount());
      map = null;
    }
  });

  const renderMap = async () => {
    await act(async () => {
      map = renderer.create(<AppMap navigation={{ navigate: mockNavigate }} />);
      await Promise.resolve();
      await Promise.resolve();
    });
  };

  const pressCenter = async () => {
    const button = map.root.findByType(mockCenterToUserButton);
    await act(async () => button.props.handleSetCenter());
  };

  it('centers immediately on the cached position', async () => {
    mockCurrentPosition = position(28.98, 41.01);
    await renderMap();

    await pressCenter();

    expect(mockSetStop).toHaveBeenCalledWith({
      center: [28.98, 41.01],
      zoom: 15,
      bearing: 0,
      pitch: 0,
      duration: 1000,
    });
  });

  it('centers again when the button is tapped repeatedly', async () => {
    mockCurrentPosition = position(28.98, 41.01);
    await renderMap();

    await pressCenter();
    await pressCenter();

    expect(mockSetStop).toHaveBeenCalledTimes(2);
  });

  it('follows a position that arrives after the button press', async () => {
    await renderMap();

    await pressCenter();
    expect(mockSetStop).not.toHaveBeenCalled();

    mockCurrentPosition = position(29.0, 41.02);
    await act(async () => {
      map.update(<AppMap navigation={{ navigate: mockNavigate }} />);
    });

    expect(mockSetStop).toHaveBeenCalledWith({
      center: [29.0, 41.02],
      zoom: 15,
      bearing: 0,
      pitch: 0,
      duration: 1000,
    });
  });

  it('does not center when permission is denied', async () => {
    mockInitialPermissions.mockResolvedValue(RESULTS.DENIED);
    await renderMap();

    await pressCenter();

    expect(mockSetStop).not.toHaveBeenCalled();
    expect(global.toast.show).toHaveBeenCalledWith('gps_disabled', { type: 'error' });
  });

  it('stops following after a user gesture', async () => {
    mockCurrentPosition = position(28.98, 41.01);
    await renderMap();
    await pressCenter();

    const mapView = map.root.findByType(mockMapView);
    mapView.props.onRegionDidChange({});
    mockCurrentPosition = position(29.0, 41.02);
    await act(async () => {
      map.update(<AppMap navigation={{ navigate: mockNavigate }} />);
    });

    expect(mockSetStop).toHaveBeenCalledTimes(1);
  });
});
