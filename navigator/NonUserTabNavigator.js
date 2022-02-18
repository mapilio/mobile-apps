import React, { useState } from "react";
import { CardStyleInterpolators } from "@react-navigation/stack";
import { navigatorStyle } from "../styles/navigatorStyle";
import { Routes } from "./Routes";
import * as ScreenOrientation from "expo-screen-orientation";
import { AppMap, Login, Marketplace, NoInternetAccess } from "../screens";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import TabMap from "../assets/svg/illustrations/TabMap";
import MapLogo from "../assets/svg/illustrations/MapLogo";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSelector } from "react-redux";
import { Notifier } from "react-native-notifier";
import { HeaderTitle } from "../components/Marketplace";
import {
  CaptureIcon,
  CaptureText,
  MarketplaceIcon,
  Profile,
  Upload,
} from "../assets/svg/illustrations";
import SignInNavigatorRight from "./navigatorbars/SignInNavigatorRight";
import { RFValue } from "react-native-responsive-fontsize";

const Tab = createBottomTabNavigator();

const CaptureTabBarButton = ({ navigation }) => {
  return (
    <TouchableOpacity
      style={{
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
      }}
      onPress={() => navigation.navigate(Routes.login)}
    >
      <View style={navigatorStyle.captureButtonWrapperStyle}>
        <View style={navigatorStyle.captureButtonStyle}>
          <CaptureText />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const NonUserTabNavigator = () => {
  const { connection } = useSelector((state) => state.generalReducer);
  const [internetGoes, setInternetGoes] = useState(false);

  const connectionAlertHandler = (navigation) => {
    if (connection.connectionStatus && internetGoes) {
      Notifier.hideNotification();
      navigation.goBack();
      setInternetGoes(false);
    } else if (!connection.connectionStatus) {
      navigation.navigate(Routes.noInternetAccess);
      setInternetGoes(true);
    }
  };

  return (
    <Tab.Navigator
      initialRouteName={Routes.map}
      screenOptions={({ navigation }) => ({
        cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
        tabBarShowLabel: false,
        tabBarStyle: navigatorStyle.tabBarStyle,
        headerRight: () => <SignInNavigatorRight navigation={navigation} />,
      })}
      screenListeners={({ navigation, route }) => ({
        focus: (e) => {
          if (!connection.connectionStatus && route.name !== Routes.camera) {
            navigation.navigate(Routes.noInternetAccess);
          }
        },
        tabPress: () => connectionAlertHandler(navigation),
        state: () => {
          if (route.name !== Routes.camera) {
            ScreenOrientation.lockAsync(
              ScreenOrientation.OrientationLock.PORTRAIT_UP
            );
          }
        },
      })}
    >
      <Tab.Screen
        component={AppMap}
        name={Routes.map}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                navigatorStyle.tabIconStyle,
                focused ? navigatorStyle.borderStyle : {},
              ]}
            >
              <TabMap fill={focused ? "#32425B" : undefined} />
              <Text
                style={[
                  navigatorStyle.tabTextStyle,
                  focused ? { color: "#32425B" } : {},
                ]}
              >
                Map
              </Text>
            </View>
          ),
          // headerShown: false,
          title: <MapLogo fill={"#000"} />,
          headerTitleAlign: "center",
          headerStyle: {
            height:
              Dimensions.get("window").height > 1100
                ? RFValue(50)
                : Platform.OS === "ios"
                ? RFValue(80)
                : RFValue(55),
            backgroundColor: "#213348",
          },
        }}
      />
      <Tab.Screen
        component={Marketplace}
        name={Routes.marketplace}
        options={({ navigation }) => ({
          headerStyle: navigatorStyle.headerStyle,
          headerTitleStyle: navigatorStyle.headerTitleStyle,
          headerTintColor: navigatorStyle.headerTintColor,
          headerTitleAlign: navigatorStyle.headerTitleAlign,
          headerTitle: () => <HeaderTitle />,
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                navigatorStyle.tabIconStyle,
                focused ? navigatorStyle.borderStyle : {},
              ]}
            >
              <MarketplaceIcon fill={focused ? "#32425B" : undefined} />
              <Text
                style={[
                  navigatorStyle.tabTextStyle,
                  focused ? { color: "#32425B" } : {},
                ]}
                numberOfLines={1}
                ellipsizeMode={"clip"}
              >
                Market
              </Text>
            </View>
          ),
        })}
      />
      <Tab.Screen
        name={"dolor"}
        component={Login}
        options={({ navigation }) => ({
          headerShown: false,
          tabBarStyle: {
            display: "none",
          },
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <CaptureIcon height={37.26} width={37.26} />
              <Text style={navigatorStyle.captureTextStyle}>Capture</Text>
            </View>
          ),
          tabBarButton: (prop) => (
            <CaptureTabBarButton navigation={navigation} {...prop} />
          ),
        })}
      />
      <Tab.Screen
        name={"ipsum"}
        component={Login}
        options={({ navigation }) => ({
          headerShown: false,
          tabBarStyle: {
            display: "none",
          },
          tabBarIcon: ({ focused }) => (
            <TouchableOpacity
              style={[
                navigatorStyle.tabIconStyle,
                focused ? navigatorStyle.borderStyle : {},
              ]}
              onPress={() => navigation.navigate(Routes.login)}
            >
              <Upload fill={focused ? "#32425B" : undefined} />
              <Text
                style={[
                  navigatorStyle.tabTextStyle,
                  focused ? { color: "#32425B" } : {},
                ]}
                numberOfLines={1}
                ellipsizeMode={"clip"}
              >
                Upload
              </Text>
            </TouchableOpacity>
          ),
        })}
      />
      <Tab.Screen
        name={"lorem"}
        component={Login}
        options={({ navigation }) => ({
          headerShown: false,
          tabBarStyle: {
            display: "none",
          },
          tabBarIcon: ({ focused }) => (
            <TouchableOpacity
              style={[
                navigatorStyle.tabIconStyle,
                focused ? navigatorStyle.borderStyle : {},
              ]}
              onPress={() => navigation.navigate(Routes.login)}
            >
              <Profile fill={focused ? "#32425B" : undefined} />
              <Text
                style={[
                  navigatorStyle.tabTextStyle,
                  focused ? { color: "#32425B" } : {},
                ]}
                numberOfLines={1}
                ellipsizeMode={"clip"}
              >
                Profile
              </Text>
            </TouchableOpacity>
          ),
        })}
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

export default NonUserTabNavigator;
