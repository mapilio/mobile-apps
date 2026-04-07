import React, { useEffect } from 'react';
import { Image, TouchableOpacity, View } from "react-native";
import { CustomText, CustomTextBold } from "../highordercomponents";
import { Routes } from "../navigator/Routes";
import { userFeedStyles } from "../styles/userProfileStyle";
import {useDispatch} from "react-redux";
import { ACTIVE_SEQUENCE, UPDATE_SELECTED_IMAGES } from "../store/actionsName";
import { dateConvert } from "../helper/helper";
import {DocumentDirectoryPath} from "../util/fs";
import {useTranslation} from "react-i18next";

const UserFeed = ({navigation, data}) => {
  const dispatch = useDispatch();
  const {t} = useTranslation("upload");
  const exif = JSON.parse(data.exif)
  const [sdCardPath, setSdCardPath] = React.useState(null);
  const path = data.default_storage_path === 'external' ? sdCardPath : DocumentDirectoryPath

  // useEffect(() => {
  //   if (data.default_storage_path === 'external') {
  //     RNFS.getAllExternalFilesDirs().then((dirs) => {
  //       setSdCardPath(dirs[1])
  //     })
  //   }
  // }, []);

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
            exif.DateTime || exif.DateTimeOriginal || exif.DateTimeDigitized || exif["{TIFF}"].DateTime,
            "DD MM YYYY - H:mm"
          )}
        </CustomTextBold>
        <CustomText style={userFeedStyles.descriptionStyle}>
          {t("image_count", {count: data.count})}
        </CustomText>
      </View>
      <View>
        <Image
          style={userFeedStyles.imageStyle}
          source={{uri: `file://${path + `/${data.sequence_uuid}/${data.filename}.jpeg`}`}}
        />
      </View>
    </TouchableOpacity>
  );
};

export default UserFeed;
