import React from "react";
import { Text } from "react-native";

const CustomTextMedium = ({ style, lineCount = 1, children }) => (
  <Text
    style={[{ fontFamily: "Poppins-Medium", ...style }]}
    numberOfLines={lineCount}
    adjustsFontSizeToFit
  >
    {children}
  </Text>
);

export default CustomTextMedium;
