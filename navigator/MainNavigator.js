import React from "react";
import {
  CardStyleInterpolators,
} from "@react-navigation/stack";
import { UserUpload, UserSequence, AppMap } from "../screens";
import { navigatorStyle } from "../styles/navigatorStyle";
import { UploadNavigatorRight } from "./navigatorbars";
import { Routes } from "./Routes";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import UserNavigator from "./UserNavigator";
import { Text, TouchableOpacity, View } from "react-native";
import {MarketplaceIcon} from "../assets/svg/illustrations";
import CaptureIcon from "../assets/svg/illustrations/CaptureIcon";
import Profile from "../assets/svg/illustrations/Profile";
import Upload from "../assets/svg/illustrations/Upload";

const Tab = createBottomTabNavigator();

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

const MainNavigator = () => (
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
                tabBarButton: props => null
            }}
        />
        <Tab.Screen
            component={UserSequence}
            name={'Marketplace'}
            options={{
                tabBarIcon: ({focused}) => (
                    <View style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}>
                        <MarketplaceIcon />
                        <Text style={{fontSize: 14, marginLeft: 8, color: '#32425B'}}>
                            Marketplace
                        </Text>
                    </View>
                ),
                tabBarButton: ({children, onPress}) => (
                    <TouchableOpacity style={{width: '40%'}} onPress={onPress}>
                        {children}
                    </TouchableOpacity>
                )
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
                        <Upload />
                        <Text style={{fontSize: 13, marginTop: 2}}>
                            Upload
                        </Text>
                    </View>
                ),
                tabBarButton: ({children, onPress}) => (
                    <TouchableOpacity style={{width: '20%'}} onPress={onPress}>
                        {children}
                    </TouchableOpacity>
                ),
            }}
        />
        <Tab.Screen
            component={UserNavigator}
            name={Routes.profile}
            options={{
                tabBarIcon: ({focused}) => (
                    <View style={{alignItems: 'center', justifyContent: 'center'}}>
                        <Profile />
                        <Text style={{fontSize: 13, marginTop: 2}}>
                            Profile
                        </Text>
                    </View>
                ),
                tabBarButton: ({children, onPress}) => (
                    <TouchableOpacity style={{width: '20%'}} onPress={onPress}>
                        {children}
                    </TouchableOpacity>
                ),
                headerShown: false,
            }}
        />
    </Tab.Navigator>
);

export default MainNavigator;
