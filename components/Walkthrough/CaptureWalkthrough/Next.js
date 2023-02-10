
import React from "react";
import {TouchableOpacity} from "react-native";
import {CustomText} from "../../../highordercomponents";
import {walkthroughStyle} from "../../../styles/walkthroughStyle";

const Buttons = ({active, dataLength = 0, onPress, desc}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <CustomText style={active === dataLength - 1 ? walkthroughStyle.hide : walkthroughStyle.nextButton}>
        {desc}
      </CustomText>
    </TouchableOpacity>
  );
};

export default Buttons;