import React from "react";
import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import {UserProfile, UserUpload, UserSequence, Login} from "../screens";
import { navigatorStyle } from "../styles/navigatorStyle";
import {
  SequenceNavigatorLeft,
  SequenceNavigatorRight,
  UploadNavigatorRight,
} from "./navigatorbars";
import { Routes } from "./Routes";
import ForgotPassword from "../screens/ForgotPassword";
import Register from "../screens/Register";

const Stack = createStackNavigator();

const MainNavigator = () => (
  <Stack.Navigator
    initialRouteName={Routes.login}
    screenOptions={{
      // Todo animation for Android will be made smoother.
      cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
    }}
  >
    <Stack.Screen
      component={UserProfile}
      name={Routes.profile}
      options={{
        headerStyle: navigatorStyle.headerStyle,
        headerTitleStyle: navigatorStyle.headerTitleStyle,
        headerTintColor: navigatorStyle.headerTintColor,
        headerTitleAlign: navigatorStyle.headerTitleAlign,
      }}
    />
    <Stack.Screen
      component={UserUpload}
      name={Routes.upload}
      options={{
        headerRight: () => <UploadNavigatorRight />,
        headerStyle: navigatorStyle.headerStyle,
        headerTitleStyle: navigatorStyle.headerTitleStyle,
        headerTintColor: navigatorStyle.headerTintColor,
        headerTitleAlign: navigatorStyle.headerTitleAlign,
      }}
    />
    <Stack.Screen
      component={UserSequence}
      name={Routes.sequences}
      options={{
        headerLeft: (props) => <SequenceNavigatorLeft {...props} />,
        headerRight: () => <SequenceNavigatorRight />,
        title: null,
        headerStyle: navigatorStyle.headerStyle,
        headerTitleStyle: navigatorStyle.headerTitleStyle,
        headerTintColor: navigatorStyle.headerTintColor,
        headerTitleAlign: navigatorStyle.headerTitleAlign,
      }}
    />
    <Stack.Screen
      component={Login}
      name={Routes.login}
      options={{
        title: null,
        headerStyle: navigatorStyle.headerStyle,
        headerTitleStyle: navigatorStyle.headerTitleStyle,
        headerTintColor: navigatorStyle.headerTintColor,
        headerTitleAlign: navigatorStyle.headerTitleAlign,
      }}
    />
    <Stack.Screen
      component={Register}
      name={Routes.register}
      options={{
        title: null,
        headerStyle: navigatorStyle.headerStyle,
        headerTitleStyle: navigatorStyle.headerTitleStyle,
        headerTintColor: navigatorStyle.headerTintColor,
        headerTitleAlign: navigatorStyle.headerTitleAlign,
      }}
    />
    <Stack.Screen
      component={ForgotPassword}
      name={Routes.forgotPassword}
      options={{
        title: null,
        headerStyle: navigatorStyle.headerStyle,
        headerTitleStyle: navigatorStyle.headerTitleStyle,
        headerTintColor: navigatorStyle.headerTintColor,
        headerTitleAlign: navigatorStyle.headerTitleAlign,
      }}
    />
  </Stack.Navigator>
);

export default MainNavigator;
