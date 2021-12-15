import React from "react";
import {useSelector} from "react-redux";
import {Notifier} from "react-native-notifier";
import {Routes} from "./Routes";
import {CardStyleInterpolators} from "@react-navigation/stack";
import {navigatorStyle} from "../styles/navigatorStyle";
import {AppCamera, AppMap, Marketplace, NoInternetAccess, UserProfile, UserSequence, UserUpload} from "../screens";
import {HeaderTitle} from "../components/Marketplace";
import {Text, TouchableOpacity, View} from "react-native";
import {CaptureIcon, MarketplaceIcon, Profile, Upload} from "../assets/svg/illustrations";
import {UploadNavigatorRight} from "./navigatorbars";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import * as ScreenOrientation from "expo-screen-orientation";
import TabMap from "../assets/svg/illustrations/TabMap";
import MapLogo from "../assets/svg/illustrations/MapLogo";
import UserNavigator from "./UserNavigator";

const Tab = createBottomTabNavigator();

const CaptureTabBarButton = ({children, onPress}) => (
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

const TabNavigator = ({navigation, route}) => {
    const {connection} = useSelector((state) => state.generalReducer);

    const connectionAlertHandler = (navigation) => {
        if (connection.connectionStatus) {
            Notifier.hideNotification();
            navigation.goBack()
        } else {
            navigation.navigate(Routes.noInternetAccess)
        }
    }

    return (
        <Tab.Navigator
            initialRouteName={'Map'}
            screenOptions={{
                // Todo animation for Android will be made smoother.
                cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
                tabBarShowLabel: false,
                tabBarStyle: navigatorStyle.tabBarStyle
            }}
            screenListeners={({navigation, route}) => ({
                focus: (e) => {
                    if (!connection.connectionStatus && route.name !== Routes.camera) {
                        navigation.navigate(Routes.noInternetAccess)
                    }
                },
                state: () => {
                    if (route.name !== Routes.camera) {
                        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP)
                    }
                }
            })}
        >
            <Tab.Screen
                component={AppMap}
                name={'Map'}
                options={{
                    tabBarIcon: ({focused}) => (
                        <View style={[
                            navigatorStyle.tabIconStyle,
                            focused ? navigatorStyle.borderStyle : {}
                        ]}>
                            <TabMap fill={focused ? '#32425B' : undefined} />
                            <Text style={[navigatorStyle.tabTextStyle, focused ? {color: '#32425B'} : {}]}>
                                Map
                            </Text>
                        </View>
                    ),
                    // headerShown: false,
                    title: <MapLogo fill={'#000'} />,
                    headerTitleAlign: 'center',
                    headerStyle: {
                        backgroundColor: '#213348'
                    },
                }}
            />
            <Tab.Screen
                component={Marketplace}
                name={Routes.marketplace}
                options={({navigation}) => ({
                    headerStyle: navigatorStyle.headerStyle,
                    headerTitleStyle: navigatorStyle.headerTitleStyle,
                    headerTintColor: navigatorStyle.headerTintColor,
                    headerTitleAlign: navigatorStyle.headerTitleAlign,
                    headerTitle: () => <HeaderTitle/>,
                    tabBarIcon: ({focused}) => (
                        <View style={[
                            navigatorStyle.tabIconStyle,
                            focused ? navigatorStyle.borderStyle : {}
                        ]}>
                            <MarketplaceIcon fill={focused ? '#32425B' : undefined} />
                            <Text style={[navigatorStyle.tabTextStyle, focused ? {color: '#32425B'} : {}]}>
                                Market
                            </Text>
                        </View>
                    ),
                    tabBarButton: ({children, onPress}) => (
                        <TouchableOpacity style={{width: "40%"}}
                                          onPress={() => {
                                              if (connection.connectionStatus) {
                                                  onPress()
                                              } else {
                                                  connectionAlertHandler(navigation)
                                              }
                                          }}>
                            {children}
                        </TouchableOpacity>
                    ),
                })}
            />
            <Tab.Screen
                component={AppCamera}
                name={Routes.camera}
                options={({navigation}) => ({
                    headerShown: false,
                    headerRight: () => <UploadNavigatorRight/>,
                    headerStyle: navigatorStyle.headerStyle,
                    headerTitleStyle: navigatorStyle.headerTitleStyle,
                    headerTintColor: navigatorStyle.headerTintColor,
                    headerTitleAlign: navigatorStyle.headerTitleAlign,
                    tabBarIcon: ({focused}) => (
                        <View style={{alignItems: 'center', justifyContent: 'center'}}>
                            <CaptureIcon height={37.26} width={37.26} />
                            <Text style={navigatorStyle.captureTextStyle}>Capture</Text>
                        </View>
                    ),
                    tabBarButton: (prop) => (
                        <CaptureTabBarButton {...prop} />
                    ),
                    tabBarStyle: {
                        display: "none",
                    },
                })}
            />
            <Tab.Screen
                component={UserUpload}
                name={Routes.upload}
                options={({navigation}) => ({
                    headerRight: () => <UploadNavigatorRight/>,
                    headerStyle: navigatorStyle.headerStyle,
                    headerTitleStyle: navigatorStyle.headerTitleStyle,
                    headerTintColor: navigatorStyle.headerTintColor,
                    headerTitleAlign: navigatorStyle.headerTitleAlign,
                    tabBarIcon: ({focused}) => (
                        <View style={[
                            navigatorStyle.tabIconStyle,
                            focused ? navigatorStyle.borderStyle : {}
                        ]}>
                            <Upload fill={focused ? '#32425B' : undefined} />
                            <Text style={[navigatorStyle.tabTextStyle, focused ? {color: '#32425B'} : {}]}>
                                Upload
                            </Text>
                        </View>
                    ),
                    tabBarButton: ({children, onPress}) => (
                        <TouchableOpacity style={{width: "20%"}}
                                          onPress={() => {
                                              if (connection.connectionStatus) {
                                                  onPress()
                                              } else {
                                                  connectionAlertHandler(navigation)
                                              }
                                          }}>
                            {children}
                        </TouchableOpacity>
                    ),
                })}
            />
            <Tab.Screen
                component={UserProfile}
                name={Routes.profile}
                options={({navigation}) => ({
                    headerStyle: navigatorStyle.headerStyle,
                    headerTitleStyle: navigatorStyle.headerTitleStyle,
                    headerTintColor: navigatorStyle.headerTintColor,
                    headerTitleAlign: navigatorStyle.headerTitleAlign,
                    tabBarIcon: ({focused}) => (
                        <View style={[
                            navigatorStyle.tabIconStyle,
                            focused ? navigatorStyle.borderStyle : {}
                        ]}>
                            <Profile fill={focused ? '#32425B' : undefined} />
                            <Text style={[navigatorStyle.tabTextStyle, focused ? {color: '#32425B'} : {}]}>
                                Profile
                            </Text>
                        </View>
                    ),
                    tabBarButton: ({children, onPress}) => (
                        <TouchableOpacity style={{width: "20%"}}
                              onPress={() => {
                                  if (connection.connectionStatus) {
                                      onPress()
                                  } else {
                                      connectionAlertHandler(navigation)
                                  }
                              }}>
                            {children}
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

export default TabNavigator
