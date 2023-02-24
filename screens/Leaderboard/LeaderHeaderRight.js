import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { HowToScore } from "../../assets/svg/illustrations";
import { CustomText } from "../../highordercomponents";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { Routes } from "../../navigator/Routes";
import { RFValue } from "react-native-responsive-fontsize";

const LeaderHeaderRight = () => {
  const { t } = useTranslation("leaderboard");

  const navigation = useNavigation();

  const goToScoreInfo = () =>
    navigation.navigate(Routes.stackNavigator, { screen: Routes.howToScore });

  return (
    <Pressable style={styles.howToScore} onPress={goToScoreInfo}>
      <CustomText style={styles.howToScoreText}>{t("how_to_score")}</CustomText>
      <HowToScore />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  howToScore: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: RFValue(10),

  },
  howToScoreText: {
    color: "#4A90E2",
    fontSize: RFValue(10),
    fontFamily: "Poppins-Medium",
    textAlign: "right",
    lineHeight: RFValue(13),
    marginRight: RFValue(3),
    marginTop: RFValue(4),
  },
});

export default LeaderHeaderRight;
