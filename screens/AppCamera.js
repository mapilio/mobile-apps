import React from "react";
import { View } from "react-native";
import { Camera, CameraSidebar } from "../components";
import { RFValue } from "react-native-responsive-fontsize";

const AppCamera = ({ navigation }) => {
  return (
    <View style={{ flex: 1, flexDirection: "row" }}>
      <View style={{ flex: 0.78 }}>
        <Camera navigation={navigation} />
      </View>
      <View
        style={{
          flex: 0.22,
          backgroundColor: "#2E2E2E",
          padding: RFValue(22),
        }}
      >
        <CameraSidebar />
      </View>
    </View>
  );
};

export default AppCamera;
