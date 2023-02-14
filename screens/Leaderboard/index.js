import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import {useEffect} from "react";
import {SafeAreaView, View, Text, Pressable} from "react-native";
import { leaderStyles as styles } from "../../styles/leaderStyles";
import { useDispatch, useSelector } from "react-redux";
import Users from "./Users";
import Organizations from "./Organizations";
import FocusAwareStatusBar from "../../components/FocusAwareStatusBar";
import {useTranslation} from "react-i18next";
import {HowToScore} from "../../assets/svg/illustrations";
import {CustomText} from "../../highordercomponents";
import {useNavigation} from "@react-navigation/native";
import {Routes} from "../../navigator/Routes";
import Lottie from "lottie-react-native";
import AwardModal from "./AwardModal";
import SkeletonLoading from "../../components/Leaderboard/SkeletonLoading";
import { fetchLeaderUsers, fetchLeaderOrganizations,resetLeaderboard   } from "../../store/actions/leaderboard";

const Tab = createMaterialTopTabNavigator();

const Leaderboard = () => {
  const {t} = useTranslation("leaderboard");
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const {users, organizations} = useSelector((state) => state.leaderboardReducer);
  const auth = useSelector((state) => state.getTokenReducer);

  const goToScoreInfo = () => navigation.navigate(Routes.stackNavigator, {screen: Routes.howToScore})
  const goToAward = () => navigation.navigate(Routes.stackNavigator, {screen: Routes.award})

  useEffect(() => {
    dispatch(fetchLeaderUsers());
    dispatch(fetchLeaderOrganizations());
    
    return () => {
      dispatch(resetLeaderboard());
    };
  }, [auth]);


  return (
    <SafeAreaView style={styles.base}>
      <FocusAwareStatusBar translucent={true} barStyle="dark-content" backgroundColor={"transparent"} />
      <View style={styles.container}>
        <View style={{flexDirection: 'row', alignItems: "center", justifyContent: 'space-between'}}>

          <Pressable style={styles.award} onPress={goToAward}>
            <Lottie
              source={require("../../assets/animations/gift.json")}
              style={styles.award.gift}
              autoPlay
              loop
            />
            <CustomText style={styles.award.text}>{t("join_the_race")}</CustomText>
          </Pressable>

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
          <Tab.Screen name={t("users")} component={!users ? SkeletonLoading : Users } />
          <Tab.Screen name={t("organizations")} component={!organizations ? SkeletonLoading : Organizations} />
        </Tab.Navigator>
      </View>

      <AwardModal />
    </SafeAreaView>
  );
};

export default Leaderboard;
