import React from "react";
import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import {
  UserProfile,
  UserUpload,
  UserSequence,
  UserSequenceDetail,
  AppCamera,
  Login,
  Marketplace,
  MarketplaceDetail,
} from "../screens";
import { navigatorStyle } from "../styles/navigatorStyle";
import {
  SequenceNavigatorLeft,
  SequenceNavigatorRight,
  UploadNavigatorRight,
  DeleteNavigationRight,
} from "./navigatorbars";
import { Routes } from "./Routes";
import ForgotPassword from "../screens/ForgotPassword";
import Register from "../screens/Register";
import { useSelector } from "react-redux";
import {HeaderTitle} from "../components/Marketplace";
import MarketplaceReceived from "../screens/MarketplaceReceived";

const Stack = createStackNavigator();

const MainNavigator = () => {
  const { auth } = useSelector((state) => state.getTokenReducer);
  return auth === null ? (
    <Stack.Navigator
      initialRouteName={Routes.login}
      screenOptions={{
        // Todo animation for Android will be made smoother.
        cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
      }}
    >
      <Stack.Screen
        component={Login}
        name={Routes.login}
        options={{
          headerShown: false,
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
  ) : (
    <Stack.Navigator
      initialRouteName={Routes.profile}
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
        component={UserSequenceDetail}
        name={Routes.sequenceDetail}
        options={{
          headerLeft: (props) => <SequenceNavigatorLeft {...props} />,
          headerRight: (props) => <DeleteNavigationRight {...props} />,
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
      <Stack.Screen
        component={Marketplace}
        name={Routes.marketplace}
        options={{
          headerStyle: navigatorStyle.headerStyle,
          headerTitleStyle: navigatorStyle.headerTitleStyle,
          headerTintColor: navigatorStyle.headerTintColor,
          headerTitleAlign: navigatorStyle.headerTitleAlign,
          headerTitle: () => <HeaderTitle/>,
        }}
      />
      <Stack.Screen
        component={MarketplaceDetail}
        name={Routes.marketplaceDetail}
        options={{
          headerStyle: navigatorStyle.headerStyle,
          headerTitleStyle: navigatorStyle.headerTitleStyle,
          headerTintColor: navigatorStyle.headerTintColor,
          headerTitleAlign: navigatorStyle.headerTitleAlign,
          headerTitle: () => <HeaderTitle/>,
        }}
      />
      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen
          component={MarketplaceReceived}
          name={Routes.marketplaceReceived}
          options={{
            headerStyle: navigatorStyle.headerStyle,
            headerTitleAlign: navigatorStyle.headerTitleAlign,
            headerTitle: () => <HeaderTitle/>,
            headerLeft: '',
          }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default MainNavigator;
