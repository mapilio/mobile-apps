import React from "react";
import { CustomText } from "../../../highordercomponents";
import { walkthroughStyle } from "../../../styles/walkthroughStyle";
import { TouchableOpacity } from "react-native";
import { Routes } from "../../../navigator/Routes";
import { useDispatch } from "react-redux";
import { UPDATE_CAMERA_WALKTHROUGH_STATUS } from "../../../store/actionsName";

const Buttons = ({
  active,
  dataLength = 0,
  modalVisible,
  setModalVisible,
  navigation,
}) => {
  const dispatch = useDispatch();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate(Routes.camera);
        dispatch({ type: UPDATE_CAMERA_WALKTHROUGH_STATUS, payload: true });
      }}
    >
      <CustomText
        style={
          active !== dataLength - 1
            ? walkthroughStyle.hide
            : walkthroughStyle.nextButton
        }
      >
        Finish
      </CustomText>
    </TouchableOpacity>
  );
};

export default Buttons;
