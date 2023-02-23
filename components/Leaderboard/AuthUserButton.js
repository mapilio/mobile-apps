import { View, Text } from "react-native";
import { leaderStyles as styles } from "../../styles/leaderStyles";
import FallbackImage from "./FallbackImage";
import UserProfileImage from "./UserProfileImage";
import Rank from "./Rank";
import { RFValue } from "react-native-responsive-fontsize";
import { CustomTextBold, CustomText } from "../../highordercomponents";
import { useTranslation } from "react-i18next";
const AuthUserButton = ({ authUser, displayName, rankIndex}) => {

  const {t} = useTranslation("leaderboard");


  return (
    <View style={styles.authUserListItem}>
      <Rank rankIndex={rankIndex} isAuthUser={true} />
      {authUser.user_profile_photo ? (
        <UserProfileImage
          source={authUser.user_profile_photo}
          spinnerColor={"white"}
        />
      ) : (
        <FallbackImage displayName={displayName} />
      )}

      <Text style={styles.authUserListItem.displayName}>{displayName}</Text>
      <View style={{ flex: 1, flexDirection:"column",alignItems:"flex-end" }}>
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
    </View>
  );
};

export default AuthUserButton;
