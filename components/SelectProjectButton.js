import React from "react";
import { Dimensions, TouchableHighlight, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { RFValue } from "react-native-responsive-fontsize";
import { DropdownArrow, TaskIcon } from "../assets/svg/illustrations";
import { CustomText, CustomTextMedium } from "../highordercomponents";

const SelectProjectButton = ({ setModalVisible }) => {
  return (
    <TouchableOpacity
      style={{
        width: RFValue(200),
        height: RFValue(30),
        backgroundColor: "#4A90E2",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        borderRadius: RFValue(15),
        paddingHorizontal: RFValue(5),
      }}
      onPress={() => setModalVisible(true)}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TaskIcon />
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
