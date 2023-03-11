import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import {useEffect} from "react";
import {SafeAreaView, View, Text} from "react-native";
import { leaderStyles as styles } from "../../styles/leaderStyles";
import { useDispatch, useSelector } from "react-redux";
import Users from "./Users";
import FocusAwareStatusBar from "../../components/FocusAwareStatusBar";
import {useTranslation, Trans} from "react-i18next";
import { RFValue } from "react-native-responsive-fontsize";
import AwardModal from "./AwardModal";
import SkeletonLoading from "../../components/Leaderboard/SkeletonLoading";
import { fetchLeaderUsers,resetLeaderboard   } from "../../store/actions/leaderboard";
import { CustomText, CustomTextBold, CustomTextMedium } from "../../highordercomponents";
import ChallangeUsers from "./ChallangeUsers";

const Tab = createMaterialTopTabNavigator();

const Leaderboard = () => {
  const {t} = useTranslation("leaderboard");
  const dispatch = useDispatch();

  const {users, challangeUsers} = useSelector((state) => state.leaderboardReducer);
  const auth = useSelector((state) => state.getTokenReducer);


  useEffect(() => {
    dispatch(fetchLeaderUsers());
    dispatch(fetchLeaderUsers("01-03-2023", "31-05-2023"))
    
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
          <Trans i18nKey="leaderboard:description" components={[<CustomTextMedium style={{color:"#808080"}} />]}
 />
        </Text>
        <Tab.Navigator
          style={{ paddingTop: RFValue(10) }}
          screenOptions={({ route }) => ({
            tabBarLabel: ({ focused }) => (
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: focused ? "#191919" : "#666666",
                    fontFamily: focused ? "Poppins-SemiBold" : "Poppins",
                    fontSize: RFValue(14),
                  }}
                >
                  {route.name}
                </Text>
                {route.name === t("challange") && (
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
            tabBarAndroidRipple: false,
            tabBarStyle: {
              backgroundColor: "#fff",
              elevation: 0,
            },
            tabBarPressColor: "transparent",
          })}
          initialRouteName={t("challange")}
        >
          <Tab.Screen
            name={t("challange")}
            component={!challangeUsers ? SkeletonLoading : ChallangeUsers}
          />
          <Tab.Screen
            name={t("all_time")}
            component={!users ? SkeletonLoading : Users}
          />
        </Tab.Navigator>
      </View>

      <AwardModal />
    </SafeAreaView>
  );
};


export default Leaderboard;
