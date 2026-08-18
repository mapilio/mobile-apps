import React from 'react';
import { CustomText } from '../../../highordercomponents';
import { walkthroughStyle } from '../../../styles/walkthroughStyle';
import { TouchableOpacity } from 'react-native';

const Buttons = ({ active, onPress, desc }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <CustomText style={active === 0 ? walkthroughStyle.hide : walkthroughStyle.prevButton}>
        {desc}
      </CustomText>
    </TouchableOpacity>
  );
};

export default Buttons;
