import React, {useEffect} from "react";
import {createStackNavigator} from "@react-navigation/stack";
import TabNavigator from "./TabNavigator";
import {AuthNavigator} from "./partials";
import NetInfo from "@react-native-community/netinfo";
import {UPDATE_CONNECTION_STATUS} from "../store/actionsName";
import {useDispatch} from "react-redux";

const Stack = createStackNavigator();

const MainNavigator = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const removeListener = NetInfo.addEventListener((state) => {
      dispatch({
        type: UPDATE_CONNECTION_STATUS,
        payload: {connectionStatus: state.isConnected, connectionType: state.type}
      });
    });

    return () => removeListener();
  }, []);

  return (
    <Stack.Navigator screenOptions={{headerShown: false}} >
      <Stack.Screen name={"Tabs"} component={TabNavigator}/>
      <Stack.Screen name={"Auth"} component={AuthNavigator}/>
    </Stack.Navigator>
  )
};

export default MainNavigator;
