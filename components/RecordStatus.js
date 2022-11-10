import React from "react";
import {Dimensions, StyleSheet, View} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useSelector } from "react-redux";
import { CustomTextMedium } from "../highordercomponents";

const RecordStatus = () => {
  const { autoCaptureStart } = useSelector((state) => state.settingsReducer);
  return (
    <View style={styles.wrapper}>

      <View style={styles.recordInfo}>
        <View style={{...styles.recordIcon, backgroundColor: autoCaptureStart ? '#E24A4A' : '#1AD971'}} />
        <CustomTextMedium style={{ fontSize: RFValue(14), color: "#FFFFFF" }}>
          {autoCaptureStart ? 'REC' : 'NO REC'}
        </CustomTextMedium>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderRightWidth: 1.2,
    borderTopWidth: 1.2,
    borderColor: '#FFF',
    height: RFValue(55),
    width: RFValue(105),
    position: "relative"
  },
  recordInfo: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    right: RFValue(10),
    top: RFValue(10)
  },
  recordIcon: {
    width: RFValue(12),
    height: RFValue(12),
    marginRight: RFValue(5),
    marginTop: RFValue(-2),
    borderRadius: Math.round(Dimensions.get("window").width + Dimensions.get("window").height) / 2,
  }
})

export default RecordStatus;
