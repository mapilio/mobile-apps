import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useEffect } from "react";
import { SafeAreaView, View, Text } from "react-native";
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

const Tab = createMaterialTopTabNavigator();

const Leaderboard = () => {
  const dispatch = useDispatch();

  const users = useSelector((state) => state.leaderboardReducer.users);
  const organizations = useSelector(
    (state) => state.leaderboardReducer.organizations
  );

  const fetchUsersLeaderboard = () => {
    fetchHandler({ url: `${Config.SERVICE_URL}/api/leaderboard` })
      .then((res) => {
        dispatch({
          type: GET_LEADERBOARD_DATA_USERS,
          payload: res.data.leaderboard,
        });
      })
      .catch(() => {
        toast.show(
          `There was a problem for fetching Leaderboard. Please try again.`,
          { type: "warning" }
        );
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
        toast.show(
          `There was a problem fetching for fetching Leaderboard. Please try again.`,
          { type: "warning" }
        );
      });
  };

  useEffect(() => {
    fetchUsersLeaderboard();
    fetchOrganizationsLeaderboard();
  }, []);

  if (!users || !organizations) return <Loading />;

  return (
    <SafeAreaView style={styles.base}>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Leaderboard</Text>
        <Text style={styles.headerSubTitle}>
          Top 50 community members helping grow the mapilio!
        </Text>
        <Tab.Navigator
          screenOptions={styles.screenOptionsStyles}
          initialRouteName="Users"
        >
          <Tab.Screen name="Users" component={Users} />
          <Tab.Screen name="Organizations" component={Organizations} />
        </Tab.Navigator>
      </View>
    </SafeAreaView>
  );
};

export default Leaderboard;
