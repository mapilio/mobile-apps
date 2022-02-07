import MapboxGL from "@react-native-mapbox-gl/maps";
import React, { memo } from "react";

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
  >
    {children}
  </MapboxGL.MapView>
);

export default memo(MapView);
