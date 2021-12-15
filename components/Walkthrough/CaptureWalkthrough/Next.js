import React from "react";
import {TouchableOpacity} from "react-native";
import {CustomText} from "../../../highordercomponents";
import {walkthroughStyle} from "../../../styles/walkthroughStyle";

const Buttons = ({active, dataLength = 0}) => {
  return (
    <TouchableOpacity onPress={() => _carousel.snapToNext()}>
      <CustomText style={active === dataLength - 1 ? walkthroughStyle.hide : walkthroughStyle.nextButton}>
        Next
      </CustomText>
    </TouchableOpacity>
  );
};

export default Buttons;
