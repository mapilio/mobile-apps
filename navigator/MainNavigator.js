import React, { useEffect, useState } from "react";
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
  Walkthrough,
  GeneralSettings,
  UserProfile,
  WelcomeWalkthrough,
  NoInternetAccess,
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
import NetInfo from "@react-native-community/netinfo";
import { Routes } from "./Routes";
import { useSelector } from "react-redux";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text, TouchableOpacity, View } from "react-native";
import {
  MarketplaceIcon,
  CaptureIcon,
  Profile,
  Upload,
} from "../assets/svg/illustrations";
import GeneralSettingsNavigatorLeft from "./navigatorbars/GeneralSettingsNavigatorLeft";
import { useDispatch } from "react-redux";
import { UPDATE_CONNECTION_STATUS } from "../store/actionsName";
import { Notifier } from "react-native-notifier";
import { toastGenerator } from "../helper/helper";
import { errorAlertStyles } from "../styles/alertStyles";
import {HeaderTitle} from "../components/Marketplace";
import MarketplaceReceived from "../screens/MarketplaceReceived";

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
  const dispatch = useDispatch();
  const [internetConnection, setInternetConnection] = useState(true);

  useEffect(() => {
    const unsubcribe = NetInfo.addEventListener((state) => {
      dispatch({
        type: UPDATE_CONNECTION_STATUS,
        payload: {
          connectionStatus: state.isConnected,
          connectionType: state.type,
        },
      });
      setInternetConnection(state.isConnected);
    });
    return unsubcribe;
  }, []);

  useEffect(() => {
    if (!internetConnection) {
      toastGenerator(
        "You do not have an internet connection. Please try again.",
        require("../assets/images/Info.png"),
        errorAlertStyles.alertContainer,
        errorAlertStyles.alertTitle,
        errorAlertStyles.alertImage
      );
    } else {
      Notifier.hideNotification();
    }
  }, [internetConnection]);

  if (!internetConnection) {
    return (
      <Stack.Navigator initialRouteName={Routes.noInternetAccess}>
        <Stack.Screen
          component={NoInternetAccess}
          name={Routes.noInternetAccess}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    );
  }

  return auth === null ? (
    <>
      <Stack.Navigator
        initialRouteName={Routes.welcomeWalkthrough}
        screenOptions={{
          // Todo animation for Android will be made smoother.
          cardStyleInterpolator:
            CardStyleInterpolators.forFadeFromBottomAndroid,
        }}
      >
        <Stack.Group>
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
        </Stack.Group>
        <Stack.Group screenOptions={{ presentation: "modal" }}>
          <Stack.Screen
            component={WelcomeWalkthrough}
            name={Routes.welcomeWalkthrough}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            component={NoInternetAccess}
            name={Routes.noInternetAccess}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Group>
      </Stack.Navigator>
    </>
  ) : (
    <>
      <Stack.Navigator
        initialRouteName={Routes.tabHome}
        screenOptions={{
          // Todo animation for Android will be made smoother.
          cardStyleInterpolator:
            CardStyleInterpolators.forFadeFromBottomAndroid,
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
            component={GeneralSettings}
            name={Routes.generalSettings}
            options={{
              headerLeft: (props) => (
                <GeneralSettingsNavigatorLeft {...props} />
              ),
              headerStyle: navigatorStyle.headerSettingsStyle,
              title: null,
            }}
          />
          <Stack.Screen
            component={Walkthrough}
            name={Routes.walkthrough}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            component={NoInternetAccess}
            name={Routes.noInternetAccess}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Group>
        <Stack.Group screenOptions={{presentation: "modal"}}>
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
    </>
  );
};

const TabNavigator = () => {
  const { connection } = useSelector((state) => state.generalReducer);

  return (
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
        component={Marketplace}
        name={Routes.marketplace}
        options={{
          headerStyle: navigatorStyle.headerStyle,
          headerTitleStyle: navigatorStyle.headerTitleStyle,
          headerTintColor: navigatorStyle.headerTintColor,
          headerTitleAlign: navigatorStyle.headerTitleAlign,
          headerTitle: () => <HeaderTitle />,
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
        component={UserProfile}
        name={Routes.profile}
        options={{
          headerStyle: navigatorStyle.headerStyle,
          headerTitleStyle: navigatorStyle.headerTitleStyle,
          headerTintColor: navigatorStyle.headerTintColor,
          headerTitleAlign: navigatorStyle.headerTitleAlign,
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
        }}
      />
      <Tab.Screen
        component={NoInternetAccess}
        name={Routes.noInternetAccess}
        options={{
          headerShown: false,
          tabBarIcon: () => null,
          tabBarButton: () => null,
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
