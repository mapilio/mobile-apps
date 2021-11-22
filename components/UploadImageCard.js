import React, { useEffect, useState } from "react";
import { Image, View, TouchableOpacity, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { sequenceCardStyles } from "../styles/userSequenceStyle";
import { SelectedIcon } from "../assets/svg/illustrations";
import {
  UPDATE_SELECTED_IMAGES,
  UPDATE_ALL_SELECT,
} from "../store/actionsName";

const UploadImageCard = (props) => {
  const dispatch = useDispatch();
  const { allSelect } = useSelector((state) => state.imagesReducer);
  const { id, path, selectedImages, uploadedImages } = props;
  const [selected, setSelected] = useState(false);

  const addToSelectedImages = () => {
    const isSelected = selectedImages.some((selectedId) => selectedId === id);
    if (isSelected) {
      const filteredImages = selectedImages.filter(
        (selectedID) => selectedID !== id
      );
      dispatch({ type: UPDATE_SELECTED_IMAGES, payload: filteredImages });
      setSelected(false);
    } else {
      selectedImages.push(id);
      dispatch({ type: UPDATE_SELECTED_IMAGES, payload: selectedImages });
      setSelected(true);
    }
  };

  useEffect(() => {
    if (allSelect) {
      setSelected(true);
    } else {
      setSelected(false);
    }
  }, [allSelect, setSelected]);

  useEffect(() => {
    if (selectedImages.length === 0) {
      dispatch({ type: UPDATE_ALL_SELECT, payload: false });
    } else if (selectedImages.length === uploadedImages.length) {
      dispatch({ type: UPDATE_ALL_SELECT, payload: true });
    }
  }, [selectedImages, uploadedImages, dispatch, selectedImages.length]);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={sequenceCardStyles.cardContainer}
      onPress={addToSelectedImages}
    >
      <View style={sequenceCardStyles.imagePosition}>
        <Image
          source={require("../assets/images/car.png")}
          resizeMode={"cover"}
          style={{
            ...sequenceCardStyles.imageContainer,
            borderWidth: selected ? 1 : 0,
            borderColor: selected ? "#1AD971" : "#000000",
          }}
        />
        {selected && (
          <View style={sequenceCardStyles.iconStyle}>
            <SelectedIcon />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default UploadImageCard;
