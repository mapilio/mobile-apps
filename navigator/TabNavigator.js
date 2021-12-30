import React, {useState} from "react";
import {useSelector} from "react-redux";
import {Notifier} from "react-native-notifier";
import {Routes} from "./Routes";
import {CardStyleInterpolators} from "@react-navigation/stack";
import {navigatorStyle} from "../styles/navigatorStyle";
import {
    AppCamera,
    AppMap,
    Marketplace,
    NoInternetAccess, ProfileSequence,
    UserProfile,
    UserSequence,
    UserSequenceDetail,
    UserUpload
} from "../screens";
import {HeaderTitle} from "../components/Marketplace";
import {AppState, Text, TouchableOpacity, View} from "react-native";
import {CaptureIcon, MarketplaceIcon, Profile, Upload} from "../assets/svg/illustrations";
import {
    DeleteNavigationRight,
    ProfileNavigatorRight,
    SequenceNavigatorLeft,
    SequenceNavigatorRight,
    UploadNavigatorRight
} from "./navigatorbars";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import * as ScreenOrientation from "expo-screen-orientation";
import TabMap from "../assets/svg/illustrations/TabMap";
import MapLogo from "../assets/svg/illustrations/MapLogo";
import {permissionHandler} from "../helper/helper";

const Tab = createBottomTabNavigator();

const CaptureTabBarButton = ({children, onPress}) => {

    const screenListen = async () => {
        await permissionHandler(() => false, () => false, onPress)
        AppState.addEventListener("change", async (status) => {
            if (status === "active") {
                await permissionHandler(onPress)
            }
        })
    }

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
                <View style={navigatorStyle.captureButtonStyle}>{children}</View>
            </View>
        </TouchableOpacity>
    )
}

const TabNavigator = ({navigation, route}) => {
    const {connection} = useSelector((state) => state.generalReducer);
    const [internetGoes, setInternetGoes] = useState(false)
    const {uploadData} = useSelector((state) => state.uploadReducer)

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
                component={UserUpload}
                name={Routes.upload}
                options={({navigation}) => ({
                    headerRight: () => <UploadNavigatorRight/>,
                    headerStyle: navigatorStyle.headerStyle,
                    headerTitleStyle: navigatorStyle.headerTitleStyle,
                    headerTintColor: navigatorStyle.headerTintColor,
                    headerTitleAlign: navigatorStyle.headerTitleAlign,
                    tabBarBadge: uploadData.length,
                  tabBarIcon: ({focused}) => (
                        <View style={[
                            navigatorStyle.tabIconStyle,
                            focused ? navigatorStyle.borderStyle : {}
                        ]}>
                            <Upload fill={focused ? '#32425B' : undefined}/>
                            <Text style={[navigatorStyle.tabTextStyle, focused ? {color: '#32425B'} : {}]}>
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
                    headerLeft: (props) => <SequenceNavigatorLeft {...props} navigation={navigation} backRoute={Routes.upload} />,
                    headerRight: () => <SequenceNavigatorRight/>,
                    title: null,
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
                options={({navigation}) => ({
                    headerLeft: (props) => <SequenceNavigatorLeft {...props} navigation={navigation} backRoute={Routes.profile} />,
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
                    headerLeft: (props) => <SequenceNavigatorLeft {...props} navigation={navigation} backRoute={Routes.sequences} />,
                    headerRight: (props) => <DeleteNavigationRight {...props} />,
                    title: null,
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
                options={({navigation}) => ({
                    headerStyle: navigatorStyle.headerStyle,
                    headerTitleStyle: navigatorStyle.headerTitleStyle,
                    headerTintColor: navigatorStyle.headerTintColor,
                    headerTitleAlign: navigatorStyle.headerTitleAlign,
                    headerRight: () => <ProfileNavigatorRight navigation={navigation} />,
                    tabBarIcon: ({focused}) => (
                        <View style={[
                            navigatorStyle.tabIconStyle,
                            focused ? navigatorStyle.borderStyle : {}

                        ]}>
                            <Profile fill={focused ? '#32425B' : undefined}/>
                            <Text style={[navigatorStyle.tabTextStyle, focused ? {color: '#32425B'} : {}]}>
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

export default TabNavigator
