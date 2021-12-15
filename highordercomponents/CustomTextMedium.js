import React from "react";
import { Text } from "react-native";

const CustomTextMedium = ({ style, lineCount = null, children }) => (
  <Text
    style={[{ fontFamily: "Poppins-Medium", ...style }]}
    numberOfLines={lineCount}
  >
    {children}
  </Text>
);

export default CustomTextMedium;
