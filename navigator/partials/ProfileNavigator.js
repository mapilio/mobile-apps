import {createStackNavigator} from "@react-navigation/stack";
import {
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

const Stack = createStackNavigator();

const screenOptions = {
  headerStyle: navigatorStyle.headerStyle,
  headerTitleStyle: navigatorStyle.headerTitleStyle,
  headerTintColor: navigatorStyle.headerTintColor,
  headerTitleAlign: navigatorStyle.headerTitleAlign,
}

const ProfileNavigator = ({navigation}) => {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name={Routes.profile} component={UserProfile} options={{
        headerRight: () => <ProfileNavigatorRight/>,
      }}/>
      <Stack.Screen name={Routes.profileSettings} component={ProfileSettings} options={() => ({
        headerStyle: {backgroundColor: '#FFF', elevation: 0, shadowOpacity: 0, borderBottomWidth: 0},
        cardStyle: {backgroundColor: '#FFF'},
        headerLeft: () => <ProfileSettingsNavigatorLeft/>,
        title: false
      })}/>

      <Stack.Screen name={Routes.profileSequence} component={ProfileSequence} options={{
        title: "Your uploads",
        headerLeft: (props) => <SequenceNavigatorLeft {...props} navigation={navigation} backRoute={Routes.profile}/>,
      }}/>

      <Stack.Screen name={Routes.feedDetail} component={ProfileUploadDetail} options={{
        title: "Upload detail",
        headerLeft: (props) => <SequenceNavigatorLeft {...props} navigation={navigation} backRoute={Routes.sequences}/>,
      }}/>

      <Stack.Screen name={Routes.webview} component={WebviewScreen} options={() => ({
        headerStyle: {backgroundColor: '#FFF', elevation: 0, shadowOpacity: 0, borderBottomWidth: 0},
        cardStyle: {backgroundColor: '#FFF'},
        headerLeft: () => <ProfileSettingsNavigatorLeft/>,
        title: false
      })}/>

      <Stack.Screen name={Routes.profileEdit} component={ProfileEdit} options={{
        headerStyle: {backgroundColor: '#FFF', elevation: 0, shadowOpacity: 0, borderBottomWidth: 0},
        cardStyle: {backgroundColor: '#FFF'},
        headerLeft: () => <ProfileSettingsNavigatorLeft/>,
        title: 'Profile Edit',
        headerTitleStyle: {color: '#333333', fontSize: RFValue(18)}
      }}/>
    </Stack.Navigator>
  )
}

export default ProfileNavigator;
