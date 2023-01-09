import React, {useState} from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { CustomText, CustomTextBold } from "../highordercomponents";
import { Routes } from "../navigator/Routes";
import { userFeedStyles } from "../styles/userProfileStyle";
import moment from "moment";
import { useSelector } from "react-redux";
import Config from "react-native-config";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import {RFValue} from "react-native-responsive-fontsize";
import {useTranslation} from "react-i18next";

const ProfileFeed = ({navigation, data, selectedOrganization, organizationKey}) => {
  const {t} = useTranslation("profile");
  const { userInformation } = useSelector((state) => state.getTokenReducer);
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={userFeedStyles.feedContainer}
      onPress={() => {
        navigation.navigate(Routes.profileSequence, {
          id: data.sequence_uuid,
          user_id: userInformation.id,
          isIndividual: selectedOrganization,
          org_id: organizationKey,
        });
      }}
    >
      <View style={userFeedStyles.viewStyle}>
        <CustomTextBold style={userFeedStyles.dateStyle}>
          {moment(data.created_at).format("DD-MM-YYYY")}
        </CustomTextBold>
        <CustomText style={userFeedStyles.descriptionStyle}>
          {data.total_images} {t("images")}
        </CustomText>
        <CustomText style={userFeedStyles.statusStyle}>
          {t(data.last_status)}
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
          source={{uri: `${Config.IMAGE_API}/${data.img_code}/${data.cover_photo}/480`}}
          onLoadEnd={() => setImageLoading(false)}
        />
      </View>
    </TouchableOpacity>
  );
};

export default ProfileFeed;
