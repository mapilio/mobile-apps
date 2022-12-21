import React from "react";
import {Routes} from "./Routes";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {RFValue} from "react-native-responsive-fontsize";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {cameraPermission} from "../helper/helper";
import {TouchableOpacity, View} from "react-native";
import {navigatorStyle} from "../styles/navigatorStyle";
import {CaptureText} from "../assets/svg/illustrations";
import {useSelector} from "react-redux";
import {
  CameraNavigator,
  MapNavigator,
  MarketplaceNavigator,
  ProfileNavigator,
  TabIcons,
  UploadNavigator
} from "./partials";

const Tab = createBottomTabNavigator();

const CaptureTabBarButton = ({onPress}) => {
  const screenListen = () => cameraPermission(onPress)

  return (
    <TouchableOpacity style={{justifyContent: "center", alignItems: "center", flex: 1}} onPress={screenListen}>
      <View style={navigatorStyle.captureButtonWrapperStyle}>
        <View style={navigatorStyle.captureButtonStyle}>
          <CaptureText />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const TabNavigator = () => {
  const {auth} = useSelector((state) => state.getTokenReducer);
  const {bottom} = useSafeAreaInsets();
  const {connection} = useSelector((state) => state.generalReducer);
  const {isFirstOpen} = useSelector((state) => state.cameraReducer);

  const offlineTabs = ['CameraTab', 'UploadTab'];
  const guardedTabs = ['ProfileTab'];
  const firstLogin = ['CameraTab'];

  const screenListener = ({navigation, route}) => ({
    tabPress: (e) => {
      e.preventDefault();

      if (connection.connectionStatus) {
        if (firstLogin.find(value => value === route.name)) {
          auth && isFirstOpen ?
            navigation.navigate(route.name) :
            navigation.navigate('Auth', {backRoute: 'CameraTab'})

          return;
        }

        if (!auth && guardedTabs.find(value => value === route.name)) {
          navigation.navigate('Auth')
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
      screenOptions={{tabBarShowLabel: false, headerShown: false, tabBarStyle: {height: RFValue(65) + bottom}}}
      screenListeners={screenListener}
    >
      <Tab.Screen
        name={"MapTab"}
        component={MapNavigator}
        options={{
          tabBarIcon: ({focused}) => <TabIcons focused={focused} title={"Map"}/>
        }}
      />
      <Tab.Screen
        name={"MarketplaceTab"}
        component={MarketplaceNavigator}
        options={{
          tabBarIcon: ({focused}) => <TabIcons focused={focused} title={"Market"}/>,
        }}
      />
      <Tab.Screen
        name={"CameraTab"}
        component={CameraNavigator}
        options={{
          tabBarStyle: {display: "none"},
          tabBarButton: (prop) => <CaptureTabBarButton {...prop} />
        }}
      />
      <Tab.Screen
        name={"UploadTab"}
        component={UploadNavigator}
        options={{
          tabBarIcon: ({focused}) => <TabIcons focused={focused} title={"Upload"}/>,
        }}
      />
      <Tab.Screen
        name={"ProfileTab"}
        component={ProfileNavigator}
        options={{
          tabBarIcon: ({focused}) => <TabIcons focused={focused} title={"Profile"}/>,
        }}
      />
    </Tab.Navigator>
  )
};

export default TabNavigator;
