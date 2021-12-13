import React from "react";
import {
    CardStyleInterpolators, createStackNavigator,
} from "@react-navigation/stack";
import {
  UserUpload,
  UserSequence,
  Login,
  AppMap
} from "../screens";
import { navigatorStyle } from "../styles/navigatorStyle";
import { UploadNavigatorRight } from "./navigatorbars";
import { Routes } from "./Routes";
import ForgotPassword from "../screens/ForgotPassword";
import Register from "../screens/Register";
import { useSelector } from "react-redux";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import UserNavigator from "./UserNavigator";
import { Text, TouchableOpacity, View } from "react-native";
import {MarketplaceIcon} from "../assets/svg/illustrations";
import CaptureIcon from "../assets/svg/illustrations/CaptureIcon";
import Profile from "../assets/svg/illustrations/Profile";
import Upload from "../assets/svg/illustrations/Upload";
import TabMap from "../assets/svg/illustrations/TabMap";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const CaptureTabBarButton = ({children, onPress}) => (
    <TouchableOpacity
        style={{
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1
        }}
        onPress={onPress}
    >
        <View style={navigatorStyle.captureButtonWrapperStyle}>
            <View style={navigatorStyle.captureButtonStyle}>
                {children}
            </View>
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
      <Tab.Navigator
          initialRouteName={'Map'}
          screenOptions={{
              // Todo animation for Android will be made smoother.
              cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
              tabBarShowLabel: false,
              tabBarStyle: navigatorStyle.tabBarStyle
          }}
      >
          <Tab.Screen
              component={AppMap}
              name={'Map'}
              options={{
                  tabBarIcon: ({focused}) => (
                      <View style={{alignItems: 'center', justifyContent: 'center'}}>
                          <TabMap fill={focused ? '#32425B' : undefined} />
                          <Text style={{fontSize: 13, marginTop: 2}}>
                              Map
                          </Text>
                          <View style={navigatorStyle.borderStyle}></View>
                      </View>
                  ),
                  headerShown: false,
              }}
          />
          <Tab.Screen
              component={UserSequence}
              name={'Marketplace'}
              options={{
                  tabBarIcon: ({focused}) => (
                      <View style={{alignItems: 'center', justifyContent: 'center'}}>
                          <MarketplaceIcon fill={focused ? '#32425B' : undefined} />
                          <Text style={{fontSize: 13, marginTop: 2}}>
                              Market
                          </Text>
                      </View>
                  ),
                  headerShown: false,
              }}
          />
          <Tab.Screen
              component={UserUpload}
              name={'Capture'}
              options={{
                  headerRight: () => <UploadNavigatorRight />,
                  headerStyle: navigatorStyle.headerStyle,
                  headerTitleStyle: navigatorStyle.headerTitleStyle,
                  headerTintColor: navigatorStyle.headerTintColor,
                  headerTitleAlign: navigatorStyle.headerTitleAlign,
                  tabBarIcon: ({focused}) => (
                      <View style={{alignItems: 'center', justifyContent: 'center'}}>
                          <CaptureIcon height={38} width={38} />
                          <Text style={{position: 'absolute', color: '#1AD971', fontWeight: 'bold', fontFamily: 'Poppins'}}>Capture</Text>
                      </View>
                  ),
                  tabBarButton: (prop) => (
                      <CaptureTabBarButton {...prop} />
                  )
              }}
          />
          <Tab.Screen
              component={UserSequence}
              name={Routes.upload}
              options={{
                  tabBarIcon: ({focused}) => (
                      <View style={{alignItems: 'center', justifyContent: 'center'}}>
                          <Upload fill={focused ? '#32425B' : undefined} />
                          <Text style={{fontSize: 13, marginTop: 2}}>
                              Upload
                          </Text>
                      </View>
                  ),
              }}
          />
          <Tab.Screen
              component={UserNavigator}
              name={Routes.profile}
              options={{
                  tabBarIcon: ({focused}) => (
                      <View style={{alignItems: 'center', justifyContent: 'center'}}>
                          <Profile fill={focused ? '#32425B' : undefined} />
                          <Text style={{fontSize: 13, marginTop: 2}}>
                              Profile
                          </Text>
                      </View>
                  ),
                  headerShown: false,
              }}
          />
      </Tab.Navigator>
  );
};

export default MainNavigator;
