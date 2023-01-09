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
import {ProfileNavigatorRight, ProfileSettingsNavigatorLeft} from "../../navigator/partials/navigatorbars";
import {SequenceNavigatorLeft} from "./navigatorbars";
import {RFValue} from "react-native-responsive-fontsize";
import {Back} from "../../components/Login";
import {useTranslation} from "react-i18next";

const Stack = createStackNavigator();

const screenOptions = {
  headerStyle: navigatorStyle.headerStyle,
  headerTitleStyle: navigatorStyle.headerTitleStyle,
  headerTintColor: navigatorStyle.headerTintColor,
  headerTitleAlign: navigatorStyle.headerTitleAlign,
}

const ProfileNavigator = ({navigation}) => {
  const {t} = useTranslation("navigation");

    return (
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen name={Routes.profile} component={UserProfile} options={{
          headerLeft: () => <Back />,
          headerRight: () => <ProfileNavigatorRight/>,
          title: t("profile")
        }}/>

        <Stack.Screen name={Routes.profileSettings} component={ProfileSettings} options={{
          headerStyle: {backgroundColor: '#FFF', elevation: 0, shadowOpacity: 0, borderBottomWidth: 0},
          cardStyle: {backgroundColor: '#FFF'},
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
          headerStyle: {backgroundColor: '#FFF', elevation: 0, shadowOpacity: 0, borderBottomWidth: 0},
          cardStyle: {backgroundColor: '#FFF'},
          headerLeft: () => <ProfileSettingsNavigatorLeft/>,
          title: false
        }}/>

        <Stack.Screen name={Routes.profileEdit} component={ProfileEdit} options={{
          headerStyle: {backgroundColor: '#FFF', elevation: 0, shadowOpacity: 0, borderBottomWidth: 0},
          cardStyle: {backgroundColor: '#FFF'},
          headerLeft: () => <ProfileSettingsNavigatorLeft/>,
          title: t("profile_edit"),
          headerTitleStyle: {color: '#333333', fontSize: RFValue(18)}
        }}/>

        <Stack.Screen name={Routes.language} component={Language} options={{
          cardStyle: {backgroundColor: '#FFF'},
          headerStyle: {backgroundColor: '#FFF', elevation: 0, shadowOpacity: 0, borderBottomWidth: 0},
          headerLeft: () => <ProfileSettingsNavigatorLeft/>,
        }}/>
      </Stack.Navigator>
    )



}

export default ProfileNavigator;
