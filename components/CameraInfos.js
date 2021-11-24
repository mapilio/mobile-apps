import React from "react";
import { View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { CustomText } from "../highordercomponents";

const CameraInfos = () => {
  return (
    <View
      style={{
        flex: 1,
        marginVertical: RFValue(25),
        marginHorizontal: RFValue(20),
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          top: 0,
          left: 0,
          marginTop: RFValue(17),
          marginLeft: RFValue(17),
        }}
      >
        <CustomText
          style={{ color: "#FFFFFF", fontSize: RFValue(12) }}
        >98%</CustomText>
        <View></View>
      </View>
    </View>
  );
};

export default CameraInfos;
