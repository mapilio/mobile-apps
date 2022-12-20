import {createStackNavigator} from "@react-navigation/stack";
import {Routes} from "../Routes";
import userUpload from "../../screens/UserUpload";
import {UploadNavigatorRight} from "./navigatorbars";
import {navigatorStyle} from "../../styles/navigatorStyle";
import React from "react";
import {UserSequence} from "../../screens";

const Stack = createStackNavigator()

const UploadNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: true,
      headerRight: () => <UploadNavigatorRight/>,
      headerStyle: navigatorStyle.headerStyle,
      headerTitleStyle: navigatorStyle.headerTitleStyle,
      headerTintColor: navigatorStyle.headerTintColor,
      headerTitleAlign: navigatorStyle.headerTitleAlign,
    }}>
      <Stack.Screen name={Routes.upload} component={userUpload} />
      <Stack.Screen name={Routes.sequences} component={UserSequence} />
    </Stack.Navigator>
  )
}

export default UploadNavigator;
