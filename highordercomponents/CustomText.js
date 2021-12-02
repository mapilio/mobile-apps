import React from "react";
import { Text } from "react-native";

const CustomText = (props) => (
  <Text style={[{ fontFamily: "Poppins", ...props.style }]} numberOfLines={2} onPress={props.onPress}>
    {props.children}
  </Text>
);

export default CustomText;
