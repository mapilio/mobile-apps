import {ActivityIndicator, Image, TouchableOpacity, View} from "react-native";
import {Profile} from "../../assets/svg/illustrations";
import {profileButtonStyles as styles} from "../../styles/profileButtonStyles";
import {useSelector} from "react-redux";
import React, {useState} from "react";
import { RFValue } from "react-native-responsive-fontsize";

const UserImage = ({ userInformation }) => {
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <View>
      {imageLoading && (
        <ActivityIndicator style={styles.indicator} color={"#FFF"} />
      )}

      <Image
        style={{ ...styles.profileImage }}
        source={{
          uri: userInformation?.user_profile_photo,
          width: RFValue(55),
          height: RFValue(55),
          cache: "force-cache",
        }}
        onLoadEnd={() => setImageLoading(false)}
      />
    </View>
  );
};

const ProfileButton = ({ onPress }) => {
  const { userInformation } = useSelector((state) => state.getTokenReducer);

  return (
    <TouchableOpacity
      style={{ ...styles.profileButton }}
      onPress={onPress}
    >
      <View style={styles.profileIcon}>
        {userInformation ? (
          <UserImage userInformation={userInformation} />
        ) : (
          <Profile width={RFValue(24)} height={RFValue(24)} fill="#FFFFFF" />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ProfileButton;
