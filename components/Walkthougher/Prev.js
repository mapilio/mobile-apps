import React from "react";
import {CustomText} from "../../highordercomponents";
import {walkthogherStyle} from "../../styles/walkthogherStyle";
import {TouchableOpacity} from "react-native";

const Buttons = ({active}) => {
  return (
    <TouchableOpacity onPress={() => _carousel.snapToPrev()}>
      <CustomText style={active === 0 ? walkthogherStyle.hide : walkthogherStyle.prevButton}>
        Prev
      </CustomText>
    </TouchableOpacity>
  );
};

export default Buttons;
