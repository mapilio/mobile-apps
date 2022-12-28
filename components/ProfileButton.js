import { TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Profile } from "../assets/svg/illustrations";
import { profileButtonStyles as styles } from "../styles/profileButtonStyles";

const ProfileButton = ({ onPress }) => {
  const { top } = useSafeAreaInsets();

  return (
    <TouchableOpacity
      style={{ ...styles.profileButton, marginTop: top }}
      onPress={onPress}
    >
      <View style={styles.profileIcon}>
        <Profile width={23} height={23} fill="#FFFFFF" />
      </View>
    </TouchableOpacity>
  );
};

export default ProfileButton;
