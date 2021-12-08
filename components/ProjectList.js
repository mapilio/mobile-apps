import React from "react";
import { Button, TouchableHighlight, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { RFValue } from "react-native-responsive-fontsize";
import { convertHexToRGBA, maxCharacterHandler } from "../helper/helper";
import {
  CustomText,
  CustomTextBold,
  CustomTextMedium,
} from "../highordercomponents";

const ProjectList = () => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: convertHexToRGBA("#CBD1D9", 20),
        padding: RFValue(10),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: RFValue(4),
        marginBottom: RFValue(6),
      }}
    >
      <View>
        <CustomTextMedium style={{ fontSize: RFValue(14), color: "#32425B" }}>
          {maxCharacterHandler("Crosswalk detection project lorem", 40)}
        </CustomTextMedium>
        <CustomText
          style={{
            fontSize: RFValue(12),
            color: convertHexToRGBA("#4B6583", 60),
          }}
        >
          LaneMarketing Recogni
        </CustomText>
      </View>
      <TouchableOpacity
        style={{
          backgroundColor: "#4A90E2",
          borderRadius: RFValue(4),
          justifyContent: "center",
          alignItems: "center",
          width: RFValue(70),
          height: RFValue(30),
        }}
      >
        <CustomTextMedium style={{ fontSize: RFValue(12), color: "#FFFFFF" }}>
          Start
        </CustomTextMedium>
      </TouchableOpacity>
      {/* <Button
        color={"#4A90E2"}
        title={"Start"}
        accessibilityLabel={"Project start button"}
        style={{ borderRadius: RFValue(3) }}
      /> */}
    </View>
  );
};

export default ProjectList;
