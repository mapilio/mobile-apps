import {createStackNavigator} from "@react-navigation/stack";
import {Routes} from "../Routes";
import userUpload from "../../screens/UserUpload";
import {DeleteNavigationRight, SequenceDetailTitle, SequenceNavigatorLeft, UploadNavigatorRight} from "./navigatorbars";
import {navigatorStyle} from "../../styles/navigatorStyle";
import React from "react";
import {UploadCompleted, UserSequence, UserSequenceDetail} from "../../screens";
import {useTranslation} from "react-i18next";

const Stack = createStackNavigator()

const UploadNavigator = () => {
  const {t} = useTranslation("upload");

  return (
    <Stack.Navigator screenOptions={{
      headerShown: true,
      headerRight: () => <UploadNavigatorRight/>,
      headerStyle: navigatorStyle.headerStyle,
      headerTitleStyle: navigatorStyle.headerTitleStyle,
      headerTintColor: navigatorStyle.headerTintColor,
      headerTitleAlign: navigatorStyle.headerTitleAlign,
      headerLeft: false,
    }}>
      <Stack.Screen name={Routes.upload} component={userUpload} options={{
        title: t("upload")
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
      </Stack.Group>
    </Stack.Navigator>
  )
}

export default UploadNavigator;
