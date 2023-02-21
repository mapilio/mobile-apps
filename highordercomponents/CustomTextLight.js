import React from "react";
import { Text } from "react-native";

const CustomText = ({ style, lineCount = null, children, onPress }) => (
  <Text
    style={[{ fontFamily: "Poppins-Light", ...style }]}
    numberOfLines={lineCount}
    onPress={onPress}
  >
    {children}
  </Text>
);

export default CustomText;
