import React from "react";
import {CustomText} from "../../../highordercomponents";
import {walkthroughStyle} from "../../../styles/walkthroughStyle";
import {TouchableOpacity} from "react-native";
import {Routes} from "../../../navigator/Routes";


const Buttons = ({active, dataLength = 0, modalVisible, setModalVisible,navigation}) => {
  return (
    <TouchableOpacity onPress={() => navigation.navigate(Routes.camera)}>
      <CustomText style={active !== dataLength - 1 ? walkthroughStyle.hide : walkthroughStyle.nextButton}>
        Finish
      </CustomText>
    </TouchableOpacity>
  );
};

export default Buttons;
