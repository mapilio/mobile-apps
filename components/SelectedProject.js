import React from "react";
import { View, StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { MarketplaceIcon } from "../assets/svg/illustrations";
import {  maxCharacterHandler } from "../helper/helper";
import { CustomText } from "../highordercomponents";

const SelectedProject = ({ projectName }) => {
  return (
    <View style={styles.wrapper}>
      <MarketplaceIcon fill="#fff" width={RFValue(14)} height={RFValue(14)} />
      <CustomText style={styles.text}>
        {maxCharacterHandler(projectName, 19)}
      </CustomText>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: RFValue(15),
    paddingHorizontal: RFValue(20),
    backgroundColor: "#FBA63C",
    flexDirection: "row",
    alignItems: "center",
    height: RFValue(30),
  },
  text: {
    color: "#FFFFFF",
    marginLeft: RFValue(4),
    fontSize: RFValue(12),
  },
});

export default SelectedProject;
