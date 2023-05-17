import React, { Fragment, memo, useRef } from "react";
import MapLibreGL, { Logger } from "@maplibre/maplibre-react-native";
import { AttributionButton } from "../components/Map";
import { appMapStyle } from "../styles/appMapStyle";
import { View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

MapLibreGL.setAccessToken(null);
Logger.setLogLevel("error");

const MapView = ({
  children,
  mapRef,
  regionChange,
  mapStyle,
  onPress,
  isBaseMap,
  onDidFinishLoadingMap,
  ...props
}) => {
  const localMapRef = useRef(null);

  return (
    <Fragment>
      <MapLibreGL.MapView
        style={mapStyle}
        styleJSON="https://api.maptiler.com/maps/e89f843a-5ea0-49ff-a432-6cc7f6a29716/style.json?key=***REMOVED***"
        ref={mapRef ? mapRef : localMapRef}
        onRegionDidChange={regionChange}
        logoEnabled={false}
        attributionPosition={{right: RFValue(30),bottom: RFValue(10)}}
        compassEnabled={false}
        attributionEnabled={false}
        scaleBarEnabled={false}
        logoPosition={{ bottom: 20, left: 25 }}
        rotateEnabled={false}
        onPress={onPress}
        onDidFinishLoadingMap={() => {
          onDidFinishLoadingMap && onDidFinishLoadingMap();
        }}
        {...props}
      >
        {children}
      </MapLibreGL.MapView>
      <View style={{ ...appMapStyle.mapButtons, width: RFValue(35) }}>
        <AttributionButton
          showAttribution={() => {
            localMapRef.current && localMapRef.current?.showAttribution();
            mapRef && mapRef.current?.showAttribution();
          }}
        />
      </View>
    </Fragment>
  );
};

export default memo(MapView);
