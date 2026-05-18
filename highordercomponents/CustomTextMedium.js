import React from 'react';
import { Text } from 'react-native';

const CustomTextMedium = ({ style, lineCount = null, children, onPress }) => (
  <Text
    style={[{ fontFamily: 'Poppins-Medium', ...style }]}
    numberOfLines={lineCount}
    onPress={onPress}>
    {children}
  </Text>
);

export default CustomTextMedium;
