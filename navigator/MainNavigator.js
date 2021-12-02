import React from "react";
import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import {
  UserProfile,
  UserUpload,
  UserSequence,
  AppCamera,
  CameraSettings,
} from "../screens";
import { navigatorStyle } from "../styles/navigatorStyle";
import {
  SequenceNavigatorLeft,
  SequenceNavigatorRight,
  UploadNavigatorRight,
} from "./navigatorbars";
import { Routes } from "./Routes";

const Stack = createStackNavigator();

const MainNavigator = () => (
  <Stack.Navigator
    initialRouteName={Routes.camera}
    screenOptions={{
      // Todo animation for Android will be made smoother.
      cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
    }}
  >
    <Stack.Group>
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
        component={AppCamera}
        name={Routes.camera}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Group>
    <Stack.Group screenOptions={{ presentation: "modal" }}>
      <Stack.Screen
        component={CameraSettings}
        name={Routes.cameraSettings}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Group>
  </Stack.Navigator>
);

export default MainNavigator;
