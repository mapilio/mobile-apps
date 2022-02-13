import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { globalStyles } from "../../styles/globalStyles";
import { CustomText, CustomTextMedium } from "../../highordercomponents";
import { userSequenceStyles } from "../../styles/userSequenceStyle";
import { UploadImageCard } from "../index";
import { useDispatch, useSelector } from "react-redux";
import database from "../../db";
import { SEQUENCE_IMAGES } from "../../store/actionsName";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { RFValue } from "react-native-responsive-fontsize";

const ImageUpload = ({ navigation, sequence_uuid }) => {
  const dispatch = useDispatch();
  const [imageLoad, setLoadImage] = useState(true);
  const { sequenceImages } = useSelector((state) => state.uploadReducer);

  useEffect(() => {
    let unsubscribe = navigation.addListener("focus", () => {
      database.query(
        `SELECT id, path FROM captures where sequence_uuid = '${sequence_uuid}'`,
        (_, result) => {
          dispatch({ type: SEQUENCE_IMAGES, payload: result.rows._array });
        }
      );
    });
    return unsubscribe;
  }, [sequence_uuid, navigation]);

  useEffect(() => {
    let unsubscribe = navigation.addListener("blur", () => {
      dispatch({ type: SEQUENCE_IMAGES, payload: [] });
    });
    return unsubscribe;
  }, [navigation]);

  const { uploadedImages, selectedImages } = useSelector(
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
        {imageLoad &&
          [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
            <View
              style={{ maxWidth: "33%", justifyContent: "space-between" }}
              key={i}
            >
              <SkeletonPlaceholder>
                <View
                  style={{
                    width: RFValue(100),
                    height: RFValue(78),
                    borderRadius: 8,
                    marginRight: RFValue(5),
                    marginBottom: RFValue(5),
                  }}
                />
              </SkeletonPlaceholder>
            </View>
          ))}
        {sequenceImages.map((image) => (
          <UploadImageCard
            key={image.id}
            path={image.path}
            id={image.id}
            uploadedImages={uploadedImages}
            selectedImages={selectedImages}
            navigation={navigation}
            setLoadImage={setLoadImage}
            sequence_uuid={sequence_uuid}
          />
        ))}
      </View>
    </View>
  );
};

export default ImageUpload;
