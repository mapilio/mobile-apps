import React from "react";
import {Routes} from "./Routes";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {cameraPermission} from "../helper/helper";
import { Pressable, TouchableOpacity, View } from "react-native";
import {navigatorStyle} from "../styles/navigatorStyle";
import {CaptureIcon} from "../assets/svg/illustrations";
import {useSelector} from "react-redux";
import {
  CameraNavigator,
  MapNavigator,
  MarketplaceNavigator,
  TabIcons,
  UploadNavigator
} from "./partials";
import Leaderboard from "../screens/Leaderboard";
import {useNavigation} from "@react-navigation/native";
import { TooltipWrapper } from "../components/Tooltip";
import { tooltipContents } from "../util/consts/tooltip";
import { tabHeight } from "../util/consts/ui";
import { vibrate } from "../util/helpers";

const Tab = createBottomTabNavigator();

const CaptureTabBarButton = () => {
  const navigation = useNavigation()

  const handlePress = () => cameraPermission(() => {
    vibrate("light")
    navigation.reset({index: 0, routes: [{name: "CameraTab"}]})
  })

  return (
     <TouchableOpacity style={{justifyContent: "center", alignItems: "center", flex: 1}} onPress={handlePress}>
      <View style={navigatorStyle.captureButtonWrapperStyle}>
        <TooltipWrapper name="capture" content={tooltipContents.tabBar.capture}>
        <View style={navigatorStyle.captureButtonStyle}>
          <CaptureIcon />
        </View>
        </TooltipWrapper>
      </View>
    </TouchableOpacity>
  );
};

const TabNavigator = () => {
  const {auth} = useSelector((state) => state.getTokenReducer);
  const {bottom} = useSafeAreaInsets();
  const {connection} = useSelector((state) => state.generalReducer);
  const {isFirstOpen} = useSelector((state) => state.cameraReducer);
  const {uploadData} = useSelector((state) => state.uploadReducer);

  const offlineTabs = ['CameraTab', 'UploadTab'];
  const firstLogin = ['CameraTab'];

  const screenListener = ({navigation, route}) => ({
    tabPress: (e) => {
      e.preventDefault();

      if (connection.connectionStatus) {
        if (!auth && firstLogin.find(value => value === route.name)) {
          isFirstOpen ?
            navigation.navigate(Routes.stackNavigator, {screen: Routes.login, params: {backRoute: 'CameraTab'}}) :
            navigation.navigate(route.name)

          return;
        }

        navigation.navigate(route.name)
      } else {

        if (offlineTabs.find(value => value === route.name)) {
          navigation.navigate(route.name)
          return;
        }

        navigation.navigate('MapTab', {screen: Routes.noInternetAccess})
      }
    }
  })

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: { height: tabHeight + bottom },
        tabBarButton: ({ children, onPress }) => (
          <Pressable
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.8 : 1,
                transform: pressed ? [{ scale: 0.98 }] : [{ scale: 1 }],
                flex: 1,
                alignItems: "center",
              },
            ]}
            onPress={onPress}
          >
            {children}
          </Pressable>
        ),
      }}
      screenListeners={screenListener}
    >
      <Tab.Screen
        name={"MapTab"}
        component={MapNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcons focused={focused} tab={"map"} />
          ),
        }}
      />
      <Tab.Screen
        name={"MarketplaceTab"}
        component={MarketplaceNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcons focused={focused} tab={"market"} />
          ),
        }}
      />
      <Tab.Screen
        name={"CameraTab"}
        component={CameraNavigator}
        options={{
          tabBarStyle: {display: "none"},
          tabBarButton: () => <CaptureTabBarButton />
        }}
      />
      <Tab.Screen
        name={"UploadTab"}
        component={UploadNavigator}
        options={{
          tabBarBadge: uploadData.length !== 0 ? uploadData.length : null,
          tabBarBadgeStyle: {
            backgroundColor:"#D33030"
          },
          tabBarIcon: ({focused}) => <TabIcons focused={focused} tab={"upload"}/>,
        }}
      />
      <Tab.Screen
        name={"Leaderboard"}
        component={Leaderboard}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcons focused={focused} tab={"leader"} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
