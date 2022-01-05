import React from "react";
import {CustomText} from "../../../highordercomponents";
import {walkthroughStyle} from "../../../styles/walkthroughStyle";
import {TouchableOpacity} from "react-native";

const Buttons = ({active,carousel}) => {
  return (
    <TouchableOpacity onPress={() => carousel.snapToPrev()}>
      <CustomText style={active === 0 ? walkthroughStyle.hide : walkthroughStyle.prevButton}>
        Prev
      </CustomText>
    </TouchableOpacity>
  );
};

export default Buttons;
