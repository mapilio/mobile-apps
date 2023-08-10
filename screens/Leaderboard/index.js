import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useEffect, useState } from "react";
import { SafeAreaView, View, Text } from "react-native";
import { leaderStyles as styles } from "../../styles/leaderStyles";
import { useDispatch, useSelector } from "react-redux";
import FocusAwareStatusBar from "../../components/FocusAwareStatusBar";
import { useTranslation, Trans } from "react-i18next";
import { RFValue } from "react-native-responsive-fontsize";
import SkeletonLoading from "../../components/Leaderboard/SkeletonLoading";
import {
  fetchLeaderUsers,
  fetchLeaderUsersMonth,
  fetchLeaderboardWinners,
  fetchLeaderUsersWeek,
  resetLeaderboard,
} from "../../store/actions/leaderboard";
import { CustomText, CustomTextMedium } from "../../highordercomponents";
import ChallangeUsers from "./ChallangeUsers";
import Board from "../../components/Leaderboard/Board";
import i18next from "i18next";

const Tab = createMaterialTopTabNavigator();

const Leaderboard = () => {
  const { t } = useTranslation("leaderboard");

  const dispatch = useDispatch();

  const { challengeUsers } = useSelector(
    (state) => state.leaderboardReducer
  );

  const auth = useSelector((state) => state.getTokenReducer);
  const { config:{isChallengeOpen, challengeDescEN, challengeDescTR, challengeDates}} = useSelector((state) => state.generalReducer);
  const [isChallange, setIsChallange] = useState(true);


  useEffect(() => {
    dispatch(fetchLeaderUsers());
    dispatch(fetchLeaderUsersWeek());
    dispatch(fetchLeaderUsersMonth());
    dispatch(fetchLeaderUsers(challengeDates[0], challengeDates[1], true));
    dispatch(fetchLeaderboardWinners(challengeDates[0], challengeDates[1]));
    return () => {
      dispatch(resetLeaderboard());
    };
  }, [auth]);

  return (
    <SafeAreaView style={styles.base}>
      <FocusAwareStatusBar
        translucent={true}
        barStyle="dark-content"
        backgroundColor={"transparent"}
      />
      <View style={styles.container}>
        <Text style={styles.headerSubTitle}>
          {isChallange ? (
            <Trans
              defaults={i18next.language === "en" ? challengeDescEN : challengeDescTR}
              components={[<CustomTextMedium style={{ color: "#808080" }} />]}
            />
          ) : (
            <Trans i18nKey="leaderboard:alltime_description" />
          )}
        </Text>
        <Tab.Navigator
          style={{ paddingTop: RFValue(10) }}
          screenListeners={({ route }) => ({
            focus: () => {
              if (route.name === "challenge") {
                setIsChallange(true);
              } else {
                setIsChallange(false);
              }
            },
          })}
          screenOptions={({ route }) => ({
            tabBarLabel: ({ focused }) => (
              <View style={styles.wrapper}>
                <Text
                  style={{
                    color: focused ? "#191919" : "#666666",
                    fontFamily: focused ? "Poppins-SemiBold" : "Poppins",
                    fontSize: RFValue(14),
                  }}
                >
                  {t(route.name)}
                </Text>
                {route.name === "challenge" && (
                  <View style={styles.tabBarLabel}>
                    <CustomText
                      style={{ color: "white", fontSize: RFValue(10) }}
                    >
                      {t("join")}
                    </CustomText>
                  </View>
                )}
              </View>
            ),
            ...styles.screenOptions,
          })}
          initialRouteName={isChallengeOpen ? "challenge" : "board"}
        >
           {isChallengeOpen &&  <Tab.Screen
            name={"challenge"}
            component={!challengeUsers ? SkeletonLoading : ChallangeUsers}
          />}
          <Tab.Screen
            name={"board"}
            component={Board}
            options={{
              tabBarStyle:{
                display: isChallengeOpen ? "flex" : "none"
              }
            }}
          />
        </Tab.Navigator>
      </View>

    </SafeAreaView>
  );
};

export default Leaderboard;
