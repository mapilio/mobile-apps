import React, {useState} from "react";
import {ActivityIndicator, Image, View} from "react-native";
import {CustomText, CustomTextBold, CustomTextMedium} from "../highordercomponents";
import {userInfoStyles} from "../styles/userProfileStyle";
import {kFormatter} from "../helper/helper";
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";

const UserInfos = ({ isOrganization, selectedItem }) => {
  const {t} = useTranslation("profile");
  const {userInformation} = useSelector((state) => state.getTokenReducer);
  const [avatarLoading, setAvatarLoading] = useState(true);

  const infoGenerate = (value, subtitle) => {
    return (
      <View style={userInfoStyles.infoContainer}>
        <CustomTextBold style={userInfoStyles.infoValue} lineCount={1}>
          {value}
        </CustomTextBold>
        <CustomTextMedium style={userInfoStyles.infoTitle} lineCount={1}>
          {subtitle}
        </CustomTextMedium>
      </View>
    );
  };

  const finishLoad = () => {
    setAvatarLoading(false);
  };

  if (!userInformation) return false;

  return (
    <View style={userInfoStyles.profileContainer}>
      <Image
        style={{...userInfoStyles.imageStyle}}
        source={{
          uri: isOrganization ? userInformation.user_profile_photo : selectedItem.organization_profile_picture,
        }}
        onLoadEnd={finishLoad}
      />
      {avatarLoading && (
        <ActivityIndicator
          color={"#AFAFAF"}
          style={userInfoStyles.indicatorStyle}
        />
      )}
      <View style={userInfoStyles.infoContainer}>
        <View>
          <CustomTextMedium style={userInfoStyles.username}>
            {isOrganization ? userInformation.username : selectedItem.organization_username}
          </CustomTextMedium>
          <CustomText style={userInfoStyles.accountType}>
            {isOrganization ? t("individual_account") : t("organization_account")}
          </CustomText>
        </View>
        <View style={userInfoStyles.infoGrid}>
          {infoGenerate(
            kFormatter(isOrganization ? userInformation.sequences : selectedItem.sequences),
            t("sequences")
          )}
          {infoGenerate(
            kFormatter(isOrganization ? userInformation.photos : selectedItem.photos),
            t("photos")
          )}
          {/* {infoGenerate(kFormatter(userInformation.meters), "meters")} */}
        </View>
      </View>
    </View>
  );
};

export default UserInfos;
