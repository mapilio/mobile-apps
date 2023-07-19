import React from "react";
import { Svg, Defs, Rect, Pattern } from "react-native-svg";
import { View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { RFValue } from "react-native-responsive-fontsize";

const MapLoading = ({style}) => {
  return (
    <View style={{ height: "100%", width: "100%", zIndex:2, ...style}}>
      <LinearGradient
        colors={["rgba(255,255,255,0.5)", "rgba(255,255,255,0.1)"]}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: RFValue(100),
          zIndex: 5,
        }}
      />
      <Svg width="100%" height="100%">
        <Defs>
          <Pattern
            id="squares"
            x="0"
            y="0"
            width="50"
            height="50"
            patternUnits="userSpaceOnUse"
          >
            <Rect x="0" y="0" width="49" height="49" fill="rgb(236,236,236)" />
          </Pattern>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="#FFF" />
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#squares)" />
      </Svg>
    </View>
  );
};

export default MapLoading;
