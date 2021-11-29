import React from "react";
import { View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { CustomTextMedium } from "../highordercomponents";

const PhotoAmounts = () => {
  return (
    <View
      style={{
        flexDirection: "row",
        marginBottom: RFValue(-45),
        marginLeft: RFValue(18),
      }}
    >
      <CustomTextMedium
        style={{
          fontSize: RFValue(14),
          color: "#1AD971",
        }}
      >
        12
      </CustomTextMedium>
      <CustomTextMedium
        style={{
          color: "#FFFFFF",
          fontSize: RFValue(14),
          marginHorizontal: RFValue(3),
        }}
      >
        /
      </CustomTextMedium>
      <CustomTextMedium style={{ color: "#FFFFFF", fontSize: RFValue(14) }}>
        128
      </CustomTextMedium>
    </View>
  );
};

export default PhotoAmounts;
