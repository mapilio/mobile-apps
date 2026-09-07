// Mock heavy dependencies that pull in native modules
jest.mock('axios', () => {
  const axios = jest.fn();
  axios.defaults = { headers: { common: {} } };
  return { __esModule: true, default: axios };
});

jest.mock('react-native-permissions', () => ({
  check: jest.fn(),
  request: jest.fn(),
  requestMultiple: jest.fn(),
  PERMISSIONS: {
    IOS: {
      CAMERA: 'ios.camera',
      LOCATION_WHEN_IN_USE: 'ios.location',
    },
    ANDROID: {
      CAMERA: 'android.camera',
      ACCESS_FINE_LOCATION: 'android.location',
    },
  },
  RESULTS: { GRANTED: 'granted', LIMITED: 'limited', DENIED: 'denied' },
}));

jest.mock('react-native', () => ({
  Alert: { alert: jest.fn() },
  Dimensions: { get: jest.fn(() => ({ height: 800, width: 400 })) },
  Linking: { openSettings: jest.fn(), openURL: jest.fn() },
  NativeModules: {},
  Platform: { OS: 'ios', select: (options) => options.ios ?? options.native ?? options.default },
  TurboModuleRegistry: {
    get: jest.fn(() => null),
    getEnforcing: jest.fn(() => ({})),
  },
}));

jest.mock('../../store/store', () => ({
  store: {
    getState: () => ({
      getTokenReducer: { auth: null },
      generalReducer: { connection: { connectionType: 'wifi' } },
    }),
  },
}));

jest.mock('i18next', () => ({
  resolvedLanguage: 'en',
  t: (key) => key,
}));

import {
  maxCharacterHandler,
  thousandFormatter,
  headingPointGeoJson,
  initialPermissions,
  cameraPermission,
} from '../../helper/helper';
import { Alert, Platform } from 'react-native';
import { check, request, requestMultiple, PERMISSIONS, RESULTS } from 'react-native-permissions';

describe('maxCharacterHandler', () => {
  it('returns text unchanged when within limit', () => {
    expect(maxCharacterHandler('hello', 10)).toBe('hello');
  });

  it('truncates text and appends "..." when over limit', () => {
    expect(maxCharacterHandler('hello world', 5)).toBe('hello...');
  });

  it('returns " " when text is null or non-string', () => {
    expect(maxCharacterHandler(null, 10)).toBe(' ');
    expect(maxCharacterHandler(undefined, 10)).toBe(' ');
  });

  it('handles exact length boundary', () => {
    expect(maxCharacterHandler('abcde', 5)).toBe('abcde');
    expect(maxCharacterHandler('abcdef', 5)).toBe('abcde...');
  });
});

describe('thousandFormatter', () => {
  it('formats numbers below 1000 without shortcode', () => {
    expect(thousandFormatter(500)).toBe('500');
  });

  it('formats numbers over 999 with "k" shortcode', () => {
    const result = thousandFormatter(1500);
    expect(result).toContain('k');
    expect(parseFloat(result)).toBeCloseTo(1.5, 1);
  });

  it('handles negative numbers', () => {
    const result = thousandFormatter(-2000);
    expect(result).toContain('k');
  });

  it('does not show trailing .0 for whole numbers below 1000', () => {
    expect(thousandFormatter(100)).toBe('100');
  });
});

describe('headingPointGeoJson', () => {
  it('returns a valid GeoJSON FeatureCollection', () => {
    const result = headingPointGeoJson(90, [28.97953, 41.015137]);
    expect(result.type).toBe('FeatureCollection');
    expect(Array.isArray(result.features)).toBe(true);
    expect(result.features).toHaveLength(1);
  });

  it('sets heading as rotate property', () => {
    const result = headingPointGeoJson(180, [0, 0]);
    expect(result.features[0].properties.rotate).toBe(180);
  });

  it('sets coordinates correctly', () => {
    const coords = [28.97953, 41.015137];
    const result = headingPointGeoJson(0, coords);
    expect(result.features[0].geometry.coordinates).toEqual(coords);
  });

  it('geometry type is Point', () => {
    const result = headingPointGeoJson(45, [10, 20]);
    expect(result.features[0].geometry.type).toBe('Point');
  });
});

describe('initialPermissions', () => {
  beforeEach(() => {
    check.mockReset();
    request.mockReset();
  });

  it('returns the existing granted status without requesting again', async () => {
    check.mockResolvedValue(RESULTS.GRANTED);

    await expect(initialPermissions()).resolves.toBe(RESULTS.GRANTED);
    expect(request).not.toHaveBeenCalled();
  });

  it('returns the new request result when the initial check is denied', async () => {
    check.mockResolvedValue(RESULTS.DENIED);
    request.mockResolvedValue(RESULTS.GRANTED);

    await expect(initialPermissions()).resolves.toBe(RESULTS.GRANTED);
    expect(request).toHaveBeenCalledTimes(1);
  });

  it('deduplicates concurrent permission requests', async () => {
    check.mockResolvedValue(RESULTS.DENIED);
    request.mockResolvedValue(RESULTS.GRANTED);

    await expect(Promise.all([initialPermissions(), initialPermissions()])).resolves.toEqual([
      RESULTS.GRANTED,
      RESULTS.GRANTED,
    ]);
    expect(check).toHaveBeenCalledTimes(1);
    expect(request).toHaveBeenCalledTimes(1);
  });
});

describe('cameraPermission', () => {
  beforeEach(() => {
    requestMultiple.mockReset();
    Alert.alert.mockReset();
    Alert.alert.mockImplementation((title, message, buttons) => {
      buttons[1].onPress();
    });
    Platform.OS = 'ios';
  });

  it('requests camera and location on iOS', async () => {
    requestMultiple.mockResolvedValue({
      [PERMISSIONS.IOS.CAMERA]: RESULTS.GRANTED,
      [PERMISSIONS.IOS.LOCATION_WHEN_IN_USE]: RESULTS.GRANTED,
    });

    await cameraPermission(jest.fn());

    expect(requestMultiple).toHaveBeenCalledWith([
      PERMISSIONS.IOS.CAMERA,
      PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    ]);
  });

  it('requests camera and location on Android', async () => {
    Platform.OS = 'android';
    requestMultiple.mockResolvedValue({
      [PERMISSIONS.ANDROID.CAMERA]: RESULTS.GRANTED,
      [PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION]: RESULTS.GRANTED,
    });

    await cameraPermission(jest.fn());

    expect(requestMultiple).toHaveBeenCalledWith([
      PERMISSIONS.ANDROID.CAMERA,
      PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    ]);
  });

  it('shows the camera denial message without proceeding', async () => {
    const onPress = jest.fn();
    requestMultiple.mockResolvedValue({
      [PERMISSIONS.IOS.CAMERA]: RESULTS.DENIED,
      [PERMISSIONS.IOS.LOCATION_WHEN_IN_USE]: RESULTS.GRANTED,
    });

    await cameraPermission(onPress);

    expect(Alert.alert).toHaveBeenCalledWith(
      'No access to camera',
      'Mapilio needs access to the camera before you can capture photos. Go to your settings to enable.',
      expect.any(Array)
    );
    expect(onPress).not.toHaveBeenCalled();
  });

  it('shows the location denial message without proceeding', async () => {
    const onPress = jest.fn();
    Platform.OS = 'android';
    requestMultiple.mockResolvedValue({
      [PERMISSIONS.ANDROID.CAMERA]: RESULTS.GRANTED,
      [PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION]: RESULTS.DENIED,
    });

    await cameraPermission(onPress);

    expect(Alert.alert).toHaveBeenCalledWith(
      'No access to camera',
      'Mapilio needs access to the location before you can capture photos. Go to your settings to enable.',
      expect.any(Array)
    );
    expect(onPress).not.toHaveBeenCalled();
  });

  it('proceeds only when camera and location are granted', async () => {
    const onPress = jest.fn();
    requestMultiple.mockResolvedValue({
      [PERMISSIONS.IOS.CAMERA]: RESULTS.GRANTED,
      [PERMISSIONS.IOS.LOCATION_WHEN_IN_USE]: RESULTS.GRANTED,
    });

    await cameraPermission(onPress);

    expect(onPress).toHaveBeenCalledTimes(1);
    expect(Alert.alert).not.toHaveBeenCalled();
  });

  it('handles a rejected permission request without proceeding', async () => {
    const onPress = jest.fn();
    requestMultiple.mockRejectedValue(new Error('permission request failed'));

    await expect(cameraPermission(onPress)).resolves.toBeUndefined();

    expect(Alert.alert).toHaveBeenCalledWith(
      'No access to camera',
      'Mapilio could not verify camera and location access. Go to your settings to enable.',
      expect.any(Array)
    );
    expect(onPress).not.toHaveBeenCalled();
  });
});
