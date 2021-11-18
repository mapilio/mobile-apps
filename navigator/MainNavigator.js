import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { UserProfile } from "../screens";

const Stack = createNativeStackNavigator();

const MainNavigator = () => (
  <Stack.Navigator initialRouteName={"Profile"}>
    <Stack.Screen component={UserProfile} name="Profile" />
  </Stack.Navigator>
);

export default MainNavigator;
