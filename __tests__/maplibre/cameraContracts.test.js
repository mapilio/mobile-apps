import { fitCameraBounds, getGeoJsonBounds, setCameraBounds } from '../../util/maplibreCamera';

describe('MapLibre v11 camera contracts', () => {
  it('uses the v11 fitBounds argument shape', () => {
    const cameraRef = { current: { fitBounds: jest.fn() } };
    const bounds = [0, 1, 2, 3];
    const padding = { top: 20, right: 20, bottom: 20, left: 20 };

    fitCameraBounds(cameraRef, bounds, padding, 500);

    expect(cameraRef.current.fitBounds).toHaveBeenCalledWith(bounds, {
      padding,
      duration: 500,
    });
  });

  it('uses the v11 setStop bounds shape', () => {
    const cameraRef = { current: { setStop: jest.fn() } };
    const bounds = [-1, -2, 3, 4];
    const padding = { top: 100, right: 100, bottom: 400, left: 100 };

    setCameraBounds(cameraRef, bounds, padding, 300);

    expect(cameraRef.current.setStop).toHaveBeenCalledWith({
      bounds,
      padding,
      duration: 300,
    });
  });

  it('uses Turf bbox extrema instead of first and last records', () => {
    const geoJson = {
      type: 'FeatureCollection',
      features: [
        { type: 'Feature', geometry: { type: 'Point', coordinates: [10, 10] }, properties: {} },
        { type: 'Feature', geometry: { type: 'Point', coordinates: [0, 0] }, properties: {} },
        { type: 'Feature', geometry: { type: 'Point', coordinates: [5, 20] }, properties: {} },
      ],
    };

    expect(getGeoJsonBounds(geoJson)).toEqual([0, 0, 10, 20]);
  });
});
