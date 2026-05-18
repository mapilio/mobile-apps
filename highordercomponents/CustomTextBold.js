import React from 'react';
import { Text, View } from 'react-native';

const CustomTextBold = ({ style, lineCount = null, children, onPress, adjustFontSize = true }) => (
  <Text
    style={[
      {
        fontFamily: 'Poppins-SemiBold',
        ...style,
      },
    ]}
    numberOfLines={lineCount}
    adjustsFontSizeToFit={adjustFontSize}
    onPress={onPress}>
    {children}
  </Text>
);

export default CustomTextBold;
