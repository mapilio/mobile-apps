import React from "react";
import { CustomText } from "../../../highordercomponents";
import { walkthroughStyle } from "../../../styles/walkthroughStyle";
import { TouchableOpacity } from "react-native";

const Buttons = ({ active }) => {
  return (
    active !== 0 && (
      <TouchableOpacity onPress={() => _carousel.snapToPrev()}>
        <CustomText style={walkthroughStyle.prevButton}>Prev</CustomText>
      </TouchableOpacity>
    )
  );
};

export default Buttons;
