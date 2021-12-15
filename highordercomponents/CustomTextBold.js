import React from "react";
import { Text, View } from "react-native";

const CustomTextBold = ({ style, lineCount = null, children }) => (
  <View style={{ flexDirection: "row" }}>
    <Text
      style={[
        {
          fontFamily: "Poppins-SemiBold",
          flex: 1,
          flexWrap: "wrap",
          ...style,
        },
      ]}
      numberOfLines={lineCount}
      adjustsFontSizeToFit
    >
      {children}
    </Text>
  </View>
);

export default CustomTextBold;
