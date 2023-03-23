import React from "react";
import {StyleSheet, View} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useSelector } from "react-redux";
import { Rec } from "../assets/svg/illustrations";
import { CustomText } from "../highordercomponents";

const RecordStatus = () => {
  const { autoCaptureStart } = useSelector((state) => state.settingsReducer);
  return (
      <View style={styles.recordInfo}>
        <CustomText style={{ fontSize: RFValue(14), color: "#FFFFFF" }}>
          {autoCaptureStart ? 'REC' : 'NO REC'}
        </CustomText>
        <View style={{marginLeft:RFValue(9)}}>
        <Rec fill={autoCaptureStart ? "#ee000f" : "#fff"} />
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  recordInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
})

export default RecordStatus;
