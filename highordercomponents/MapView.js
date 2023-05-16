import React, {memo, useEffect, useState} from "react";
import MapLibreGL, {Logger} from "@maplibre/maplibre-react-native";

MapLibreGL.setAccessToken(null);
Logger.setLogLevel("error");

const MapView = ({children, mapRef, attributionStyle, regionChange, mapStyle, onPress, onDidFinishLoadingMap, ...props}) => {
  const [didFinishLoadingMap, setDidFinishLoadingMap] = useState(false);

  useEffect(() => {
    return () => setDidFinishLoadingMap(false)
  }, []);

  return (
    <MapLibreGL.MapView
      style={mapStyle}
      styleURL="https://api.maptiler.com/maps/streets-v2/style.json?key=***REMOVED***"
      ref={mapRef}
      attributionPosition={attributionStyle || {left: 5, bottom: 5}}
      onRegionDidChange={regionChange}
      logoEnabled={false}
      compassEnabled={false}
      attributionEnabled={true}
      scaleBarEnabled={false}
      logoPosition={{bottom: 20, left: 25}}
      rotateEnabled={false}
      onPress={onPress}
      onDidFinishLoadingMap={() => {
        setDidFinishLoadingMap(true)
        onDidFinishLoadingMap && onDidFinishLoadingMap()
      }}
      {...props}
    >
      {didFinishLoadingMap && children}
    </MapLibreGL.MapView>
  )
};

export default memo(MapView);
