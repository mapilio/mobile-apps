import React, {useState} from "react";
import {Image, TouchableOpacity, View} from "react-native";
import {CustomText, CustomTextBold} from "../highordercomponents";
import {userFeedStyles} from "../styles/userProfileStyle";
import moment from "moment";
import Config from "react-native-config";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import {RFValue} from "react-native-responsive-fontsize";
import {useTranslation} from "react-i18next";

const ProfileFeed = ({data, onPress}) => {
  const {t} = useTranslation("profile");
  const [imageLoading, setImageLoading] = useState(true);
  const {created_at, total_images, last_status, img_code, cover_photo} = data;

  return (
    <TouchableOpacity activeOpacity={0.7} style={userFeedStyles.feedContainer} onPress={() => onPress()}>
      <View style={userFeedStyles.viewStyle}>
        <CustomTextBold style={userFeedStyles.dateStyle}>
          {moment(created_at).format("DD-MM-YYYY")}
        </CustomTextBold>
        <CustomText style={userFeedStyles.descriptionStyle}>
          {total_images} {t("images")}
        </CustomText>
        <CustomText style={userFeedStyles.statusStyle}>
          {t(last_status)}
        </CustomText>
      </View>
      <View style={{height: RFValue(70)}}>
        {
          imageLoading && (
            <SkeletonPlaceholder speed={1000} borderRadius={4}>
              <SkeletonPlaceholder.Item width={RFValue(130)} height={RFValue(70)} />
            </SkeletonPlaceholder>
          )
        }
        <Image
          style={userFeedStyles.imageStyle}
          source={{uri: `${Config.IMAGE_API}/${img_code}/${cover_photo}/480`}}
          onLoadEnd={() => setImageLoading(false)}
        />
      </View>
    </TouchableOpacity>
  );
};

export default ProfileFeed;
