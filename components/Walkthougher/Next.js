import React from "react";
import {TouchableOpacity} from "react-native";
import {CustomText} from "../../highordercomponents";
import {walkthogherStyle} from "../../styles/walkthogherStyle";

const Buttons = ({active, dataLength = 0}) => {
  return (
    <TouchableOpacity onPress={() => _carousel.snapToNext()}>
      <CustomText style={active === dataLength - 1 ? walkthogherStyle.hide : walkthogherStyle.nextButton}>
        Next
      </CustomText>
    </TouchableOpacity>
  );
};

export default Buttons;
