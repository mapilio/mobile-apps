import React from "react";
import { View, TouchableOpacity } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { CustomText } from "../highordercomponents";
import { convertHexToRGBA } from "../helper/helper";
import {
  GoBackIcon,
  InformationIcon,
  MapIcon,
  SettingsIcon,
} from "../assets/svg/illustrations";
import CameraActionsButtons from "./CameraActionsButtons";
import { Routes } from "../navigator/Routes";

const CameraSidebar = ({ navigation }) => {
  return (
    <View
      style={{
        position: "relative",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <TouchableOpacity style={{ position: "absolute", top: 0, left: 0 }}>
        <SettingsIcon />
      </TouchableOpacity>
      <TouchableOpacity
        style={{ position: "absolute", top: RFValue(40), left: RFValue(2) }}
      >
        <InformationIcon />
      </TouchableOpacity>
      <TouchableOpacity style={{ position: "absolute", top: 0, right: 0 }}>
        <GoBackIcon />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate(Routes.cameraSettings)}
      >
        <CustomText
          style={{
            color: convertHexToRGBA("#FFFFFF", 75),
            fontSize: RFValue(14),
          }}
        >
          Advanced
        </CustomText>
      </TouchableOpacity>
      <CameraActionsButtons />
      <TouchableOpacity style={{ position: "absolute", bottom: 0, left: 0 }}>
        <MapIcon />
      </TouchableOpacity>
    </View>
  );
};

export default CameraSidebar;
