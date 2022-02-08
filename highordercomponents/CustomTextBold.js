import React from "react";
import { Text, View } from "react-native";

const CustomTextBold = ({ style, lineCount = null, children, onPress }) => (
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
      onPress={onPress}
    >
      {children}
    </Text>
  </View>
);

export default CustomTextBold;
