import React from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { CustomText, CustomTextBold } from "../highordercomponents";
import { Routes } from "../navigator/Routes";
import { userFeedStyles } from "../styles/userProfileStyle";

const UserFeed = ({ navigation }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={userFeedStyles.feedContainer}
      onPress={() => navigation.navigate(Routes.sequences)}
    >
      <View style={userFeedStyles.viewStyle}>
        <CustomTextBold style={userFeedStyles.dateStyle}>
          Aug 14, 2020 - 15:00
        </CustomTextBold>
        <CustomText style={userFeedStyles.descriptionStyle}>
          Your 2 requested audits have been approved.Your 2 requested audits
          have been approved.Your 2 requested audits have been approved.
        </CustomText>
      </View>
      <View>
        <Image
          source={require("../assets/images/car.png")}
          style={userFeedStyles.imageStyle}
        />
      </View>
    </TouchableOpacity>
  );
};

export default UserFeed;
