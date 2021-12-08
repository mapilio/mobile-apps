import React from "react";
import {CustomText} from "../../highordercomponents";
import {walkthogherStyle} from "../../styles/walkthogherStyle";
import {TouchableOpacity} from "react-native";


const Buttons = ({active, dataLength = 0, modalVisible, setModalVisible}) => {
  return (
    <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
      <CustomText style={active !== dataLength - 1 ? walkthogherStyle.hide : walkthogherStyle.nextButton}>
        Start
      </CustomText>
    </TouchableOpacity>
  );
};

export default Buttons;
