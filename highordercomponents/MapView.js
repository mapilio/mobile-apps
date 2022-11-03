import MapboxGL from "@rnmapbox/maps";
import React, { memo } from "react";
import { Platform } from "react-native";

const MapView = ({
  children,
  mapRef,
  attributionStyle,
  regionChange,
  mapStyle,
  onPress
}) => (
  <MapboxGL.MapView
    styleURL={MapboxGL.StyleURL.Light}
    style={mapStyle}
    ref={mapRef}
    attributionPosition={attributionStyle}
    onRegionDidChange={regionChange}
    logoEnabled={Platform.OS !== "android"}
    attributionEnabled={Platform.OS !== "android"}
    scaleBarEnabled={false}
    logoPosition={{ bottom: 20, left: 25 }}
    rotateEnabled={false}
    onPress={onPress}
  >
    {children}
  </MapboxGL.MapView>
);

export default memo(MapView);
