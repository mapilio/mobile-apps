import React from "react";
import { View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { RFValue } from "react-native-responsive-fontsize";
import { DropdownArrow } from "../assets/svg/illustrations";
import { CustomText, CustomTextMedium } from "../highordercomponents";

export const SelectProjectButton = ({ setModalVisible }) => {
  return (
    <TouchableOpacity
      style={{
        width: RFValue(200),
        height: RFValue(30),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: RFValue(15),
        paddingHorizontal: RFValue(5),
      }}
      onPressIn={() => setModalVisible(true)}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <CustomTextMedium
          style={{
            fontSize: RFValue(14),
            color: "#FFFFFF",
            marginLeft: RFValue(3),
          }}
        >
          Tasks
        </CustomTextMedium>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <CustomText
          style={{
            fontSize: RFValue(12),
            color: "#FFFFFF",
            marginLeft: RFValue(6),
            marginRight: RFValue(3),
          }}
        >
          Select mission
        </CustomText>
        <DropdownArrow />
      </View>
    </TouchableOpacity>
  );
};

export default SelectProjectButton;
