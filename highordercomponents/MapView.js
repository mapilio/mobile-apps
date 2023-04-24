import MapboxGL from "@rnmapbox/maps";
import React, {memo, useEffect, useState} from "react";

const MapView = ({children, mapRef, attributionStyle, regionChange, mapStyle, onPress, onDidFinishLoadingMap, ...props}) => {
  const [didFinishLoadingMap, setDidFinishLoadingMap] = useState(false);

  useEffect(() => {
    return () => setDidFinishLoadingMap(false)
  }, []);


  return (
    <MapboxGL.MapView
      styleURL={MapboxGL.StyleURL.Light}
      style={mapStyle}
      ref={mapRef}
      attributionPosition={attributionStyle || {left: 5, bottom: 5}}
      onRegionDidChange={regionChange}
      logoEnabled={false}
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
    </MapboxGL.MapView>
  )
};

export default memo(MapView);
