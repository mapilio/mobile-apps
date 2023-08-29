import React, { useEffect } from "react";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import TabNavigator from "./TabNavigator";
import NetInfo from "@react-native-community/netinfo";
import { UPDATE_CONNECTION_STATUS } from "../store/actionsName";
import { useDispatch } from "react-redux";
import { Routes } from "./Routes";
import StackNavigator from "./StackNavigator";
import { getConfig, checkMaintenance } from "../util/helpers/general";

const Stack = createStackNavigator();

const MainNavigator = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const removeListener = NetInfo.addEventListener((state) => {
      dispatch({
        type: UPDATE_CONNECTION_STATUS,
        payload: {
          connectionStatus: state.isConnected,
          connectionType: state.type,
        },
      });
    });

    return () => removeListener();
  }, []);

  useEffect(() => {
    getConfig()
    checkMaintenance();
  }, []); 

  return (
      <Stack.Navigator
      screenOptions={{
        headerShown: false,
        ...TransitionPresets.SlideFromRightIOS,
      }}
    >
      <Stack.Screen name={Routes.tabNavigator} component={TabNavigator} />
      <Stack.Screen name={Routes.stackNavigator} component={StackNavigator} />
    </Stack.Navigator>
  );
};

export default MainNavigator;
