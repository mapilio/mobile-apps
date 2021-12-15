import React, {useEffect, useState} from "react";
import {
    CardStyleInterpolators, createStackNavigator,
} from "@react-navigation/stack";
import {
    UserUpload,
    UserSequence,
    Login,
    AppMap,
    CameraSettings,
    ForgotPassword,
    GeneralSettings,
    Login,
    MarketplaceDetail,
    NoInternetAccess,
    Register,
    UserSequence,
    UserSequenceDetail,
    Walkthrough,
    WelcomeWalkthrough,
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
import MapLogo from "../assets/svg/illustrations/MapLogo";
import {navigatorStyle} from "../styles/navigatorStyle";
import {DeleteNavigationRight, SequenceNavigatorLeft, SequenceNavigatorRight,} from "./navigatorbars";
import NetInfo from "@react-native-community/netinfo";
import {Routes} from "./Routes";
import {useDispatch, useSelector} from "react-redux";
import GeneralSettingsNavigatorLeft from "./navigatorbars/GeneralSettingsNavigatorLeft";
import {UPDATE_CONNECTION_STATUS} from "../store/actionsName";
import {HeaderTitle} from "../components/Marketplace";
import MarketplaceReceived from "../screens/MarketplaceReceived";
import TabNavigator from "./TabNavigator";

const Stack = createStackNavigator();

const MainNavigator = () => {
    const {auth} = useSelector((state) => state.getTokenReducer);
    const dispatch = useDispatch();
    const [internetConnection, setInternetConnection] = useState(true);
const Stack = createStackNavigator();

    useEffect(() => {
        const unsubcribe = NetInfo.addEventListener((state) => {
            dispatch({
                type: UPDATE_CONNECTION_STATUS,
                payload: {
                    connectionStatus: state.isConnected,
                    connectionType: state.type,
                },
            });
            setInternetConnection(state.isConnected);
        });
        return unsubcribe;
    }, []);

    const noInternetHandler = (navigation, routeName) => {
        if (!internetConnection && routeName !== Routes.tabHome) {
            navigation.navigate(Routes.tabHome)
        }
    }

    return auth === null ? internetConnection ?
        (
            <Stack.Navigator
                initialRouteName={Routes.noInternetAccess}
                screenOptions={{
                    // Todo animation for Android will be made smoother.
                    cardStyleInterpolator:
                    CardStyleInterpolators.forFadeFromBottomAndroid,
                }}
            >
                <Stack.Screen
                    component={NoInternetAccess}
                    name={Routes.noInternetAccess}
                    options={{
                        headerShown: false,
                    }}
                />
            </Stack.Navigator>
        )
        :
        (
            <Stack.Navigator
                initialRouteName={Routes.welcomeWalkthrough}
                screenOptions={{
                    // Todo animation for Android will be made smoother.
                    cardStyleInterpolator:
                    CardStyleInterpolators.forFadeFromBottomAndroid,
                }}
            >
                <Stack.Group>
                    <Stack.Screen
                        component={Login}
                        name={Routes.login}
                        options={{
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        component={Register}
                        name={Routes.register}
                        options={{
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        component={ForgotPassword}
                        name={Routes.forgotPassword}
                        options={{
                            headerShown: false,
                        }}
                    />
                </Stack.Group>
                <Stack.Group screenOptions={{presentation: "modal"}}>
                    <Stack.Screen
                        component={WelcomeWalkthrough}
                        name={Routes.welcomeWalkthrough}
                        options={{
                            headerShown: false,
                        }}
                    />
                </Stack.Group>
            </Stack.Navigator>
        ) : (
        <Stack.Navigator
            initialRouteName={Routes.tabHome}
            screenOptions={{
                // Todo animation for Android will be made smoother.
                cardStyleInterpolator:
                CardStyleInterpolators.forFadeFromBottomAndroid,
            }}
        >
            <Stack.Group>
                <Stack.Screen
                    name={Routes.tabHome}
                    component={TabNavigator}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    component={UserSequence}
                    name={Routes.sequences}
                    options={{
                        headerLeft: (props) => <SequenceNavigatorLeft {...props} />,
                        headerRight: () => <SequenceNavigatorRight/>,
                        title: null,
                        headerStyle: navigatorStyle.headerStyle,
                        headerTitleStyle: navigatorStyle.headerTitleStyle,
                        headerTintColor: navigatorStyle.headerTintColor,
                        headerTitleAlign: navigatorStyle.headerTitleAlign,
                    }}
                    listeners={({navigation, route}) => ({
                        focus: () => noInternetHandler(navigation, route)
                    })}
                />
                <Stack.Screen
                    component={UserSequenceDetail}
                    name={Routes.sequenceDetail}
                    options={{
                        headerLeft: (props) => <SequenceNavigatorLeft {...props} />,
                        headerRight: (props) => <DeleteNavigationRight {...props} />,
                        title: null,
                        headerStyle: navigatorStyle.headerStyle,
                        headerTitleStyle: navigatorStyle.headerTitleStyle,
                        headerTintColor: navigatorStyle.headerTintColor,
                        headerTitleAlign: navigatorStyle.headerTitleAlign,
                    }}
                    listeners={({navigation, route}) => ({
                        focus: () => noInternetHandler(navigation, route)
                    })}
                />
            </Stack.Group>
            <Stack.Group screenOptions={{presentation: "modal"}}>
                <Stack.Screen
                    component={CameraSettings}
                    name={Routes.cameraSettings}
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    component={GeneralSettings}
                    name={Routes.generalSettings}
                    options={{
                        headerLeft: (props) => (
                            <GeneralSettingsNavigatorLeft {...props} />
                        ),
                        headerStyle: navigatorStyle.headerSettingsStyle,
                        title: null,
                    }}
                />
                <Stack.Screen
                    component={Walkthrough}
                    name={Routes.walkthrough}
                    options={{
                        headerShown: false,
                    }}
                />
            </Stack.Group>
            <Stack.Group screenOptions={{presentation: "modal"}}>
                <Stack.Screen
                    component={MarketplaceDetail}
                    name={Routes.marketplaceDetail}
                    options={{
                        headerStyle: navigatorStyle.headerStyle,
                        headerTitleStyle: navigatorStyle.headerTitleStyle,
                        headerTintColor: navigatorStyle.headerTintColor,
                        headerTitleAlign: navigatorStyle.headerTitleAlign,
                        headerTitle: () => <HeaderTitle/>,
                    }}
                    listeners={({navigation, route}) => ({
                        focus: () => noInternetHandler(navigation, route)
                    })}
                />
                <Stack.Screen
                    component={MarketplaceReceived}
                    name={Routes.marketplaceReceived}
                    options={{
                        headerStyle: navigatorStyle.headerStyle,
                        headerTitleAlign: navigatorStyle.headerTitleAlign,
                        headerTitle: () => <HeaderTitle/>,
                        headerLeft: '',
                    }}
                    listeners={({navigation, route}) => ({
                        focus: () => noInternetHandler(navigation, route)
                    })}
                />
            </Stack.Group>
        </Stack.Navigator>
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
              component={UserSequence}
              name={'Marketplace'}
              options={{
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
                          <CaptureIcon height={37.26} width={37.26} />
                          <Text style={navigatorStyle.captureTextStyle}>Capture</Text>
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
              }}
          />
          <Tab.Screen
              component={UserNavigator}
              name={Routes.profile}
              options={{
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
                  headerShown: false,
              }}
          />
      </Tab.Navigator>
  );
};


export default MainNavigator;
