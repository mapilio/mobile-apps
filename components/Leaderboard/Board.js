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
  const { config:{showWeek}} = useSelector((state) => state.generalReducer);

  const { t } = useTranslation("leaderboard");

  return (
    <Tab.Navigator
      tabBarPosition="top"
      initialRouteName="all_time"
      tabBar={(props) => <LeaderboardTabBar {...props} />}
    >
      <Tab.Screen
        name="this_week"
        component={!users ? SkeletonLoading : Users}
        initialParams={{ type: "week" }}
        options={{
          tabBarLabel: t("this_week"),
        }}
      />
      <Tab.Screen
        name="this_month"
        component={!usersMonth ? SkeletonLoading : Users}
        initialParams={{ type: "month" }}
        options={{
          tabBarLabel: t("this_month"),
        }}
      />
        {showWeek && <Tab.Screen
          name="all_time"
          component={!usersWeek ? SkeletonLoading : Users}
          initialParams={{ type: "all" }}
          options={{
            tabBarLabel: t("all_time"),
          }}
        />}
    </Tab.Navigator>
  );
};

export default Board;
