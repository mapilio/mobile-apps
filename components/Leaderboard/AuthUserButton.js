import { View, Text } from "react-native";
import { leaderStyles as styles } from "../../styles/leaderStyles";
import FallbackImage from "./FallbackImage";
import UserProfileImage from "./UserProfileImage";
import Rank from "./Rank";
import { RFValue } from "react-native-responsive-fontsize";

const AuthUserButton = ({ authUser, displayName, rankIndex}) => {
  return (
    <View style={styles.authUserListItem}>
      <View style={{width: RFValue(33)}}>
      <Rank rankIndex={rankIndex} isAuthUser={true} />
      </View>
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
