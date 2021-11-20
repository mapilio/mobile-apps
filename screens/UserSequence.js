import React from "react";
import { ScrollView, View } from "react-native";
import { useSelector } from "react-redux";
import { UploadImageCard } from "../components";
import { CustomText, CustomTextMedium } from "../highordercomponents";
import { globalStyles } from "../styles/globalStyles";
import { userSequenceStyles } from "../styles/userSequenceStyle";

const UserSequence = ({ navigation }) => {
  const { uploadedImages, selectedImages } = useSelector(
    (state) => state.imagesReducer
  );

  return (
    <ScrollView>
      <View style={globalStyles.container}>
        <CustomTextMedium style={globalStyles.screenTitle}>
          Upload Photos
        </CustomTextMedium>
        <CustomText style={globalStyles.screenDescription}>
          Here you can delete pictures and add new pictures.
        </CustomText>
        <View
          style={[
            userSequenceStyles.sequenceWrapper,
            globalStyles.screenTextMargin,
          ]}
        >
          {uploadedImages.map((image) => (
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
    </ScrollView>
  );
};

export default UserSequence;
