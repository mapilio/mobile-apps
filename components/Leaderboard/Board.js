import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Users from "../../screens/Leaderboard/Users";
import LeaderboardTabBar from "./LeaderboardTopBar";
import { LogBox } from "react-native";
import { useSelector } from "react-redux";
import SkeletonLoading from "./SkeletonLoading";

const Tab = createMaterialTopTabNavigator();
LogBox.ignoreLogs(["Sending"]);

const Board = () => {
  const { users, usersWeek, usersMonth } = useSelector(
    (state) => state.leaderboardReducer
  );

  return (
    <Tab.Navigator
      tabBarPosition="top"
      initialRouteName="All Time"
      tabBar={(props) => <LeaderboardTabBar {...props} />}
    >
      <Tab.Screen
        name="All Time"
        component={!users ? SkeletonLoading : Users}
        initialParams={{ type: "all" }}
      />
      <Tab.Screen
        name="This Month"
        component={!usersMonth ? SkeletonLoading : Users}
        initialParams={{ type: "month" }}
      />

      {usersWeek && usersWeek.length > 6 && (
        <Tab.Screen
          name="This Week"
          component={!usersWeek ? SkeletonLoading : Users}
          initialParams={{ type: "week" }}
        />
      )}
    </Tab.Navigator>
  );
};

export default Board;
