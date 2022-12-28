import { Image, Text, View } from "react-native";
import { leaderStyles as styles } from "../../styles/leaderStyles";
import FallbackImage from "./FallbackImage";
import CrownIcon from "../../assets/svg/illustrations/CorwnIcon";
import React from "react";
import AuthUserButton from "./AuthUserButton";

const renderItem = ({ item, index }, authUserIndex, screenType) => {
  const isAuthUser = index === authUserIndex;

  const displayName =
    screenType === "users" ? item.display_name : item.organization_name;

  const rankStyle = isAuthUser
    ? styles.authUserListItem.rank.text
    : styles.listItem.rank.text;

  const displayNameStyle = isAuthUser
    ? styles.authUserListItem.displayName
    : styles.listItem.displayName;

  const baseStyle = isAuthUser ? styles.authUserListItem : styles.listItem;

  const Rank = ({ rankIndex }) => {
    switch (rankIndex) {
      case 0:
        return <CrownIcon />;
      case 1:
      case 2:
        return (
          <View style={styles.listItem.rank.rankers}>
            <Text style={styles.listItem.rank.rankers.text}>
              {rankIndex + 1}
            </Text>
          </View>
        );
      default:
        return (
          <Text style={rankStyle}>
            {"#"}
            {rankIndex + 1}
          </Text>
        );
    }
  };

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
      <Rank rankIndex={index} />
      {item.user_profile_photo ? (
        <Image
          source={{
            uri: item.user_profile_photo,
            width: 42,
            height: 42,
            cache: "force-cache",
          }}
          style={styles.profilePhoto}
        />
      ) : (
        <FallbackImage displayName={displayName} />
      )}
      <Text style={displayNameStyle}>{displayName}</Text>
    </View>
  );
};

export default renderItem;
