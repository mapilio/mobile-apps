import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Animated,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useTranslation } from "react-i18next";
import FallbackImage from "./FallbackImage";
import UserProfileImage from "./UserProfileImage";
import Rank from "./Rank";
import { CustomText, CustomTextBold } from "../../highordercomponents";
import { CameraFilledIcon, RoadIcon } from "../../assets/svg/illustrations";

const ListItem = ({
  baseStyle,
  isAuthUser,
  index,
  displayName,
  displayNameStyle,
  item,
}) => {
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
    <Animated.View
      style={{
        ...baseStyle,
        height,
        backgroundColor: !expanded ? "white" : "#F9F9F9",
      }}
    >
      <TouchableOpacity
        style={styles.button}
        onPress={() => setExpanded(!expanded)}
      >
        {!expanded && <Rank rankIndex={index} isAuthUser={isAuthUser} />}
        {item.user_profile_photo ? (
          <UserProfileImage source={item.user_profile_photo} />
        ) : (
          <FallbackImage displayName={displayName} />
        )}
        <CustomText
          style={{
            ...displayNameStyle,
            color: expanded ? "#333333" : "#191919",
          }}
        >
          {displayName}
        </CustomText>
        <View style={{ flex: 1 }}>
          <Text style={styles.onlyPoint}>
            {item.point || item.leaderc}
            <Text
              style={{
                color: "#191919",
                fontFamily: "Poppins",
                fontSize: 14,
              }}
            >
              {" "}
              {t("points_short")}
            </Text>
          </Text>
        </View>
      </TouchableOpacity>
      {expanded && (
        <View style={styles.bottomView}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <CameraFilledIcon fill="#808080" width={14} height={14} />
            <View style={{ width: 5 }} />
            <Text style={styles.infoTitle}>
              {t("photos")}
            </Text>
            <CustomTextBold
              style={styles.infoSubTitle}
              adjustFontSize={false}
            >
              {" "}
              {item.total_images ? item.total_images : 0}
            </CustomTextBold>
          </View>
          <View style={styles.bottomSeperator} />
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <RoadIcon fill="#808080" width={14} height={14} />
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
              {item.total_length ? item.total_length : 0} km
            </CustomTextBold>
          </View>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 60,
    width: "100%",
    flexDirection: "row",
    paddingVertical: 5,
    alignItems: "center",
  },
  onlyPoint: {
    alignSelf: "flex-end",
    fontFamily: "Poppins-SemiBold",
    fontSize: RFValue(14),
    color: "#191919",
  },
  bottomView: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
    flex: 1,
  },
  bottomSeperator: {
    width: 1,
    height: "80%",
    backgroundColor: "#DCDCDC",
    marginHorizontal: 10,
  },

  infoTitle:{
    color: "#808080", fontSize: 14, lineHeight: 20
  },
  infoSubTitle:{
    color: "#191919", fontSize: 14, lineHeight: 20
  }
});

export default ListItem;
