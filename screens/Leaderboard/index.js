import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import {useEffect} from "react";
import {SafeAreaView, View, Text, Pressable} from "react-native";
import { leaderStyles as styles } from "../../styles/leaderStyles";
import { useDispatch, useSelector } from "react-redux";
import {
  GET_LEADERBOARD_DATA_USERS,
  GET_LEADERBOARD_DATA_ORGANIZATIONS,
} from "../../store/actionsName";
import Users from "./Users";
import Organizations from "./Organizations";
import Config from "react-native-config";
import Loading from "../../components/Loading";
import { fetchHandler } from "../../helper/helper";
import FocusAwareStatusBar from "../../components/FocusAwareStatusBar";
import {useTranslation} from "react-i18next";
import {HowToScore} from "../../assets/svg/illustrations";
import {CustomText} from "../../highordercomponents";
import {useNavigation} from "@react-navigation/native";
import {Routes} from "../../navigator/Routes";

const Tab = createMaterialTopTabNavigator();

const Leaderboard = () => {
  const dispatch = useDispatch();
  const {t} = useTranslation("leaderboard");
  const navigation = useNavigation();

  const {users, organizations} = useSelector((state) => state.leaderboardReducer);
  const auth = useSelector((state) => state.getTokenReducer);

  const goToScoreInfo = () => navigation.navigate(Routes.stackNavigator, {screen: Routes.howToScore})

  const fetchUsersLeaderboard = () => {
    fetchHandler({ url: `${Config.SERVICE_URL}/api/leaderboard` })
      .then((res) => {
        dispatch({type: GET_LEADERBOARD_DATA_USERS, payload: res.data.leaderboard});
      })
      .catch(() => {
        toast.show(t("fetch_error"), {type: "warning"});
      });
  };

  const fetchOrganizationsLeaderboard = () => {
    fetchHandler({ url: `${Config.SERVICE_URL}/api/leaderboard-organization` })
      .then((res) => {
        dispatch({
          type: GET_LEADERBOARD_DATA_ORGANIZATIONS,
          payload: res.data.leaderboard,
        });
      })
      .catch(() => {
        toast.show(t("fetch_error"), {type: "warning"});
      });
  };

  useEffect(() => {
    fetchUsersLeaderboard();
    fetchOrganizationsLeaderboard();
    return () => {
      dispatch({ type: GET_LEADERBOARD_DATA_USERS, payload: null });
      dispatch({ type: GET_LEADERBOARD_DATA_ORGANIZATIONS, payload: null });
    };
  }, [auth]);

  if (!users || !organizations) return <Loading />;

  return (
    <SafeAreaView style={styles.base}>
      <FocusAwareStatusBar barStyle="dark-content" backgroundColor={"white"} />
      <View style={styles.container}>
        <View style={{alignItems: "center"}}>
          <Text style={styles.headerTitle}>{t("title")}</Text>

          <Pressable style={styles.howToScore} onPress={goToScoreInfo}>
            <CustomText style={styles.howToScoreText}>{t("how_to_score")}</CustomText>
            <HowToScore/>
          </Pressable>
        </View>
        <Text style={styles.headerSubTitle}>
          {t("description")}
        </Text>
        <Tab.Navigator
          screenOptions={styles.screenOptionsStyles}
          initialRouteName="Users"
        >
          <Tab.Screen name={t("users")} component={Users} />
          <Tab.Screen name={t("organizations")} component={Organizations} />
        </Tab.Navigator>
      </View>
    </SafeAreaView>
  );
};

export default Leaderboard;
