import {Text, View} from "react-native";
import {leaderStyles as styles} from "../../styles/leaderStyles";
import FallbackImage from "./FallbackImage";
import React from "react";
import AuthUserButton from "./AuthUserButton";
import UserProfileImage from "./UserProfileImage";
import {RFValue} from "react-native-responsive-fontsize";
import Rank from "./Rank";

const renderItem = ({ item, index }, authUserIndex, screenType) => {
  const isAuthUser = index === authUserIndex;

  const displayName =
    screenType === "users" ? item.display_name : item.organization_name;


  const displayNameStyle = isAuthUser
    ? styles.authUserListItem.displayName
    : styles.listItem.displayName;

  const baseStyle = isAuthUser ? styles.authUserListItem : styles.listItem;

  if (isAuthUser) {
    return (
      <AuthUserButton
        authUser={item}
        displayName={displayName}
        rankIndex={index}
      />
    );
  }

  return (
    <View style={baseStyle}>
      <View style={{width: RFValue(33)}}>
        <Rank rankIndex={index} isAuthUser={isAuthUser} />
      </View>
      {item.user_profile_photo ? (
        <UserProfileImage source={item.user_profile_photo} />
      ) : (
        <FallbackImage displayName={displayName} />
      )}
      <Text style={displayNameStyle}>{displayName}</Text>
    </View>
  );
};

export default renderItem;
