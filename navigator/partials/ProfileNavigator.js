import {createStackNavigator} from "@react-navigation/stack";
import {
  Language,
  ProfileEdit,
  ProfileSequence,
  ProfileSettings,
  ProfileUploadDetail,
  UserProfile,
  WebviewScreen
} from "../../screens";
import {Routes} from "../Routes";
import {navigatorStyle} from "../../styles/navigatorStyle";
import React from "react";
import {ProfileNavigatorRight, ProfileSettingsNavigatorLeft, SequenceNavigatorLeft} from "./navigatorbars";
import {useTranslation} from "react-i18next";
import {BackButton} from "../../components";
import DeleteAccount from "../../screens/Profile/DeleteAccount";

const Stack = createStackNavigator();

const screenOptions = {
  headerStyle: navigatorStyle.headerStyle,
  headerTitleStyle: navigatorStyle.headerTitleStyle,
  headerTintColor: navigatorStyle.headerTintColor,
  headerTitleAlign: navigatorStyle.headerTitleAlign,
  cardStyle: navigatorStyle.cardStyle,
}

const ProfileNavigator = ({navigation}) => {
  const {t} = useTranslation("navigation");

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name={Routes.profile} component={UserProfile} options={{
        headerLeft: () => <BackButton title={"go_map"}/>,
        headerRight: () => <ProfileNavigatorRight/>,
        title: t("profile"),
      }}/>

      <Stack.Screen name={Routes.profileSettings} component={ProfileSettings} options={{
        headerLeft: () => <ProfileSettingsNavigatorLeft/>,
        title: false
      }}/>

      <Stack.Screen name={Routes.profileSequence} component={ProfileSequence} options={{
        title: t("your_uploads"),
        headerLeft: (props) => <SequenceNavigatorLeft {...props} navigation={navigation} backRoute={Routes.profile}/>,
      }}/>

      <Stack.Screen name={Routes.feedDetail} component={ProfileUploadDetail} options={{
        title: t("upload_detail"),
        headerLeft: (props) => <SequenceNavigatorLeft {...props} navigation={navigation} backRoute={Routes.sequences}/>,
      }}/>

      <Stack.Screen name={Routes.webview} component={WebviewScreen} options={{
        headerLeft: () => <ProfileSettingsNavigatorLeft/>,
        title: false
      }}/>

      <Stack.Screen name={Routes.profileEdit} component={ProfileEdit} options={{
        headerLeft: () => <ProfileSettingsNavigatorLeft/>,
        title: t("profile_edit"),
      }}/>

      <Stack.Screen name={Routes.language} component={Language} options={{
        headerLeft: () => <ProfileSettingsNavigatorLeft/>,
      }}/>

      <Stack.Screen name={Routes.deleteAccount} component={DeleteAccount} options={{
        headerLeft: () => <ProfileSettingsNavigatorLeft/>,
        title: t("delete_account"),
      }}/>

    </Stack.Navigator>
  )
}

export default ProfileNavigator;
