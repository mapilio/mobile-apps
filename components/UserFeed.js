import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { CustomText, CustomTextBold } from "../highordercomponents";
import { Routes } from "../navigator/Routes";
import { userFeedStyles } from "../styles/userProfileStyle";
import {useDispatch, useSelector} from "react-redux";
import { ACTIVE_SEQUENCE, UPDATE_SELECTED_IMAGES } from "../store/actionsName";
import { dateConvert } from "../helper/helper";
import * as FileSystem from "expo-file-system";

const UserFeed = ({ navigation, data }) => {
  const {userInformation} = useSelector((state) => state.getTokenReducer);
  const dispatch = useDispatch();

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={userFeedStyles.feedContainer}
      onPress={() => {
        dispatch({ type: ACTIVE_SEQUENCE, payload: data.sequence_uuid });
        dispatch({ type: UPDATE_SELECTED_IMAGES, payload: [] });
        navigation.reset({index: 0, routes: [{name: Routes.sequences}]})
      }}
    >
      <View style={userFeedStyles.viewStyle}>
        <CustomTextBold style={userFeedStyles.dateStyle}>
          {dateConvert(
            JSON.parse(data.exif).DateTime || JSON.parse(data.exif).DateTimeOriginal,
            "MMM D, YYYY - H:mm"
          )}
        </CustomTextBold>
        <CustomText style={userFeedStyles.descriptionStyle}>
          {data.count} images
        </CustomText>
      </View>
      <View>
        <Image
          style={userFeedStyles.imageStyle}
          source={{uri: `${FileSystem.documentDirectory + `${userInformation?.id}/${data.sequence_uuid}/${data.path.split("/").pop()}`}`}}
        />
      </View>
    </TouchableOpacity>
  );
};

export default UserFeed;
