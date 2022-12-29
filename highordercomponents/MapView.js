import MapboxGL from "@rnmapbox/maps";
import React, {memo, useEffect, useState} from "react";

const MapView = ({children, mapRef, attributionStyle, regionChange, mapStyle, onPress, ...props}) => {
  const [didFinishLoadingMap, setDidFinishLoadingMap] = useState(false);

  useEffect(() => {
    return () => setDidFinishLoadingMap(false)
  }, []);


  return (
    <MapboxGL.MapView
      styleURL={MapboxGL.StyleURL.Light}
      style={mapStyle}
      ref={mapRef}
      attributionPosition={attributionStyle}
      onRegionDidChange={regionChange}
      logoEnabled={false}
      attributionEnabled={false}
      scaleBarEnabled={false}
      logoPosition={{bottom: 20, left: 25}}
      rotateEnabled={false}
      onPress={onPress}
      onDidFinishLoadingMap={() => setDidFinishLoadingMap(true)}
      {...props}
    >
      {didFinishLoadingMap && children}
    </MapboxGL.MapView>
  )
};

export default memo(MapView);
