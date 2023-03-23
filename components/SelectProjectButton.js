import React from "react";
import { View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { RFValue } from "react-native-responsive-fontsize";
import { DropdownArrow } from "../assets/svg/illustrations";
import { CustomText, CustomTextMedium } from "../highordercomponents";
import { useTranslation } from "react-i18next";

export const SelectProjectButton = ({ setModalVisible }) => {
  const { t } = useTranslation("camera");
  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
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
          {t("tasks")}
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
          {t("select_mission")}
        </CustomText>
        <DropdownArrow color="#fff" />
      </View>
    </TouchableOpacity>
  );
};

export default SelectProjectButton;
