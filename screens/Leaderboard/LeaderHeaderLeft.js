import Lottie from "lottie-react-native";
import { Pressable, StyleSheet } from "react-native";
import { CustomText } from "../../highordercomponents";
import { RFValue } from "react-native-responsive-fontsize";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { Routes } from "../../navigator/Routes";

const LeaderHeaderLeft = () => {
  const { t } = useTranslation("leaderboard");

  const navigation = useNavigation();

  const goToAward = () =>
    navigation.navigate(Routes.stackNavigator, { screen: Routes.award });

  return (
    <Pressable style={styles.award} onPress={goToAward}>
      <Lottie
        source={require("../../assets/animations/gift.json")}
        style={styles.award.gift}
        autoPlay
        loop
      />
      <CustomText style={styles.award.text}>{t("join_the_race")}</CustomText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  award: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gift: {
      width: RFValue(80),
      zIndex: -1,
      position: "absolute",
      marginLeft: RFValue(2),
    },
    text: {
      fontSize: RFValue(10),
      fontFamily: "Poppins-Medium",
      lineHeight: RFValue(13),
      color: "#191919",
      transform: [
        {translate: [RFValue(35), RFValue(4)]}
      ]
    },
  },
});

export default LeaderHeaderLeft;
