import React from "react";
import {CustomText} from "../../../highordercomponents";
import {walkthroughStyle} from "../../../styles/walkthroughStyle";
import {TouchableOpacity} from "react-native";


const Buttons = ({active, dataLength = 0, modalVisible, setModalVisible}) => {
  return (
    <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
      <CustomText style={active !== dataLength - 1 ? walkthroughStyle.hide : walkthroughStyle.nextButton}>
        Start
      </CustomText>
    </TouchableOpacity>
  );
};

export default Buttons;
