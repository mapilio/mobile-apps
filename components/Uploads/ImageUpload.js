import React, {useEffect, useState} from "react";
import {View} from "react-native";
import {globalStyles} from "../../styles/globalStyles";
import {CustomText, CustomTextMedium} from "../../highordercomponents";
import {userSequenceStyles} from "../../styles/userSequenceStyle";
import {UploadImageCard} from "../index";
import {useDispatch, useSelector} from "react-redux";
import database from "../../db";
import {SEQUENCE_IMAGES} from "../../store/actionsName";

const ImageUpload = ({ navigation, sequence_uuid }) => {
  const dispatch = useDispatch();
  const {sequenceImages} = useSelector((state) => state.uploadReducer)

  useEffect(() => {
    database.query(`SELECT id, path FROM captures where sequence_uuid = '${sequence_uuid}'`, (_, result) => {
      dispatch({type: SEQUENCE_IMAGES, payload: result.rows._array});
    })
  }, [sequence_uuid])


  const {uploadedImages, selectedImages} = useSelector(
    (state) => state.imagesReducer
  );

  return (
    <View style={globalStyles.container}>
      <CustomTextMedium style={globalStyles.screenTitle}>
        Images you uploaded
      </CustomTextMedium>
      <CustomText style={globalStyles.screenDescription}>
        Here you can upload or delete pictures.
      </CustomText>
      <View
        style={[
          userSequenceStyles.sequenceWrapper,
          globalStyles.screenTextMargin,
        ]}
      >

        {sequenceImages.map((image) => (
          <UploadImageCard
            key={image.id}
            path={image.path}
            id={image.id}
            uploadedImages={uploadedImages}
            selectedImages={selectedImages}
            navigation={navigation}
          />
        ))}
      </View>
    </View>
  );
};

export default ImageUpload;
