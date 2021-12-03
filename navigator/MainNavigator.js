import React from "react";
import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import {
  UserUpload,
  UserSequence,
  CameraSettings,
  UserSequenceDetail,
  AppCamera,
  Login,
  ForgotPassword,
  Register,
  Walkthougher,
} from "../screens";
import { navigatorStyle } from "../styles/navigatorStyle";
import {
  SequenceNavigatorLeft,
  SequenceNavigatorRight,
  UploadNavigatorRight,
  DeleteNavigationRight,
} from "./navigatorbars";
import { Routes } from "./Routes";
import { useSelector } from "react-redux";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import UserNavigator from "./UserNavigator";
import { Text, TouchableOpacity, View } from "react-native";
import {
  MarketplaceIcon,
  CaptureIcon,
  Profile,
  Upload,
} from "../assets/svg/illustrations";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const CaptureTabBarButton = ({ children, onPress }) => (
  <TouchableOpacity
    style={{
      justifyContent: "center",
      alignItems: "center",
      flex: 1,
    }}
    onPress={onPress}
  >
    <View style={navigatorStyle.captureButtonWrapperStyle}>
      <View style={navigatorStyle.captureButtonStyle}>{children}</View>
    </View>
  </TouchableOpacity>
);

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
  ) : (
    <Stack.Navigator
      initialRouteName={Routes.tabHome}
      screenOptions={{
        // Todo animation for Android will be made smoother.
        cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
      }}
    >
      <Stack.Group>
        <Stack.Screen
          name={Routes.tabHome}
          component={TabNavigator}
          options={{ headerShown: false }}
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
      </Stack.Group>
      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen
          component={CameraSettings}
          name={Routes.cameraSettings}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          component={Walkthougher}
          name={Routes.walkthougher}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};

const TabNavigator = () => (
  <Tab.Navigator
    initialRouteName={Routes.profile}
    screenOptions={{
      // Todo animation for Android will be made smoother.
      cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
      tabBarShowLabel: false,
      tabBarStyle: navigatorStyle.tabBarStyle,
    }}
  >
    <Tab.Screen
      component={UserSequence}
      name={Routes.marketplace}
      options={{
        tabBarIcon: ({ focused }) => (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
            }}
          >
            <MarketplaceIcon />
            <Text style={{ fontSize: 14, marginLeft: 8, color: "#32425B" }}>
              Marketplace
            </Text>
          </View>
        ),
        tabBarButton: ({ children, onPress }) => (
          <TouchableOpacity style={{ width: "40%" }} onPress={onPress}>
            {children}
          </TouchableOpacity>
        ),
      }}
    />
    <Tab.Screen
      component={AppCamera}
      name={Routes.camera}
      options={{
        headerShown: false,
        headerRight: () => <UploadNavigatorRight />,
        headerStyle: navigatorStyle.headerStyle,
        headerTitleStyle: navigatorStyle.headerTitleStyle,
        headerTintColor: navigatorStyle.headerTintColor,
        headerTitleAlign: navigatorStyle.headerTitleAlign,
        tabBarIcon: ({ focused }) => (
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <CaptureIcon height={38} width={38} />
            <Text
              style={{
                position: "absolute",
                color: "#1AD971",
                fontWeight: "bold",
                fontFamily: "Poppins",
              }}
            >
              Capture
            </Text>
          </View>
        ),
        tabBarButton: (prop) => <CaptureTabBarButton {...prop} />,
        tabBarStyle: {
          display: "none",
        },
      }}
    />
    <Tab.Screen
      component={UserUpload}
      name={Routes.upload}
      options={{
        headerRight: () => <UploadNavigatorRight />,
        headerStyle: navigatorStyle.headerStyle,
        headerTitleStyle: navigatorStyle.headerTitleStyle,
        headerTintColor: navigatorStyle.headerTintColor,
        headerTitleAlign: navigatorStyle.headerTitleAlign,
        tabBarIcon: ({ focused }) => (
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <Upload />
            <Text style={{ fontSize: 13, marginTop: 2 }}>Upload</Text>
          </View>
        ),
        tabBarButton: ({ children, onPress }) => (
          <TouchableOpacity style={{ width: "20%" }} onPress={onPress}>
            {children}
          </TouchableOpacity>
        ),
      }}
    />
    <Tab.Screen
      component={UserNavigator}
      name={Routes.profile}
      options={{
        tabBarIcon: ({ focused }) => (
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <Profile />
            <Text style={{ fontSize: 13, marginTop: 2 }}>Profile</Text>
          </View>
        ),
        tabBarButton: ({ children, onPress }) => (
          <TouchableOpacity style={{ width: "20%" }} onPress={onPress}>
            {children}
          </TouchableOpacity>
        ),
        headerShown: false,
      }}
    />
  </Tab.Navigator>
);

export default MainNavigator;
