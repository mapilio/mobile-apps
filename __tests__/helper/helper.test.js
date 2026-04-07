// Mock heavy dependencies that pull in native modules
jest.mock('react-native-permissions', () => ({
  check: jest.fn(),
  request: jest.fn(),
  requestMultiple: jest.fn(),
  PERMISSIONS: { IOS: {}, ANDROID: {} },
  RESULTS: { GRANTED: 'granted', LIMITED: 'limited', DENIED: 'denied' },
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
} from '../../helper/helper';

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
    const result = headingPointGeoJson(90, [28.979530, 41.015137]);
    expect(result.type).toBe('FeatureCollection');
    expect(Array.isArray(result.features)).toBe(true);
    expect(result.features).toHaveLength(1);
  });

  it('sets heading as rotate property', () => {
    const result = headingPointGeoJson(180, [0, 0]);
    expect(result.features[0].properties.rotate).toBe(180);
  });

  it('sets coordinates correctly', () => {
    const coords = [28.979530, 41.015137];
    const result = headingPointGeoJson(0, coords);
    expect(result.features[0].geometry.coordinates).toEqual(coords);
  });

  it('geometry type is Point', () => {
    const result = headingPointGeoJson(45, [10, 20]);
    expect(result.features[0].geometry.type).toBe('Point');
  });
});
