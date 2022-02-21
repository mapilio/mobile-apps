import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { CustomText, CustomTextBold } from "../highordercomponents";
import { Routes } from "../navigator/Routes";
import { userFeedStyles } from "../styles/userProfileStyle";
import moment from "moment";
import { useSelector } from "react-redux";
import { IMAGE_API } from "@env";

const ProfileFeed = ({ navigation, data }) => {
  const { userInformation } = useSelector((state) => state.getTokenReducer);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={userFeedStyles.feedContainer}
      onPress={() => {
        console.log(data.sequence_uuid);
        navigation.navigate(Routes.profileSequence, {
          id: data.sequence_uuid,
          user_id: userInformation.id,
        });
      }}
    >
      <View style={userFeedStyles.viewStyle}>
        <CustomTextBold style={userFeedStyles.dateStyle}>
          {moment(data.created_at).format("DD-MM-YYYY")}
        </CustomTextBold>
        <CustomText style={userFeedStyles.descriptionStyle}>
          {data.total_images} images
        </CustomText>
      </View>
      <View>
        <Image
          style={userFeedStyles.imageStyle}
          source={{
            uri: `${IMAGE_API}/${data.img_code}/${data.cover_photo}/480`,
          }}
        />
      </View>
    </TouchableOpacity>
  );
};

export default ProfileFeed;
