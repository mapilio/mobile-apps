import {createStackNavigator} from "@react-navigation/stack";
import {Routes} from "../Routes";
import {AppCamera, CameraSettings, GeneralSettings, Walkthrough} from "../../screens";
import {navigatorStyle} from "../../styles/navigatorStyle";
import React from "react";
import {GeneralSettingsNavigatorLeft} from "./navigatorbars";

const Stack = createStackNavigator();

const CameraNavigator = () => {
  const generalSettingsOptions = {
    headerLeft: (props) => <GeneralSettingsNavigatorLeft {...props} />,
    headerStyle: navigatorStyle.headerSettingsStyle,
    title: null,
    headerShown: true,
  }

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name={Routes.camera} component={AppCamera}/>

      <Stack.Group screenOptions={{presentation: "modal", gestureEnabled: false}}>
        <Stack.Screen name={Routes.walkthrough} component={Walkthrough}/>
        <Stack.Screen name={Routes.cameraSettings} component={CameraSettings}/>
        <Stack.Screen name={Routes.generalSettings} component={GeneralSettings} options={generalSettingsOptions}/>
      </Stack.Group>
    </Stack.Navigator>
  )
}

export default CameraNavigator;
