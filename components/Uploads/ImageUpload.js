import React from "react";
import {View} from "react-native";
import {globalStyles} from "../../styles/globalStyles";
import {CustomText, CustomTextMedium} from "../../highordercomponents";
import {userSequenceStyles} from "../../styles/userSequenceStyle";
import {UploadImageCard} from "../index";
import {useSelector} from "react-redux";

const UserFeed = ({ navigation }) => {

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
  );
};

export default UserFeed;
