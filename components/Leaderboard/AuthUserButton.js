import { View, Text, Image } from "react-native";
import { leaderStyles as styles } from "../../styles/leaderStyles";
import FallbackImage from "./FallbackImage";

const AuthUserButton = ({ authUser, displayName, rankIndex }) => {
  return (
    <View style={[styles.authUserListItem]}>
      <Text style={styles.authUserListItem.rank.text}>
        {"#" + (rankIndex + 1)}
      </Text>
      {authUser.user_profile_photo ? (
        <Image
          source={{
            uri: authUser.user_profile_photo,
            width: 42,
            height: 42,
            cache: "force-cache",
          }}
          style={styles.profilePhoto}
        />
      ) : (
        <FallbackImage displayName={displayName} />
      )}

      <Text style={styles.authUserListItem.displayName}>{displayName}</Text>
    </View>
  );
};

export default AuthUserButton;
