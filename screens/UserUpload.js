import React from "react";
import {ScrollView, View} from "react-native";
import { CustomText, CustomTextMedium } from "../highordercomponents";
import { globalStyles } from "../styles/globalStyles";
import {List} from "../components/Uploads";

const UserUpload = ({ navigation }) => {
  return (
    <ScrollView>
      <View>
        <View style={{...globalStyles.container, paddingBottom: 0}}>
          <CustomTextMedium style={globalStyles.screenTitle}>
            Upload Photos
          </CustomTextMedium>
          <CustomText style={globalStyles.screenDescription}>
            You can upload images from here.
          </CustomText>
        </View>
        <List navigation={navigation} />
      </View>
    </ScrollView>
  );
};

export default UserUpload;
