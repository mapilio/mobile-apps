import React from "react";
import { View, TouchableOpacity } from "react-native";
import { CustomTextMedium } from "../../highordercomponents";
import { sequenceRight } from "../../styles/navigatorBarStyles";
import { useDispatch, useSelector } from "react-redux";
import {
  UPDATE_ALL_SELECT,
  UPDATE_SELECTED_IMAGES,
} from "../../store/actionsName";
import {Upload} from "../../components/Uploads";

const SequenceNavigatorRight = ({navigation}) => {
  const dispatch = useDispatch();
  const {allSelect, uploadedImages} = useSelector((state) => state.imagesReducer);
  const {activeSequence, switchSelector} = useSelector((state) => state.uploadReducer)

  const allSelectHandler = () => {
    if (allSelect) {
      dispatch({ type: UPDATE_SELECTED_IMAGES, payload: [] });
      dispatch({ type: UPDATE_ALL_SELECT, payload: false });
    } else {
      const allImagesID = uploadedImages.map((image) => image.id);
      dispatch({ type: UPDATE_SELECTED_IMAGES, payload: allImagesID });
      dispatch({ type: UPDATE_ALL_SELECT, payload: true });
    }
  };

  return (
    <View style={sequenceRight.container}>
      {
        switchSelector === 'image' && (
          <TouchableOpacity onPress={allSelectHandler}>
            <CustomTextMedium style={sequenceRight.title}>
              {allSelect ? "Unselect" : "Select"}
            </CustomTextMedium>
          </TouchableOpacity>
        )
      }

      <Upload sequence_uuid={activeSequence} navigation={navigation} />
    </View>
  );
};

export default SequenceNavigatorRight;
