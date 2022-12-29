import React from "react";
import {CustomText} from "../../../highordercomponents";
import {walkthroughStyle} from "../../../styles/walkthroughStyle";
import {TouchableOpacity} from "react-native";

const Buttons = ({active, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <CustomText style={active === 0 ? walkthroughStyle.hide : walkthroughStyle.prevButton}>
        Prev
      </CustomText>
    </TouchableOpacity>
  );
};

export default Buttons;
