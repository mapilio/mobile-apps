import React from "react";
// TODO  import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { UserFeed } from "./UserFeed";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

function TabsBar() {
  return (
    <Tabs.Screen
      initialRouteName="Feed"
      screenOptions={{
        tabBarActiveTintColor: "#e91e63",
      }}
    >
      <Tabs.Screen
        name="Feed"
        component={UserFeed}
        options={{
          tabBarLabel: "Home",
          tabBarLabelPosition: "beside-icon",
          tabBarIcon: ({ color, size }) => (
            // <MaterialCommunityIcons name="home" color={color} size={size} />
            <></>
          ),
        }}
      />
      <Tabs.Screen
        name="Notifications"
        component={UserFeed}
        options={{
          tabBarLabel: "Updates",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="bell" color={color} size={size} />
          ),
          tabBarBadge: 3,
        }}
      />
      <Tabs.Screen
        name="Settings"
        component={UserFeed}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
    </Tabs.Screen>
  );
}

export default TabsBar;
