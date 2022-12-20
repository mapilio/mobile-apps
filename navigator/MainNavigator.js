import React from "react";
import {createStackNavigator} from "@react-navigation/stack";
import TabNavigator from "./TabNavigator";
import {AuthNavigator} from "./partials";

const Stack = createStackNavigator();

const MainNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name={"Tabs"} component={TabNavigator} />
      <Stack.Screen name={"Auth"} component={AuthNavigator} />
    </Stack.Navigator>
  )
};

export default MainNavigator;
