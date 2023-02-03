import {createStackNavigator} from "@react-navigation/stack";
import {Routes} from "../Routes";
import userUpload from "../../screens/UserUpload";
import {DeleteNavigationRight, SequenceDetailTitle, SequenceNavigatorLeft} from "./navigatorbars";
import {navigatorStyle} from "../../styles/navigatorStyle";
import React from "react";
import {CaptureCompleted, UploadCompleted, UserSequence, UserSequenceDetail} from "../../screens";
import {useTranslation} from "react-i18next";

const Stack = createStackNavigator()

const UploadNavigator = () => {
  const {t} = useTranslation("upload");

  return (
    <Stack.Navigator screenOptions={{
      headerShown: true,
      headerStyle: navigatorStyle.headerStyle,
      headerTitleStyle: navigatorStyle.headerTitleStyle,
      headerTintColor: navigatorStyle.headerTintColor,
      headerTitleAlign: navigatorStyle.headerTitleAlign,
      headerLeft: false,
    }}>
      <Stack.Screen name={Routes.upload} component={userUpload} options={{
        title: t("upload"),
        cardStyle: {backgroundColor: "#FFF"}
      }}/>

      <Stack.Screen name={Routes.sequences} component={UserSequence} options={{
        headerLeft: (props) => (<SequenceNavigatorLeft{...props} route backRoute={Routes.upload}/>),
      }} />

      <Stack.Screen name={Routes.sequenceDetail} component={UserSequenceDetail} options={{
        headerLeft: (props) => (<SequenceNavigatorLeft{...props} route backRoute={Routes.sequences}/>),
        headerRight: (props) => (<DeleteNavigationRight {...props} />),
        title: <SequenceDetailTitle />,
        headerStyle: navigatorStyle.headerStyle,
        headerTitleStyle: navigatorStyle.headerTitleStyle,
        headerTintColor: navigatorStyle.headerTintColor,
        headerTitleAlign: navigatorStyle.headerTitleAlign,
      }} />

      <Stack.Group screenOptions={{presentation: "card", gestureEnabled: false, headerShown: false}}>
        <Stack.Screen name={Routes.uploadCompleted} component={UploadCompleted}/>
        <Stack.Screen name={Routes.captureCompleted} component={CaptureCompleted}/>
      </Stack.Group>
    </Stack.Navigator>
  )
}

export default UploadNavigator;
