import { getTileConfig } from "../../config/tileConfig";

describe("getTileConfig", () => {
  it("prefers neutral self-hosted tile variables", () => {
    expect(
      getTileConfig({
        EXPO_PUBLIC_ROAD_TILE_URL: "https://geo.mapilio.com/road/{z}/{x}/{y}.pbf",
        EXPO_PUBLIC_ROAD_TILE_ID: "road",
        EXPO_PUBLIC_POINT_TILE_URL: "https://geo.mapilio.com/point/{z}/{x}/{y}.pbf",
        EXPO_PUBLIC_POINT_TILE_ID: "point",
        EXPO_PUBLIC_MAPBOX_ROAD_URL: "legacy-road",
        EXPO_PUBLIC_MAPBOX_ROAD_ID: "legacy-road-id",
        EXPO_PUBLIC_MAPBOX_POINT_URL: "legacy-point",
        EXPO_PUBLIC_MAPBOX_POINT_ID: "legacy-point-id",
      })
    ).toEqual({
      roadUrl: "https://geo.mapilio.com/road/{z}/{x}/{y}.pbf",
      roadId: "road",
      pointUrl: "https://geo.mapilio.com/point/{z}/{x}/{y}.pbf",
      pointId: "point",
    });
  });

  it("falls back to legacy Mapbox variable names", () => {
    expect(
      getTileConfig({
        EXPO_PUBLIC_MAPBOX_ROAD_URL: "legacy-road",
        EXPO_PUBLIC_MAPBOX_ROAD_ID: "legacy-road-id",
        EXPO_PUBLIC_MAPBOX_POINT_URL: "legacy-point",
        EXPO_PUBLIC_MAPBOX_POINT_ID: "legacy-point-id",
      })
    ).toEqual({
      roadUrl: "legacy-road",
      roadId: "legacy-road-id",
      pointUrl: "legacy-point",
      pointId: "legacy-point-id",
    });
  });

  it("does not mix a partial neutral source with a legacy source", () => {
    expect(
      getTileConfig({
        EXPO_PUBLIC_ROAD_TILE_URL: "neutral-road-without-id",
        EXPO_PUBLIC_MAPBOX_ROAD_URL: "legacy-road",
        EXPO_PUBLIC_MAPBOX_ROAD_ID: "legacy-road-id",
        EXPO_PUBLIC_POINT_TILE_ID: "neutral-point-id-without-url",
        EXPO_PUBLIC_MAPBOX_POINT_URL: "legacy-point",
        EXPO_PUBLIC_MAPBOX_POINT_ID: "legacy-point-id",
      })
    ).toEqual({
      roadUrl: "legacy-road",
      roadId: "legacy-road-id",
      pointUrl: "legacy-point",
      pointId: "legacy-point-id",
    });
  });
});
