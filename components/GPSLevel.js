import React from "react";
import { View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { GoodGPS } from "../assets/svg/illustrations";
import { CustomTextMedium } from "../highordercomponents";

const GPSLevel = () => {
  return (
    <View
      style={{
        marginBottom: RFValue(-40),
        marginLeft: RFValue(-19),
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <GoodGPS />
      <CustomTextMedium
        style={{
          color: "#FFFFFF",
          fontSize: RFValue(14),
          marginLeft: RFValue(5),
          marginBottom: RFValue(-2),
        }}
      >
        Good GPS
      </CustomTextMedium>
    </View>
  );
};

export default GPSLevel;
