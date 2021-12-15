import React from "react";
import {View} from "react-native";
import {CustomText, CustomTextMedium} from "../highordercomponents";
import {globalStyles} from "../styles/globalStyles";
import {List} from "../components/Uploads";
import {userUploadStyles} from "../styles/userUploadStyle";

const UserUpload = ({navigation}) => {
  return (
    <View>
      <View style={userUploadStyles.container}>
        <CustomTextMedium style={globalStyles.screenTitle}>
          Upload Photos
        </CustomTextMedium>
        <CustomText style={globalStyles.screenDescription}>
          You can upload images from here.
        </CustomText>
      </View>
      <List navigation={navigation}/>
    </View>
  );
};

export default UserUpload;
