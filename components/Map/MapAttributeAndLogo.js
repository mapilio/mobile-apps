import React from "react";
import {Image, Linking, Text, View} from "react-native";
import {mapAttrStyle} from "../../styles/mapAttrStyle";
import MapAttribute from "../../assets/svg/illustrations/MapAttribute";

const MapAttributeAndLogo = () => {
  return (
      <View style={mapAttrStyle.wrapper}>
          <Text
              style={mapAttrStyle.text}
              onPress={() => Linking.openURL('https://www.mapbox.com/about/maps/')}
          >
              © Mapbox
          </Text>
          <View
              style={mapAttrStyle.attr}
          >
              <MapAttribute />
          </View>
      </View>
  );
};

export default MapAttributeAndLogo;
