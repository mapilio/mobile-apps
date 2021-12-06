import React from "react";
import { TouchableOpacity } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { CustomText } from "../../../highordercomponents";
import { Routes } from "../../../navigator/Routes";

const Buttons = ({ active, dataLength = 0, setModalVisible, navigation }) => {
  return (
    <TouchableOpacity
      onPress={() =>
        active === dataLength - 1
          ? navigation.navigate(Routes.login)
          : _carousel.snapToNext()
      }
    >
      <CustomText style={{ fontSize: RFValue(17), color: "#4A4A4A" }}>
        {active === dataLength - 1 ? "Finish" : "Next"}
      </CustomText>
    </TouchableOpacity>
  );
};

export default Buttons;
