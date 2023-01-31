import React, {useState} from "react";
import {ActivityIndicator, Image, Text, View} from "react-native";
import {CustomText, CustomTextBold} from "../highordercomponents";
import {userInfoStyles} from "../styles/userProfileStyle";
import {thousandFormatter} from "../helper/helper";
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {CameraFilledIcon, RoadIcon} from "../assets/svg/illustrations";

const UserInfos = () => {
  const {t} = useTranslation("profile");
  const {userInformation} = useSelector((state) => state.getTokenReducer);
  const [avatarLoading, setAvatarLoading] = useState(true);

  const CustomInfo = ({value, subtitle, icon}) => {
    return (
      <View>
        <CustomTextBold style={userInfoStyles.infoValue} lineCount={1}>
          {value}
        </CustomTextBold>
        <CustomText style={userInfoStyles.infoTitle} lineCount={1}>
          {icon}
          {" "}
          {t(subtitle)}
        </CustomText>
      </View>
    );
  };

  const finishLoad = () => setAvatarLoading(false);

  if (!userInformation) return false;

  return (
    <View style={userInfoStyles.profileContainer}>
      <Image
        style={{...userInfoStyles.imageStyle}}
        source={{uri: userInformation.user_profile_photo}}
        onLoadEnd={finishLoad}
      />

      {avatarLoading && <ActivityIndicator color={"#AFAFAF"} style={userInfoStyles.indicatorStyle}/>}

      <View style={userInfoStyles.infoContainer}>
        <View>
          <Text style={userInfoStyles.username}>
            {userInformation.username}
          </Text>
        </View>
        <View style={userInfoStyles.infoGrid}>
          <CustomInfo
            value={thousandFormatter(userInformation.photos)}
            subtitle={"photos"}
            icon={<CameraFilledIcon/>}
          />

          <View style={userInfoStyles.separator}/>

          <CustomInfo
            value={userInformation.meters + "km"}
            subtitle={"roads"}
            icon={<RoadIcon />}
          />

        </View>
      </View>
    </View>
  );
};

export default UserInfos;
