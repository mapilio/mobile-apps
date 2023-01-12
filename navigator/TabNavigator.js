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
  TabIcons,
  UploadNavigator
} from "./partials";
import Leaderboard from "../screens/Leaderboard";
import {useTranslation} from "react-i18next";
import {CustomTextBold} from "../highordercomponents";
import {useNavigation} from "@react-navigation/native";

const Tab = createBottomTabNavigator();

const CaptureTabBarButton = () => {
  const {t} = useTranslation("tab");
  const navigation = useNavigation()

  const handlePress = () => cameraPermission(() => {
    navigation.reset({index: 0, routes: [{name: "CameraTab"}]})
  })

  return (
    <TouchableOpacity style={{justifyContent: "center", alignItems: "center", flex: 1}} onPress={handlePress}>
      <View style={navigatorStyle.captureButtonWrapperStyle}>
        <View style={navigatorStyle.captureButtonStyle}>
          <CaptureText />

          <CustomTextBold style={{
            position: "absolute",
            color: "#1ad971",
            fontSize: RFValue(12),
          }}>
            {t("capture")}
          </CustomTextBold>
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
      screenOptions={{tabBarShowLabel: false, headerShown: false, tabBarStyle: {height: RFValue(65) + bottom}}}
      screenListeners={screenListener}
    >
      <Tab.Screen
        name={"MapTab"}
        component={MapNavigator}
        options={{
          tabBarIcon: ({focused}) => <TabIcons focused={focused} tab={"map"}/>
        }}
      />
      <Tab.Screen
        name={"MarketplaceTab"}
        component={MarketplaceNavigator}
        options={{
          tabBarIcon: ({focused}) => <TabIcons focused={focused} tab={"market"}/>,
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
          tabBarBadgeStyle: {marginTop: RFValue(10)},
          tabBarIcon: ({focused}) => <TabIcons focused={focused} tab={"upload"}/>,
        }}
      />
      <Tab.Screen
        name={"Leaderboard"}
        component={Leaderboard}
        options={{
          tabBarIcon: ({focused}) => <TabIcons focused={focused} tab={"leader"}/>,
        }}
      />
    </Tab.Navigator>
  )
};

export default TabNavigator;
