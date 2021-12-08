import React from "react";
import { Text } from "react-native";

const CustomText = (props) => (
  <Text style={[{ fontFamily: "Poppins", ...props.style }]} numberOfLines={props.numberOfLines} onPress={props.onPress}>
    {props.children}
  </Text>
);

export default CustomText;
