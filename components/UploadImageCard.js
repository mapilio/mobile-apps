import React, { useEffect, useState } from "react";
import { Image, View, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { sequenceCardStyles } from "../styles/userSequenceStyle";
import { SelectedIcon } from "../assets/svg/illustrations";
import {
  UPDATE_SELECTED_IMAGES,
  UPDATE_ALL_SELECT,
} from "../store/actionsName";
import { Routes } from "../navigator/Routes";
import { RFValue } from "react-native-responsive-fontsize";

const UploadImageCard = (props) => {
  const dispatch = useDispatch();
  const [selected, setSelected] = useState(false);
  const { id, selectedImages, uploadedImages, path, setLoadImage } = props;
  const { allSelect } = useSelector((state) => state.imagesReducer);

  const addToSelectedImages = () => {
    const isSelected = selectedImages.some((selectedId) => selectedId.id === id);

    if (isSelected) {
      const filteredImages = selectedImages.filter((selectedID) => selectedID.id !== id);
      dispatch({ type: UPDATE_SELECTED_IMAGES, payload: filteredImages });
      setSelected(false);
    } else {
      selectedImages.push({id, path});
      dispatch({ type: UPDATE_SELECTED_IMAGES, payload: selectedImages });
      setSelected(true);
    }
  };

  useEffect(() => setSelected(allSelect), [allSelect, setSelected]);

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
      onPress={() => {
        selectedImages.length ? addToSelectedImages() : (
          props.navigation.reset({
            index: 0, routes: [{
              name: Routes.sequenceDetail, params: {
                id: id,
                path: path,
                sequence_uuid: props.sequence_uuid,
                coordinate: [
                  props.location.longitude,
                  props.location.latitude,
                ],
                heading: props.location.heading,
              }
            }]
          })
        )
      }}
      onLongPress={addToSelectedImages}
    >
      <View style={sequenceCardStyles.imagePosition}>
        <Image
          source={{width: RFValue(200), height: RFValue(78), uri: `${path}`}}
          resizeMode={"cover"}
          style={{
            ...sequenceCardStyles.imageContainer,
            borderWidth: selected ? 1 : 0,
            borderColor: selected ? "#1AD971" : "#000000",
          }}
          onLoadEnd={() => setLoadImage(false)}
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
