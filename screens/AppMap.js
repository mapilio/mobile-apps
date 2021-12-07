import React from "react";
import { ScrollView, View } from "react-native";
import { globalStyles } from "../styles/globalStyles";
import { appMapStyle } from "../styles/appMapStyle";
import MapboxGL from "@react-native-mapbox-gl/maps";

MapboxGL.setAccessToken(
    "pk.eyJ1IjoiZGlhc2hhbGFiaSIsImEiOiJja3dwMjR6Y3IwOG5zMm9sMDVzYXl3dnNvIn0.pRISURiBok67zjI1B4jDhQ"
);

const AppMap = ({ navigation }) => {
  return (
    <ScrollView>
      <View style={globalStyles.container}>
          <View style={appMapStyle.page}>
              <View style={appMapStyle.container}>
                  <MapboxGL.MapView style={appMapStyle.map} />
              </View>
          </View>
      </View>
    </ScrollView>
  );
};

export default AppMap;
