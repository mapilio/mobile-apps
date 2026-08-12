const resolveTileSource = (neutralUrl, neutralId, legacyUrl, legacyId) => {
  if (neutralUrl && neutralId) {
    return { url: neutralUrl, id: neutralId };
  }

  return { url: legacyUrl, id: legacyId };
};

export const getTileConfig = (env) => {
  const road = resolveTileSource(
    env.EXPO_PUBLIC_ROAD_TILE_URL,
    env.EXPO_PUBLIC_ROAD_TILE_ID,
    env.EXPO_PUBLIC_MAPBOX_ROAD_URL,
    env.EXPO_PUBLIC_MAPBOX_ROAD_ID,
  );
  const point = resolveTileSource(
    env.EXPO_PUBLIC_POINT_TILE_URL,
    env.EXPO_PUBLIC_POINT_TILE_ID,
    env.EXPO_PUBLIC_MAPBOX_POINT_URL,
    env.EXPO_PUBLIC_MAPBOX_POINT_ID,
  );

  return {
    roadUrl: road.url,
    roadId: road.id,
    pointUrl: point.url,
    pointId: point.id,
  };
};

export const tileConfig = getTileConfig({
  EXPO_PUBLIC_ROAD_TILE_URL: process.env.EXPO_PUBLIC_ROAD_TILE_URL,
  EXPO_PUBLIC_ROAD_TILE_ID: process.env.EXPO_PUBLIC_ROAD_TILE_ID,
  EXPO_PUBLIC_POINT_TILE_URL: process.env.EXPO_PUBLIC_POINT_TILE_URL,
  EXPO_PUBLIC_POINT_TILE_ID: process.env.EXPO_PUBLIC_POINT_TILE_ID,
  EXPO_PUBLIC_MAPBOX_ROAD_URL: process.env.EXPO_PUBLIC_MAPBOX_ROAD_URL,
  EXPO_PUBLIC_MAPBOX_ROAD_ID: process.env.EXPO_PUBLIC_MAPBOX_ROAD_ID,
  EXPO_PUBLIC_MAPBOX_POINT_URL: process.env.EXPO_PUBLIC_MAPBOX_POINT_URL,
  EXPO_PUBLIC_MAPBOX_POINT_ID: process.env.EXPO_PUBLIC_MAPBOX_POINT_ID,
});
