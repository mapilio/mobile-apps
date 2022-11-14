import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Notifier } from "react-native-notifier";
import { Routes } from "./Routes";
import { CardStyleInterpolators } from "@react-navigation/stack";
import { navigatorStyle } from "../styles/navigatorStyle";
import {
  AppCamera,
  AppMap,
  Marketplace,
  NoInternetAccess,
  ProfileSequence,
  ProfileUploadDetail,
  UserProfile,
  UserSequence,
  UserSequenceDetail,
  UserUpload,
} from "../screens";
import { HeaderTitle } from "../components/Marketplace";
import {
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  CaptureIcon,
  CaptureText,
  MarketplaceIcon,
  Profile,
  Upload,
} from "../assets/svg/illustrations";
import {
  DeleteNavigationRight,
  ProfileNavigatorRight,
  SequenceDetailTitle,
  SequenceNavigatorLeft,
  SequenceNavigatorRight,
  SequenceNavigatorTitle,
  UploadNavigatorRight,
} from "./navigatorbars";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as ScreenOrientation from "expo-screen-orientation";
import TabMap from "../assets/svg/illustrations/TabMap";
import MapLogo from "../assets/svg/illustrations/MapLogo";
import { permissionHandler } from "../helper/helper";
import { RFValue } from "react-native-responsive-fontsize";
import {useSafeAreaInsets} from "react-native-safe-area-context";

const Tab = createBottomTabNavigator();

const CaptureTabBarButton = ({ onPress }) => {
  const screenListen = async () => {
    await permissionHandler(
      () => false,
      () => false,
      onPress,
      "camera",
      onPress
    );
  };

  return (
    <TouchableOpacity
      style={{
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
      }}
      onPress={screenListen}
    >
      <View style={navigatorStyle.captureButtonWrapperStyle}>
        <View style={navigatorStyle.captureButtonStyle}>
          <CaptureText />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const TabNavigator = ({ navigation }) => {
  const {connection} = useSelector((state) => state.generalReducer);
  const [internetGoes, setInternetGoes] = useState(false);
  const {uploadData} = useSelector((state) => state.uploadReducer);
  const {bottom, top} = useSafeAreaInsets();

  const connectionAlertHandler = (navigation, name) => {
    if (name !== Routes.camera && name !== Routes.upload) {
      if (connection.connectionStatus && internetGoes) {
        Notifier.hideNotification();
        navigation.goBack();
        setInternetGoes(false);
      } else if (!connection.connectionStatus) {
        navigation.navigate(Routes.noInternetAccess);
        setInternetGoes(true);
      }
    }
  };

  return (
    <Tab.Navigator
      initialRouteName={Routes.map}
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
        tabBarShowLabel: false,
        tabBarStyle: {height: RFValue(63) + bottom},
      }}
      screenListeners={({ navigation, route }) => ({
        focus: () => {
          if (
            !connection.connectionStatus &&
            route.name !== Routes.camera &&
            route.name !== Routes.upload
          ) {
            navigation.navigate(Routes.noInternetAccess);
          }
        },
        tabPress: () => connectionAlertHandler(navigation, route.name),
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
              <TabMap fill={focused ? "#130C47" : undefined} />
              <Text
                style={[
                  navigatorStyle.tabTextStyle,
                  focused ? { color: "#130C47" } : {},
                ]}
                numberOfLines={1}
                ellipsizeMode={"clip"}
              >
                Map
              </Text>
            </View>
          ),
          title: <MapLogo fill={"#000"} />,
          headerTitleAlign: "center",
          headerStyle: {
            height: top + RFValue(50),
            backgroundColor: "#213348",
          },
        }}
      />
      <Tab.Screen
        component={Marketplace}
        name={Routes.marketplace}
        options={() => ({
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
        component={AppCamera}
        name={Routes.camera}
        options={() => ({
          headerShown: false,
          headerRight: () => <UploadNavigatorRight />,
          headerStyle: navigatorStyle.headerStyle,
          headerTitleStyle: navigatorStyle.headerTitleStyle,
          headerTintColor: navigatorStyle.headerTintColor,
          headerTitleAlign: navigatorStyle.headerTitleAlign,
          tabBarIcon: () => (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <CaptureIcon height={37.26} width={37.26} />
              <Text style={navigatorStyle.captureTextStyle}>Capture</Text>
            </View>
          ),
          tabBarButton: (prop) => <CaptureTabBarButton {...prop} />,
          tabBarStyle: {
            display: "none",
          },
        })}
      />
      <Tab.Screen
        component={UserUpload}
        name={Routes.upload}
        options={({ navigation }) => ({
          headerRight: () => <UploadNavigatorRight navigation={navigation} />,
          headerStyle: navigatorStyle.headerStyle,
          headerTitleStyle: navigatorStyle.headerTitleStyle,
          headerTintColor: navigatorStyle.headerTintColor,
          headerTitleAlign: navigatorStyle.headerTitleAlign,
          tabBarBadge: uploadData.length !== 0 ? uploadData.length : null,
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                navigatorStyle.tabIconStyle,
                focused ? navigatorStyle.borderStyle : {},
              ]}
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
            </View>
          ),
        })}
      />
      <Tab.Screen
        component={UserSequence}
        name={Routes.sequences}
        options={{
          headerLeft: (props) => (
            <SequenceNavigatorLeft
              {...props}
              navigation={navigation}
              backRoute={Routes.upload}
            />
          ),
          headerRight: () => <SequenceNavigatorRight navigation={navigation} />,
          title: <SequenceNavigatorTitle />,
          headerStyle: navigatorStyle.headerStyle,
          headerTitleStyle: navigatorStyle.headerTitleStyle,
          headerTintColor: navigatorStyle.headerTintColor,
          headerTitleAlign: navigatorStyle.headerTitleAlign,
          tabBarIcon: () => null,
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        component={ProfileSequence}
        name={Routes.profileSequence}
        options={({ navigation }) => ({
          headerLeft: (props) => (
            <SequenceNavigatorLeft
              {...props}
              navigation={navigation}
              backRoute={Routes.profile}
              // route={route}
            />
          ),
          title: "Your uploads",
          headerStyle: navigatorStyle.headerStyle,
          headerTitleStyle: navigatorStyle.headerTitleStyle,
          headerTintColor: navigatorStyle.headerTintColor,
          headerTitleAlign: navigatorStyle.headerTitleAlign,
          tabBarIcon: () => null,
          tabBarButton: () => null,
        })}
      />
      <Tab.Screen
        component={UserSequenceDetail}
        name={Routes.sequenceDetail}
        options={{
          headerLeft: (props) => (
            <SequenceNavigatorLeft
              {...props}
              navigation={navigation}
              route
              backRoute={Routes.sequences}
            />
          ),
          headerRight: (props) => (
            <DeleteNavigationRight {...props} navigation={navigation} />
          ),
          title: <SequenceDetailTitle />,
          headerStyle: navigatorStyle.headerStyle,
          headerTitleStyle: navigatorStyle.headerTitleStyle,
          headerTintColor: navigatorStyle.headerTintColor,
          headerTitleAlign: navigatorStyle.headerTitleAlign,
          tabBarIcon: () => null,
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        component={ProfileUploadDetail}
        name={Routes.feedDetail}
        options={{
          headerLeft: (props) => (
            <SequenceNavigatorLeft
              {...props}
              navigation={navigation}
              backRoute={Routes.sequences}
            />
          ),
          title: "Upload detail",
          headerStyle: navigatorStyle.headerStyle,
          headerTitleStyle: navigatorStyle.headerTitleStyle,
          headerTintColor: navigatorStyle.headerTintColor,
          headerTitleAlign: navigatorStyle.headerTitleAlign,
          tabBarIcon: () => null,
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        component={UserProfile}
        name={Routes.profile}
        options={({ navigation }) => ({
          headerStyle: navigatorStyle.headerStyle,
          headerTitleStyle: navigatorStyle.headerTitleStyle,
          headerTintColor: navigatorStyle.headerTintColor,
          headerTitleAlign: navigatorStyle.headerTitleAlign,
          headerRight: () => <ProfileNavigatorRight navigation={navigation} />,
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                navigatorStyle.tabIconStyle,
                focused ? navigatorStyle.borderStyle : {},
              ]}
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
            </View>
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

export default TabNavigator;
