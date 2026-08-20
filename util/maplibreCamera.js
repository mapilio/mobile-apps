import { bbox } from '@turf/turf';

export const fitCameraBounds = (cameraRef, bounds, padding, duration) =>
  cameraRef.current?.fitBounds(bounds, { padding, duration });

export const setCameraBounds = (cameraRef, bounds, padding, duration) =>
  cameraRef.current?.setStop({ bounds, padding, duration });

export const getGeoJsonBounds = (geoJson) => bbox(geoJson);
