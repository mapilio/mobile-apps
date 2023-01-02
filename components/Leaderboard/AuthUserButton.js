import { View, Text, Image } from "react-native";
import { leaderStyles as styles } from "../../styles/leaderStyles";
import FallbackImage from "./FallbackImage";
import UserProfileImage from "./UserProfileImage";

const AuthUserButton = ({ authUser, displayName, rankIndex }) => {
  return (
    <View style={[styles.authUserListItem]}>
      <Text style={styles.authUserListItem.rank.text}>
        {"#" + (rankIndex + 1)}
      </Text>
      {authUser.user_profile_photo ? (
        <UserProfileImage
          source={authUser.user_profile_photo}
          spinnerColor={"white"}
        />
      ) : (
        <FallbackImage displayName={displayName} />
      )}

      <Text style={styles.authUserListItem.displayName}>{displayName}</Text>
    </View>
  );
};

export default AuthUserButton;
