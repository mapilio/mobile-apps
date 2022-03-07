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
  AppState,
  Dimensions,
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

const Tab = createBottomTabNavigator();

const CaptureTabBarButton = ({ children, onPress }) => {
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

const TabNavigator = ({ navigation, route }) => {
  const { connection, tabHeight } = useSelector(
    (state) => state.generalReducer
  );
  const [internetGoes, setInternetGoes] = useState(false);
  const { uploadData } = useSelector((state) => state.uploadReducer);

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
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: tabHeight,
          position: "absolute",
          bottom: 0,
        },
      }}
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
        component={AppCamera}
        name={Routes.camera}
        options={({ navigation }) => ({
          headerShown: false,
          headerRight: () => <UploadNavigatorRight />,
          headerStyle: navigatorStyle.headerStyle,
          headerTitleStyle: navigatorStyle.headerTitleStyle,
          headerTintColor: navigatorStyle.headerTintColor,
          headerTitleAlign: navigatorStyle.headerTitleAlign,
          tabBarIcon: ({ focused }) => (
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
        options={({ navigation, route }) => ({
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
