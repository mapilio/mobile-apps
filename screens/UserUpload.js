import React from "react";
import { ScrollView, View } from "react-native";
import { UserFeed } from "../components";
import { CustomText, CustomTextMedium } from "../highordercomponents";
import { globalStyles } from "../styles/globalStyles";

const UserUpload = ({ navigation }) => {
  return (
    <ScrollView>
      <View style={globalStyles.container}>
        <CustomTextMedium style={globalStyles.screenTitle}>
          Upload Photos
        </CustomTextMedium>
        <CustomText style={globalStyles.screenDescription}>
          Lorem ipsum dolor
        </CustomText>
        <View style={globalStyles.screenTextMargin}>
          {[0, 1, 2, 3, 4, 5].map((item) => (
            <UserFeed key={item} navigation={navigation} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default UserUpload;
