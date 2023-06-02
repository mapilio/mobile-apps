import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useEffect, useState } from "react";
import { SafeAreaView, View, Text } from "react-native";
import { leaderStyles as styles } from "../../styles/leaderStyles";
import { useDispatch, useSelector } from "react-redux";
import Users from "./Users";
import FocusAwareStatusBar from "../../components/FocusAwareStatusBar";
import { useTranslation, Trans } from "react-i18next";
import { RFValue } from "react-native-responsive-fontsize";
import AwardModal from "./AwardModal";
import SkeletonLoading from "../../components/Leaderboard/SkeletonLoading";
import {
  fetchLeaderUsers,
  fetchLeaderboardWinners,
  resetLeaderboard,
} from "../../store/actions/leaderboard";
import { CustomText, CustomTextMedium } from "../../highordercomponents";
import ChallangeUsers from "./ChallangeUsers";

const Tab = createMaterialTopTabNavigator();

const Leaderboard = () => {
  const { t } = useTranslation("leaderboard");
  const dispatch = useDispatch();

  const { users, challangeUsers } = useSelector(
    (state) => state.leaderboardReducer
  );
  const auth = useSelector((state) => state.getTokenReducer);
  const [isChallange, setIsChallange] = useState(true);

  useEffect(() => {
    dispatch(fetchLeaderUsers());
    dispatch(fetchLeaderUsers("01-03-2023", "31-05-2023"));
    dispatch(fetchLeaderboardWinners("01-03-2023", "31-05-2023"));

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
              i18nKey="leaderboard:challenge_description"
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
          initialRouteName={"challenge"}
        >
          <Tab.Screen
            name={"challenge"}
            component={!challangeUsers ? SkeletonLoading : ChallangeUsers}
          />
          <Tab.Screen
            name={"all_time"}
            component={!users ? SkeletonLoading : Users}
          />
        </Tab.Navigator>
      </View>

      <AwardModal />
    </SafeAreaView>
  );
};

export default Leaderboard;
