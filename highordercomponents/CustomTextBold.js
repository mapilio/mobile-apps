import React from "react";
import { Text, View } from "react-native";

const CustomTextBold = (props) => (
  <View style={{ flexDirection: "row" }}>
    <Text
      style={[
        {
          fontFamily: "Poppins-SemiBold",
          flex: 1,
          flexWrap: "wrap",
          ...props.style,
        },
      ]}
      numberOfLines={12}
      adjustsFontSizeToFit
    >
      {props.children}
    </Text>
  </View>
);

export default CustomTextBold;
