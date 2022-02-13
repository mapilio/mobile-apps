import MapboxGL from "@react-native-mapbox-gl/maps";
import React, { memo } from "react";
import { Platform } from "react-native";

const MapView = ({
  children,
  mapRef,
  attributionStyle,
  regionChange,
  mapStyle,
}) => (
  <MapboxGL.MapView
    styleURL={MapboxGL.StyleURL.Light}
    style={mapStyle}
    ref={mapRef}
    attributionPosition={attributionStyle}
    onRegionDidChange={regionChange}
    logoEnabled={Platform.OS !== "android"}
    attributionEnabled={Platform.OS !== "android"}
  >
    {children}
  </MapboxGL.MapView>
);

export default memo(MapView);
