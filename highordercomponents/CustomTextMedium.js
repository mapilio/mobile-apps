import React from "react";
import { Text } from "react-native";

const CustomTextMedium = (props) => (
  <Text
    style={[{ fontFamily: "Poppins-Medium", ...props.style }]}
    numberOfLines={props.numberOfLines}
    adjustsFontSizeToFit
  >
    {props.children}
  </Text>
);

export default CustomTextMedium;
