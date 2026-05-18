import React from 'react';
import { CustomText } from '../../../highordercomponents';
import { walkthroughStyle } from '../../../styles/walkthroughStyle';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Buttons = ({ active, dataLength = 0, desc }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.goBack();
      }}>
      <CustomText
        style={active !== dataLength - 1 ? walkthroughStyle.hide : walkthroughStyle.nextButton}>
        {desc}
      </CustomText>
    </TouchableOpacity>
  );
};

export default Buttons;
