import React from "react";
import {useSelector} from "react-redux";
import {Notifier} from "react-native-notifier";
import {Routes} from "./Routes";
import {CardStyleInterpolators} from "@react-navigation/stack";
import {navigatorStyle} from "../styles/navigatorStyle";
import {AppCamera, Marketplace, NoInternetAccess, UserProfile, UserUpload} from "../screens";
import {HeaderTitle} from "../components/Marketplace";
import {Text, TouchableOpacity, View} from "react-native";
import {CaptureIcon, MarketplaceIcon, Profile, Upload} from "../assets/svg/illustrations";
import {UploadNavigatorRight} from "./navigatorbars";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";

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

const TabNavigator = ({navigation,route}) => {
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
            initialRouteName={Routes.profile}
            screenOptions={{
                // Todo animation for Android will be made smoother.
                cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
                tabBarShowLabel: false,
                tabBarStyle: navigatorStyle.tabBarStyle,
            }}
            screenListeners={({navigation, route}) => ({
                focus: (e) => {
                    if (!connection.connectionStatus && route.name !== Routes.camera) {
                        navigation.navigate(Routes.noInternetAccess)
                    }
                },
            })}
        >
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
                        <View

                            style={{
                                alignItems: "center",
                                justifyContent: "center",
                                flexDirection: "row",
                            }}
                        >
                            <MarketplaceIcon/>
                            <Text style={{fontSize: 14, marginLeft: 8, color: "#32425B"}}>
                                Marketplace
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
                        <View style={{alignItems: "center", justifyContent: "center"}}>
                            <CaptureIcon height={38} width={38}/>
                            <Text
                                style={{
                                    position: "absolute",
                                    color: "#1AD971",
                                    fontWeight: "bold",
                                    fontFamily: "Poppins",
                                }}
                            >
                                Capture
                            </Text>
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
                options={({navigation}) => ({
                    headerRight: () => <UploadNavigatorRight/>,
                    headerStyle: navigatorStyle.headerStyle,
                    headerTitleStyle: navigatorStyle.headerTitleStyle,
                    headerTintColor: navigatorStyle.headerTintColor,
                    headerTitleAlign: navigatorStyle.headerTitleAlign,
                    tabBarIcon: ({focused}) => (
                        <View style={{alignItems: "center", justifyContent: "center"}}>
                            <Upload/>
                            <Text style={{fontSize: 13, marginTop: 2}}>Upload</Text>
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
                        <View style={{alignItems: "center", justifyContent: "center"}}>
                            <Profile/>
                            <Text style={{fontSize: 13, marginTop: 2}}>Profile</Text>
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