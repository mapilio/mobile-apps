import React, { Fragment, memo } from "react";
import MapLibreGL, { Logger } from "@maplibre/maplibre-react-native";
import { AttributionButton } from "../components/Map";
import { appMapStyle } from "../styles/appMapStyle";
import { Platform, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useActionSheet } from "@expo/react-native-action-sheet";
import * as Linking from "expo-linking";
import { useSelector } from "react-redux";

MapLibreGL.setAccessToken(null);
Logger.setLogLevel("error");

const MapView = ({
  children,
  mapRef,
  regionChange,
  mapStyle,
  onPress,
  onDidFinishLoadingMap,
  isAttributionsEnabled = true,
  ...props
}) => {
  const { showActionSheetWithOptions } = useActionSheet();

  const {config} = useSelector(state => state.generalReducer)

  const styleKey = Platform.OS === "ios" ? config.mapTokens?.iosToken : config.mapTokens?.androidToken
  const styleBaseURL = "https://api.maptiler.com/maps/basic-v2-light/style.json?key="
  const styleURL = styleKey ? `${styleBaseURL}${styleKey}` : undefined

  const showAttributions = () => {
    showActionSheetWithOptions(
      {
        title: `MapLibre Maps SDK for ${Platform.OS.toUpperCase()}`,
        options: ["Cancel", "© MapTiler", "© OpenStreetMap Contributors"],
        cancelButtonIndex: 0,
      },
      (buttonIndex) => {
        if (buttonIndex === 1) {
          Linking.openURL("https://www.maptiler.com/copyright");
        } else if (buttonIndex === 2) {
          Linking.openURL("https://www.openstreetmap.org/copyright");
        }
      }
    );
  };

  return (
    <Fragment>
      <MapLibreGL.MapView
        key={styleURL}
        style={mapStyle}
        styleURL={styleURL}
        ref={mapRef}
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
      {isAttributionsEnabled && <View style={{ ...appMapStyle.mapButtons, width: RFValue(35) }}>
        <AttributionButton
          showAttribution={showAttributions}
        />
      </View>}
    </Fragment>
  );
};

export default memo(MapView);
