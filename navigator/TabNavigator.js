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

const CaptureTabBarButton = ({ onPress }) => {
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

const TabNavigator = ({navigation}) => {
  const {auth} = useSelector((state) => state.getTokenReducer);
  const {bottom} = useSafeAreaInsets();
  const {connection} = useSelector((state) => state.generalReducer);

  const screenListener = ({ navigation, route }) => ({
    focus: () => {
      if (
        !connection.connectionStatus && route.name !== Routes.camera && route.name !== Routes.upload
      ) {
        navigation.navigate(Routes.noInternetAccess);
      }
    },
    // tabPress: () => connectionAlertHandler(navigation, route.name),
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
        listeners={{
          tabPress: (e) => {
            e.preventDefault()

            auth ?
              navigation.navigate('ProfileTab', {screen: Routes.profile}) :
              navigation.navigate('Auth', {screen: Routes.login})
          }
        }}
        options={{
          tabBarIcon: ({focused}) => <TabIcons focused={focused} title={"Profile"}/>,
        }}
      />
    </Tab.Navigator>
  )
};

export default TabNavigator;
