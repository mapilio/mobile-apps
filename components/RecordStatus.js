import React from "react";
import { Dimensions, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useSelector } from "react-redux";
import { CustomTextMedium } from "../highordercomponents";

const RecordStatus = () => {
  const { autocaptureStart } = useSelector((state) => state.settingsReducer);
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginTop: RFValue(-40),
        right: RFValue(-2),
      }}
    >
      {autocaptureStart ? (
        <>
          <View
            style={{
              backgroundColor: "#1AD971",
              width: RFValue(12),
              height: RFValue(12),
              marginRight: RFValue(5),
              marginTop: RFValue(-2),
              borderRadius:
                Math.round(
                  Dimensions.get("window").width +
                    Dimensions.get("window").height
                ) / 2,
            }}
          ></View>
          <CustomTextMedium style={{ fontSize: RFValue(14), color: "#FFFFFF" }}>
            REC
          </CustomTextMedium>
        </>
      ) : (
        <>
          <View
            style={{
              backgroundColor: "#E24A4A",
              width: RFValue(12),
              height: RFValue(12),
              marginRight: RFValue(5),
              marginTop: RFValue(-2),
              borderRadius:
                Math.round(
                  Dimensions.get("window").width +
                    Dimensions.get("window").height
                ) / 2,
            }}
          ></View>
          <CustomTextMedium style={{ fontSize: RFValue(14), color: "#FFFFFF" }}>
            NO REC
          </CustomTextMedium>
        </>
      )}
    </View>
  );
};

export default RecordStatus;
