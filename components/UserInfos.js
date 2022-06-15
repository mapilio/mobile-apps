import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, View } from "react-native";
import {
  CustomText,
  CustomTextBold,
  CustomTextMedium,
} from "../highordercomponents";
import { userInfoStyles } from "../styles/userProfileStyle";
import { fetchHandler, kFormatter } from "../helper/helper";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { RFValue } from "react-native-responsive-fontsize";
import { SERVICE_URL } from "@env";
import { toastMessage } from "../helper/alerts";

const UserInfos = ({ isOrganization, selectedItem }) => {
  const [avatarLoading, setAvatarLoading] = useState(true);
  const [avatarError, setAvatarError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileInfos, setProfileInfos] = useState({});

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

  const setError = () => {
    setAvatarError(true);
  };

  useEffect(() => {
    fetchHandler({
      url: `${SERVICE_URL}/api/function/user_profile/profile/getProfile`,
    })
      .then((res) => {
        setLoading(false);
        setProfileInfos(res.data[0]);
      })
      .catch(() => {
        setLoading(false);
        toastMessage.warning(
          "There was a problem fetching your information. Please try again."
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
        }}
        source={{
          uri: isOrganization
            ? profileInfos.user_profile_photo
            : selectedItem.organization_profile_picture,
        }}
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
            {isOrganization
              ? profileInfos.username
              : selectedItem.organization_username}
          </CustomTextMedium>
          <CustomText style={userInfoStyles.accountType}>
            {isOrganization ? " Individual Account" : "Organization account"}
          </CustomText>
        </View>
        <View style={userInfoStyles.infoGrid}>
          {infoGenerate(
            kFormatter(
              isOrganization ? profileInfos.sequences : selectedItem.sequences
            ),
            "sequences"
          )}
          {infoGenerate(
            kFormatter(
              isOrganization ? profileInfos.photos : selectedItem.photos
            ),
            "photos"
          )}
          {/* {infoGenerate(kFormatter(profileInfos.meters), "meters")} */}
        </View>
      </View>
    </View>
  );
};

export default UserInfos;
