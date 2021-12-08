import React from "react";
import { Text } from "react-native";

const CustomText = ({ style, lineCount = 2, children, onPress }) => (
  <Text
    style={[{ fontFamily: "Poppins", ...style }]}
    numberOfLines={lineCount}
    onPress={onPress}
  >
    {children}
  </Text>
);

export default CustomText;
