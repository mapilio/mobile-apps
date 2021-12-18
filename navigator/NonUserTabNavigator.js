import React, {useState} from 'react'
import {CardStyleInterpolators} from "@react-navigation/stack";
import {navigatorStyle} from "../styles/navigatorStyle";
import {Routes} from "./Routes";
import * as ScreenOrientation from "expo-screen-orientation";
import {AppMap, Marketplace, NoInternetAccess} from "../screens";
import {Text, TouchableOpacity, View} from "react-native";
import TabMap from "../assets/svg/illustrations/TabMap";
import MapLogo from "../assets/svg/illustrations/MapLogo";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {useSelector} from "react-redux";
import {Notifier} from "react-native-notifier";
import {HeaderTitle} from "../components/Marketplace";
import {CaptureIcon, MarketplaceIcon, Profile, Upload} from "../assets/svg/illustrations";

const Tab = createBottomTabNavigator();

const CaptureTabBarButton = ({children, onPress}) => {
    return (
        <TouchableOpacity
            style={{
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
            }}
            onPress={() => false}
        >
            <View style={navigatorStyle.captureButtonWrapperStyle}>
                <View style={navigatorStyle.captureButtonStyle}>{children}</View>
            </View>
        </TouchableOpacity>
    )
}

// TODO Bottom bar will be changed when I find a way to add an icon without adding a component
const EmptyComponent = () => <View></View>

const NonUserTabNavigator = () => {
    const {connection} = useSelector((state) => state.generalReducer);
    const [internetGoes, setInternetGoes] = useState(false)

    const connectionAlertHandler = (navigation) => {
        if (connection.connectionStatus && internetGoes) {
            Notifier.hideNotification();
            navigation.goBack()
            setInternetGoes(false)
        } else if (!connection.connectionStatus) {
            navigation.navigate(Routes.noInternetAccess)
            setInternetGoes(true)
        }
    }

    return (
        <Tab.Navigator
            initialRouteName={Routes.map}
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
                tabPress: () => connectionAlertHandler(navigation),
                state: () => {
                    if (route.name !== Routes.camera) {
                        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP)
                    }
                }
            })}
        >
            <Tab.Screen
                component={AppMap}
                name={Routes.map}
                options={{
                    tabBarIcon: ({focused}) => (
                        <View style={[
                            navigatorStyle.tabIconStyle,
                            focused ? navigatorStyle.borderStyle : {}
                        ]}>
                            <TabMap fill={focused ? '#32425B' : undefined}/>
                            <Text style={[navigatorStyle.tabTextStyle, focused ? {color: '#32425B'} : {}]}>
                                Map
                            </Text>
                        </View>
                    ),
                    // headerShown: false,
                    title: <MapLogo fill={'#000'}/>,
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
                            <MarketplaceIcon fill={focused ? '#32425B' : undefined}/>
                            <Text style={[navigatorStyle.tabTextStyle, focused ? {color: '#32425B'} : {}]}>
                                Market
                            </Text>
                        </View>
                    ),
                })}
            />
            <Tab.Screen
                // TODO Bottom bar will be changed when I find a way to add an icon without adding a component
                name={"dolor"}
                component={EmptyComponent}
                listeners={({navigation}) => ({
                    tabPress: () => navigation.navigate(Routes.login)
                })}
                options={() => ({
                    headerStyle: navigatorStyle.headerStyle,
                    headerTitleStyle: navigatorStyle.headerTitleStyle,
                    headerTintColor: navigatorStyle.headerTintColor,
                    headerTitleAlign: navigatorStyle.headerTitleAlign,
                    tabBarIcon: ({focused}) => (
                        <View style={{alignItems: 'center', justifyContent: 'center'}}>
                            <CaptureIcon height={37.26} width={37.26}/>
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
                name={"ipsum"}
                component={EmptyComponent}
                listeners={({navigation}) => ({
                    tabPress: () => navigation.navigate(Routes.login)
                })}
                options={() => ({
                    headerStyle: navigatorStyle.headerStyle,
                    headerTitleStyle: navigatorStyle.headerTitleStyle,
                    headerTintColor: navigatorStyle.headerTintColor,
                    headerTitleAlign: navigatorStyle.headerTitleAlign,
                    tabBarIcon: ({focused}) => (
                        <View style={[
                            navigatorStyle.tabIconStyle,
                            focused ? navigatorStyle.borderStyle : {}
                        ]}>
                            <Upload fill={'#32425B'}/>
                            <Text style={[navigatorStyle.tabTextStyle, focused ? {color: '#32425B'} : {}]}>
                                Upload
                            </Text>
                        </View>
                    ),
                })}
            />
            <Tab.Screen
                name={"lorem"}
                component={EmptyComponent}
                listeners={({navigation}) => ({
                    tabPress: () => navigation.navigate(Routes.login)
                })}
                options={() => ({
                    headerStyle: navigatorStyle.headerStyle,
                    headerTitleStyle: navigatorStyle.headerTitleStyle,
                    headerTintColor: navigatorStyle.headerTintColor,
                    headerTitleAlign: navigatorStyle.headerTitleAlign,
                    tabBarIcon: ({focused}) => (
                        <View style={[
                            navigatorStyle.tabIconStyle,
                            focused ? navigatorStyle.borderStyle : {}
                        ]}>
                            <Profile fill={'#32425B'}/>
                            <Text
                                style={[navigatorStyle.tabTextStyle, focused ? {color: '#32425B'} : {}]}>
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
    )
}

export default NonUserTabNavigator