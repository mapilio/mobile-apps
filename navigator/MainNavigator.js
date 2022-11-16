import React, { useEffect, useState } from "react";
import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import {
  CameraSettings,
  ForgotPassword,
  GeneralSettings,
  Login,
  MarketplaceDetail,
  NoInternetAccess,
  Register,
  Walkthrough,
  WelcomeWalkthrough,
} from "../screens";
import { navigatorStyle } from "../styles/navigatorStyle";
import NetInfo from "@react-native-community/netinfo";
import { Routes } from "./Routes";
import { useDispatch, useSelector } from "react-redux";
import GeneralSettingsNavigatorLeft from "./navigatorbars/GeneralSettingsNavigatorLeft";
import {UPDATE_CONNECTION_STATUS} from "../store/actionsName";
import { HeaderTitle } from "../components/Marketplace";
import TabNavigator from "./TabNavigator";
import NonUserTabNavigator from "./NonUserTabNavigator";
import MarketplaceReady from "../screens/MarketplaceReady";
import {loginStyles} from "../styles/loginStyles";
import {Back, SignInButton, SignUpButton} from "../components/Login";
import {useSafeAreaInsets} from "react-native-safe-area-context";

const Stack = createStackNavigator();

const MainNavigator = () => {
  const { auth } = useSelector((state) => state.getTokenReducer);
  const dispatch = useDispatch();
  const [internetConnection, setInternetConnection] = useState(true);
  const {top} = useSafeAreaInsets();

  useEffect(() => {
    const removeListener = NetInfo.addEventListener((state) => {
      dispatch({
        type: UPDATE_CONNECTION_STATUS,
        payload: {connectionStatus: state.isConnected, connectionType: state.type},
      });
      setInternetConnection(state.isConnected);
    });
    return () => removeListener();
  }, []);

  const noInternetHandler = (navigation, routeName) => {
    if (!internetConnection && routeName !== Routes.tabHome) {
      navigation.navigate(Routes.tabHome);
    }
  };

  return auth === null ? (
    !internetConnection ? (
      <Stack.Navigator
        initialRouteName={Routes.noInternetAccess}
        screenOptions={{cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid}}
      >
        <Stack.Screen
          component={NoInternetAccess}
          name={Routes.noInternetAccess}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    ) : (
      <Stack.Navigator
        initialRouteName={Routes.welcomeWalkthrough}
        screenOptions={{cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid}}
      >
        <Stack.Group>
          <Stack.Screen
            component={Login}
            name={Routes.login}
            options={({navigation}) => ({
              title: false,
              headerStyle: {...loginStyles.headerStyle, height: top + 50},
              headerLeft: () => <Back navigation={navigation}/>,
              headerRight: () => <SignUpButton navigation={navigation}/>,
            })}
          />
          <Stack.Screen
            component={Register}
            name={Routes.register}
            options={({navigation}) => ({
              title: false,
              headerStyle: {...loginStyles.headerStyle, height: top + 50},
              headerLeft: () => <Back navigation={navigation}/>,
              headerRight: () => <SignInButton navigation={navigation}/>,
            })}
          />
          <Stack.Screen
            component={ForgotPassword}
            name={Routes.forgotPassword}
            options={({navigation}) => ({
              title: false,
              headerStyle: {...loginStyles.headerStyle, height: top + 50},
              headerLeft: () => <Back navigation={navigation}/>,
            })}
          />
          <Stack.Screen
            component={NonUserTabNavigator}
            name={Routes.nonUserTab}
            options={{ headerShown: false }}
          />
        </Stack.Group>
        <Stack.Group screenOptions={{ presentation: "modal" }}>
          <Stack.Screen
            component={WelcomeWalkthrough}
            name={Routes.welcomeWalkthrough}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Group>
      </Stack.Navigator>
    )
  ) : (
    <Stack.Navigator
      initialRouteName={Routes.tabHome}
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
      }}
    >
      <Stack.Group>
        <Stack.Screen
          name={Routes.tabHome}
          component={TabNavigator}
          options={{ headerShown: false }}
        />
      </Stack.Group>
      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen
          component={CameraSettings}
          name={Routes.cameraSettings}
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          component={GeneralSettings}
          name={Routes.generalSettings}
          options={{
            headerLeft: (props) => <GeneralSettingsNavigatorLeft {...props} />,
            headerStyle: navigatorStyle.headerSettingsStyle,
            title: null,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          component={Walkthrough}
          name={Routes.walkthrough}
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
      </Stack.Group>
      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen
          component={MarketplaceDetail}
          name={Routes.marketplaceDetail}
          options={{
            headerStyle: navigatorStyle.headerStyle,
            headerTitleStyle: navigatorStyle.headerTitleStyle,
            headerTintColor: navigatorStyle.headerTintColor,
            headerTitleAlign: navigatorStyle.headerTitleAlign,
            headerTitle: () => <HeaderTitle />,
          }}
          listeners={({ navigation, route }) => ({
            focus: () => noInternetHandler(navigation, route),
          })}
        />
        <Stack.Screen
          component={MarketplaceReady}
          name={Routes.MarketplaceReady}
          options={{
            headerStyle: navigatorStyle.headerStyle,
            headerTitleAlign: navigatorStyle.headerTitleAlign,
            headerTitle: () => <HeaderTitle />,
            headerLeft: "",
          }}
          listeners={({ navigation, route }) => ({
            focus: () => noInternetHandler(navigation, route),
          })}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default MainNavigator;
