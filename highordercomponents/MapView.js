import React, {memo, useEffect, useState} from "react";
import MapLibreGL from "@maplibre/maplibre-react-native";

const MapView = ({children, mapRef, attributionStyle, regionChange, mapStyle, onPress, onDidFinishLoadingMap, ...props}) => {
  const [didFinishLoadingMap, setDidFinishLoadingMap] = useState(false);

  useEffect(() => {
    return () => setDidFinishLoadingMap(false)
  }, []);


  return (
    <MapLibreGL.MapView
      style={mapStyle}
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
       <MapLibreGL.RasterSource
          id="maptiler-source"
          tileSize={512}
          url="https://api.maptiler.com/maps/basic-v2-light/tiles.json?key=***REMOVED***">
          <MapLibreGL.RasterLayer
            id="maptiler-layer"
            sourceID="maptiler-source"
            
          />
        </MapLibreGL.RasterSource>
      {didFinishLoadingMap && children}
    </MapLibreGL.MapView>
  )
};

export default memo(MapView);
