import {Dimensions, View} from "react-native";
import {globalStyles} from "../styles/globalStyles";
import React from "react";
import {RFValue} from "react-native-responsive-fontsize";
import {FeedList, FocusAwareStatusBar, UserInfos} from "../components";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";

const Tab = createMaterialTopTabNavigator();

const UserProfile = () => {
  const {bottom} = useSafeAreaInsets();
  const {width} = Dimensions.get("window")

  return (
    <View style={{...globalStyles.container, paddingBottom: bottom, paddingHorizontal: RFValue(20)}}>
      <FocusAwareStatusBar barStyle="dark-content"/>
      <UserInfos />

      <Tab.Navigator initialRouteName={'Feed'} sceneContainerStyle={{backgroundColor: '#FFF'}}>
        <Tab.Screen name={'Feed'} component={FeedList} options={{
          tabBarIndicatorStyle: {height: RFValue(2)},
          tabBarItemStyle: {width: (width / 2) - RFValue(20)},
        }}
        />
      </Tab.Navigator>
    </View>
  )
}

export default UserProfile;
