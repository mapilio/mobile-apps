import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Users from "../../screens/Leaderboard/Users";
import LeaderboardTabBar from "./LeaderboardTopBar";
import { LogBox } from "react-native";
import { useSelector } from "react-redux";
import SkeletonLoading from "./SkeletonLoading";
import { useTranslation } from "react-i18next";

const Tab = createMaterialTopTabNavigator();
LogBox.ignoreLogs(["Sending"]);

const Board = () => {
  const { users, usersWeek, usersMonth } = useSelector(
    (state) => state.leaderboardReducer
  );
  const { t } = useTranslation("leaderboard");

  return (
    <Tab.Navigator
      tabBarPosition="top"
      initialRouteName="all_time"
      tabBar={(props) => <LeaderboardTabBar {...props} />}
    >
      <Tab.Screen
        name="all_time"
        component={!users ? SkeletonLoading : Users}
        initialParams={{ type: "all" }}
        options={{
          tabBarLabel: t("all_time"),
        }}
      />
      <Tab.Screen
        name="last_month"
        component={!usersMonth ? SkeletonLoading : Users}
        initialParams={{ type: "month" }}
        options={{
          tabBarLabel: t("last_month"),
        }}
      />

      {usersWeek && usersWeek.length > 6 && (
        <Tab.Screen
          name="last_week"
          component={!usersWeek ? SkeletonLoading : Users}
          initialParams={{ type: "week" }}
          options={{
            tabBarLabel: t("last_week"),
          }}
        />
      )}
    </Tab.Navigator>
  );
};

export default Board;
