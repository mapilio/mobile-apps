import React, {useEffect, useState} from "react";
import {View} from "react-native";
import {globalStyles} from "../../styles/globalStyles";
import {CustomText, CustomTextMedium} from "../../highordercomponents";
import {userSequenceStyles} from "../../styles/userSequenceStyle";
import {UploadImageCard} from "../index";
import {useDispatch, useSelector} from "react-redux";
import database from "../../db";
import {SEQUENCE_IMAGES} from "../../store/actionsName";
import {RFValue} from "react-native-responsive-fontsize";
import * as FileSystem from "expo-file-system";

const ImageUpload = ({ navigation, group_id }) => {
  const dispatch = useDispatch();
  const [imageLoad, setLoadImage] = useState(true);
  const {sequenceImages} = useSelector((state) => state.uploadReducer);
  const {uploadedImages, selectedImages} = useSelector((state) => state.imagesReducer);

  useEffect(() => {
    return navigation.addListener("focus", () => {
      database.query(
        `SELECT id, path,location FROM captures where group_id = '${group_id}' ORDER BY id ASC`,
        (_, result) => {
          dispatch({type: SEQUENCE_IMAGES, payload: result.rows._array});
        }
      );
    });
  }, [group_id, navigation]);

  useEffect(() => {
    return navigation.addListener("blur", () => {
      dispatch({type: SEQUENCE_IMAGES, payload: []});
    });
  }, [navigation]);

  return (
    <View style={globalStyles.container}>
      <View style={{ marginTop: RFValue(25) }}>
        <CustomTextMedium style={globalStyles.screenTitle}>
          Images you uploaded
        </CustomTextMedium>
        <CustomText style={globalStyles.screenDescription}>
          Here you can upload or delete pictures.
        </CustomText>
      </View>
      <View
        style={[userSequenceStyles.sequenceWrapper, globalStyles.screenTextMargin]}>
        {sequenceImages.map((image) => (
          <UploadImageCard
            key={image.id}
            path={FileSystem.documentDirectory + `${group_id}/${image.path.split('/').pop()}`}
            location={JSON.parse(image.location)}
            id={image.id}
            uploadedImages={uploadedImages}
            selectedImages={selectedImages}
            navigation={navigation}
            setLoadImage={setLoadImage}
            sequence_uuid={group_id}
          />
        ))}
      </View>
    </View>
  );
};

export default ImageUpload;
