import React, {useEffect, useState} from "react";
import {View} from "react-native";
import {globalStyles} from "../../styles/globalStyles";
import {CustomText, CustomTextMedium} from "../../highordercomponents";
import {userSequenceStyles} from "../../styles/userSequenceStyle";
import {UploadImageCard} from "../index";
import {useSelector} from "react-redux";
import database from "../../db";

const ImageUpload = ({ navigation, sequence_uuid }) => {

  const [images, setImages] = useState([]);
  const db = database.getConnection();

  useEffect(() => {
    db.transaction((txn) => {
      txn.executeSql(
        `SELECT id, path
         FROM captures
         where sequence_uuid = '${sequence_uuid}'`,
        [],
        (_, result) => {
          setImages(result.rows._array);
        },
        (_, error) => {
          console.log(error)
        }
      )
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

        {images.map((image) => (
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
