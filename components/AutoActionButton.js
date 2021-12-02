import React, { useState } from "react";
import { Dimensions, TouchableOpacity, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { convertHexToRGBA } from "../helper/helper";
import { PlayIcon, StopIcon } from "../assets/svg/illustrations";

const AutoActionButton = ({ disabled }) => {
  const [autoCapture, setAutoCapture] = useState(false);

  return (
    <TouchableOpacity
      disabled={disabled}
      style={{
        width: RFValue(61),
        height: RFValue(61),
        marginBottom: RFValue(-55),
        marginTop: RFValue(35),
      }}
    >
      <View
        style={{
          position: "absolute",
          top: "12%",
          left: "12%",
          bottom: "12%",
          right: "12%",
          borderRadius:
            Math.round(
              Dimensions.get("window").width + Dimensions.get("window").height
            ) / 2,
          backgroundColor: "#ffffff",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {autoCapture ? <PlayIcon /> : <StopIcon />}
      </View>
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          borderWidth: RFValue(5),
          margin: RFValue(-2),
          borderColor: convertHexToRGBA("#FFFFFF", 10),
          borderRadius:
            Math.round(
              Dimensions.get("window").width + Dimensions.get("window").height
            ) / 2,
        }}
      ></View>
    </TouchableOpacity>
  );
};

export default AutoActionButton;
