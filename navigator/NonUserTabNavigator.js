import React, { useState } from "react";
import { CardStyleInterpolators } from "@react-navigation/stack";
import { navigatorStyle } from "../styles/navigatorStyle";
import { Routes } from "./Routes";
import * as ScreenOrientation from "expo-screen-orientation";
import { AppMap, Login, Marketplace, NoInternetAccess } from "../screens";
import { Text, TouchableOpacity, View } from "react-native";
import TabMap from "../assets/svg/illustrations/TabMap";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSelector } from "react-redux";
import {CaptureIcon, CaptureText, MarketplaceIcon, Profile, Upload} from "../assets/svg/illustrations";
import SignInNavigatorRight from "./navigatorbars/SignInNavigatorRight";
import { RFValue } from "react-native-responsive-fontsize";
import {useSafeAreaInsets} from "react-native-safe-area-context";

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
  const {connection} = useSelector((state) => state.generalReducer);
  const [internetGoes, setInternetGoes] = useState(false);
  const {bottom} = useSafeAreaInsets();

  const connectionAlertHandler = (navigation) => {
    if (connection.connectionStatus && internetGoes) {
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
        tabBarStyle: {height: RFValue(63) + bottom},
        headerRight: () => <SignInNavigatorRight navigation={navigation} />,
      })}
      screenListeners={({ navigation, route }) => ({
        focus: () => {
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
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                navigatorStyle.tabIconStyle,
                focused ? navigatorStyle.borderStyle : {},
              ]}
            >
              <TabMap fill={focused ? "#130C47" : undefined} />
              <Text
                style={[
                  navigatorStyle.tabTextStyle,
                  focused ? { color: "#130C47" } : {},
                ]}
              >
                Map
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        component={Marketplace}
        name={Routes.marketplace}
        options={() => ({
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                navigatorStyle.tabIconStyle,
                focused ? navigatorStyle.borderStyle : {},
              ]}
            >
              <MarketplaceIcon fill={focused ? "#130C47" : undefined} />
              <Text
                style={[
                  navigatorStyle.tabTextStyle,
                  focused ? { color: "#130C47" } : {},
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
          tabBarIcon: () => (
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
              <Upload fill={focused ? "#130C47" : undefined} />
              <Text
                style={[
                  navigatorStyle.tabTextStyle,
                  focused ? { color: "#130C47" } : {},
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
              <Profile fill={focused ? "#130C47" : undefined} />
              <Text
                style={[
                  navigatorStyle.tabTextStyle,
                  focused ? { color: "#130C47" } : {},
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
