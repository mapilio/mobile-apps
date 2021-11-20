import React from "react";
import { Text } from "react-native";

const CustomText = (props) => (
  <Text style={[{ fontFamily: "Poppins", ...props.style }]} numberOfLines={2}>
    {props.children}
  </Text>
);

export default CustomText;
