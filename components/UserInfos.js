import { useState } from "react";
import { ActivityIndicator, Image, Text, View } from "react-native";
import { CustomText, CustomTextBold } from "../highordercomponents";
import { userInfoStyles } from "../styles/userProfileStyle";
import { maxCharacterHandler, thousandFormatter } from "../helper/helper";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  CameraFilledIcon,
  RoadIcon,
} from "../assets/svg/illustrations";

const UserInfos = ({ userDetails }) => {
  const { t } = useTranslation("profile");
  const { userInformation } = useSelector((state) => state.getTokenReducer);
  const [avatarLoading, setAvatarLoading] = useState(true);

  const finishLoad = () => setAvatarLoading(false);

  const CustomInfo = ({ value, subtitle, icon }) => {
    return (
      <View>
        <CustomTextBold style={userInfoStyles.infoValue} lineCount={1}>
          {value}
        </CustomTextBold>
        <CustomText style={userInfoStyles.infoTitle} lineCount={1}>
          {icon} {t(subtitle)}
        </CustomText>
      </View>
    );
  };
  if (!userInformation) return null;

  const username = userDetails
    ? userDetails.username
    : userInformation.username;
  const photoURL = userDetails
    ? userDetails.user_profile_photo
    : userInformation.user_profile_photo;
  const photos = userDetails ? userDetails.photos : userInformation.photos;
  const roads = userDetails ? userDetails.km : userInformation.meters;

  return (
    <View style={userInfoStyles.profileContainer}>
        <Image
          style={{ ...userInfoStyles.imageStyle }}
          source={{ uri: photoURL }}
          onLoadEnd={finishLoad}
        />

      {avatarLoading && photoURL && (
        <ActivityIndicator
          color={"#AFAFAF"}
          style={userInfoStyles.indicatorStyle}
        />
      )}

      <View style={userInfoStyles.infoContainer}>
        <View>
          <Text style={userInfoStyles.username}>
            {maxCharacterHandler(username, 12)}
          </Text>
        </View>
        <View style={userInfoStyles.infoGrid}>
          <CustomInfo
            value={thousandFormatter(photos)}
            subtitle={"photos"}
            icon={<CameraFilledIcon />}
          />

          <View style={userInfoStyles.separator} />

          <CustomInfo
            value={thousandFormatter(roads)}
            subtitle={"Km"}
            icon={<RoadIcon />}
          />
        </View>
      </View>
    </View>
  );
};

export default UserInfos;
