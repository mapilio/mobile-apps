import { View, Text, Animated, TouchableOpacity, StyleSheet } from "react-native";
import { leaderStyles } from "../../styles/leaderStyles";
import FallbackImage from "./FallbackImage";
import UserProfileImage from "./UserProfileImage";
import Rank from "./Rank";
import { RFValue } from "react-native-responsive-fontsize";
import { CustomTextBold, CustomText } from "../../highordercomponents";
import { useTranslation } from "react-i18next";
import { useState, useRef, useEffect } from "react";
import { CameraFilledIcon, RoadIcon,ArrowLeft } from "../../assets/svg/illustrations";
import { thousandFormatter } from "../../helper/helper";

const AuthUserButton = ({ authUser, displayName, rankIndex, type }) => {
  const { t } = useTranslation("leaderboard");
  const [expanded, setExpanded] = useState(false);
  const height = useRef(new Animated.Value(60)).current;

  useEffect(() => {
    Animated.timing(height, {
      toValue: expanded ? 110 : 60,
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [expanded, height]);

  return (
    
    <Animated.View style={{...leaderStyles.authUserListItem, height}} pointerEvents={type !== "insideList" ? "none" : undefined}>
      <TouchableOpacity style={styles.button} onPress={() => setExpanded(!expanded)}>

    {!expanded &&  <Rank rankIndex={rankIndex} isAuthUser={true} /> }
      {authUser.user_profile_photo ? (
        <UserProfileImage
          source={authUser.user_profile_photo}
          spinnerColor={"white"}
        />
      ) : (
        <FallbackImage displayName={displayName} />
      )}

      <Text style={leaderStyles.authUserListItem.displayName}>{displayName}</Text>
      <View
        style={{ flex: 1, flexDirection: "column", alignItems: "flex-end" }}
      >
        <CustomTextBold
          style={{
            fontSize: RFValue(14),
            color: "white",
          }}
        >
          {authUser.point || authUser.leaderc}
        </CustomTextBold>
        <CustomText
          style={{
            color: "#CCCCCC",
            fontFamily: "Poppins",
            fontSize: RFValue(12),
          }}
        >
          {t("points")}
        </CustomText>
      </View>
    </TouchableOpacity>
    {expanded && (
        <View style={styles.bottomView}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <CameraFilledIcon fill="white" width={14} height={14} />
            <View style={{ width: 5 }} />
            <Text style={styles.infoTitle}>
              {t("photos")}
            </Text>
            <CustomTextBold
              style={styles.infoSubTitle}
              adjustFontSize={false}
            >
              {" "}
              {authUser.total_images ? thousandFormatter(authUser.total_images) : 0}
            </CustomTextBold>
          </View>
          <View style={styles.bottomSeperator} />
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <RoadIcon fill="white" width={14} height={14} />
            <View style={{ width: 5 }} />
            <CustomText
              style={styles.infoTitle}
            >
              {t("roads")}
            </CustomText>
            <CustomTextBold
              style={styles.infoSubTitle}
              adjustFontSize={false}
            >
              {" "}
              {authUser.total_length ? thousandFormatter(authUser.total_length) : 0} km
            </CustomTextBold>
           
          </View>
        </View>
      )}

    </Animated.View>

  );
};

const styles = StyleSheet.create({
  bottomView: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
    flex: 1,
    width: "100%",
  },
  button: {
    height: 60,
    width: "100%",
    flexDirection: "row",
    paddingVertical: 5,
    alignItems: "center",
  },
  infoTitle:{
    color: "white", fontSize: 14, lineHeight: 20
  },
  infoSubTitle:{
    color: "white", fontSize: 14, lineHeight: 20
  },
  bottomSeperator: {
    width: 1,
    height: "80%",
    backgroundColor: "#DCDCDC",
    marginHorizontal: 10,
  },
 
});

export default AuthUserButton;
