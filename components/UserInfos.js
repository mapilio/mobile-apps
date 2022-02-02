import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, Platform, View } from "react-native";
import {
  CustomText,
  CustomTextBold,
  CustomTextMedium,
} from "../highordercomponents";
import { userInfoStyles } from "../styles/userProfileStyle";
import { fetchHandler, kFormatter, toastGenerator } from "../helper/helper";
import { warningAlertStyles } from "../styles/alertStyles";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { RFValue } from "react-native-responsive-fontsize";

const UserInfos = () => {
  const [avatarLoading, setAvatarLoading] = useState(true);
  const [avatarError, setAvatarError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileInfos, setProfileInfos] = useState({});
  const showImage = avatarError
    ? { uri: profileInfos.user_profile_photo }
    : require("../assets/images/default_avatar.png");

  const infoGenerate = (value, subtitle) => {
    return (
      <View style={userInfoStyles.infoContainer}>
        <CustomTextBold style={userInfoStyles.infoValue}>
          {value}
        </CustomTextBold>
        <CustomTextMedium style={userInfoStyles.infoTitle}>
          {subtitle}
        </CustomTextMedium>
      </View>
    );
  };

  const finishLoad = () => {
    setAvatarLoading(false);
  };

  const setError = () => {
    setAvatarError(true);
  };

  const loadIOS = () => {
    if (Platform.OS === "ios") {
      setAvatarLoading(false);
    }
  };

  useEffect(() => {
    fetchHandler({
      url: `${process.env.API_URL}/api/function/user_profile/profile/getProfile`,
    })
      .then((res) => {
        setLoading(false);
        setProfileInfos(res.data[0]);
      })
      .catch((err) => {
        setLoading(false);
        toastGenerator(
          "There was a problem fetching your information. Please try again.",
          `${result.type}`,
          require("../assets/images/Warning.png"),
          warningAlertStyles.alertContainer,
          warningAlertStyles.alertTitle,
          warningAlertStyles.alertImage,
          3000
        );
      });
  }, []);

  return loading ? (
    <SkeletonPlaceholder>
      <View style={userInfoStyles.profileContainer}>
        <View style={userInfoStyles.imageStyle} />
        <View style={{ flexDirection: "column" }}>
          <View
            style={{
              borderRadius: 4,
              flexDirection: "column",
              marginTop: RFValue(10),
            }}
          >
            <View
              style={{
                borderRadius: 4,
                width: RFValue(120),
                height: RFValue(10),
              }}
            />
            <View
              style={{
                borderRadius: 4,
                width: RFValue(150),
                height: RFValue(10),
                marginTop: RFValue(10),
              }}
            />
          </View>
          <View
            style={{
              borderRadius: 4,
              flexDirection: "row",
              marginTop: RFValue(10),
            }}
          >
            <View style={{ flexDirection: "column", marginRight: RFValue(16) }}>
              <View
                style={{
                  borderRadius: 4,
                  width: RFValue(40),
                  height: RFValue(10),
                }}
              />
              <View
                style={{
                  borderRadius: 4,
                  marginTop: RFValue(8),
                  width: RFValue(55),
                  height: RFValue(15),
                }}
              />
            </View>
            <View style={{ flexDirection: "column", marginRight: RFValue(16) }}>
              <View
                style={{
                  borderRadius: 4,
                  width: RFValue(40),
                  height: RFValue(10),
                }}
              />
              <View
                style={{
                  borderRadius: 4,
                  marginTop: RFValue(4),
                  width: RFValue(55),
                  height: RFValue(15),
                }}
              />
            </View>
            <View style={{ flexDirection: "column", marginRight: RFValue(16) }}>
              <View
                style={{
                  borderRadius: 4,
                  width: RFValue(40),
                  height: RFValue(10),
                }}
              />
              <View
                style={{
                  borderRadius: 4,
                  marginTop: RFValue(8),
                  width: RFValue(55),
                  height: RFValue(15),
                }}
              />
            </View>
          </View>
        </View>
      </View>
    </SkeletonPlaceholder>
  ) : (
    <View style={userInfoStyles.profileContainer}>
      <Image
        style={{
          ...userInfoStyles.imageStyle,
          display: Platform.OS === "android" && avatarLoading ? "none" : "flex",
        }}
        source={showImage}
        onLoadEnd={finishLoad}
        onError={setError}
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
            {profileInfos.username}
          </CustomTextMedium>
          <CustomText style={userInfoStyles.accountType}>
            Individual Account
          </CustomText>
        </View>
        <View style={userInfoStyles.infoGrid}>
          {infoGenerate(kFormatter(profileInfos.sequences), "sequences")}
          {infoGenerate(kFormatter(profileInfos.photos), "photos")}
          {infoGenerate(kFormatter(profileInfos.meters), "meters")}
        </View>
      </View>
    </View>
  );
};

export default UserInfos;
