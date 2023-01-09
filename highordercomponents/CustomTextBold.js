import React from "react";
import { Text, View } from "react-native";

const CustomTextBold = ({ style, lineCount = null, children, onPress }) => (
  <Text
    style={[
      {
        fontFamily: "Poppins-SemiBold",
        ...style,
      },
    ]}
    numberOfLines={lineCount}
    adjustsFontSizeToFit
    onPress={onPress}
  >
    {children}
  </Text>
);

export default CustomTextBold;
