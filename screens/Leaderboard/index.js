import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import {useEffect} from "react";
import {SafeAreaView, View, Text} from "react-native";
import { leaderStyles as styles } from "../../styles/leaderStyles";
import { useDispatch, useSelector } from "react-redux";
import Users from "./Users";
import Organizations from "./Organizations";
import FocusAwareStatusBar from "../../components/FocusAwareStatusBar";
import {useTranslation} from "react-i18next";
import { RFValue } from "react-native-responsive-fontsize";
import AwardModal from "./AwardModal";
import SkeletonLoading from "../../components/Leaderboard/SkeletonLoading";
import { fetchLeaderUsers, fetchLeaderOrganizations,resetLeaderboard   } from "../../store/actions/leaderboard";

const Tab = createMaterialTopTabNavigator();

const Leaderboard = () => {
  const {t} = useTranslation("leaderboard");
  const dispatch = useDispatch();

  const {users, organizations} = useSelector((state) => state.leaderboardReducer);
  const auth = useSelector((state) => state.getTokenReducer);


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
  
        <Text style={styles.headerSubTitle}>
          {t("description")}
        </Text>
        <Tab.Navigator
         style={{paddingTop:RFValue(10)}}
          screenOptions={({route}) => ({
            tabBarLabel: ({focused}) => (
               <View style={{flex:1, flexDirection:"row",width:"100%", justifyContent:"center"}}>
                 <Text
                  style={{
                  color: focused ? "#191919" : "#666666",
                  fontFamily: focused ? "Poppins-SemiBold" : "Poppins",
                  fontSize: RFValue(14),
                }}
              >
                {route.name}
              </Text>
               </View>
            ),
            tabBarAndroidRipple:false,
            tabBarStyle:{
              backgroundColor:"#fff",
              elevation:0,
            },
            tabBarPressColor:"transparent",
          })}
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
