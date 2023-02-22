import {Dimensions, View} from "react-native";
import {globalStyles} from "../styles/globalStyles";
import React, {useEffect} from "react";
import {RFValue} from "react-native-responsive-fontsize";
import {FeedList, FocusAwareStatusBar, UserInfos} from "../components";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";
import {getUserInformation} from "../store/reducers/loginReducer/getUserInformation";
import {useDispatch} from "react-redux";

const Tab = createMaterialTopTabNavigator();

const UserProfile = () => {
  const {bottom} = useSafeAreaInsets();
  const {width} = Dimensions.get("window")
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserInformation());
  }, []);

  return (
    <View style={{...globalStyles.container, paddingBottom: bottom, paddingHorizontal: RFValue(20)}}>
      <FocusAwareStatusBar barStyle="dark-content"/>
      <UserInfos />

      <Tab.Navigator initialRouteName={'Feed'} sceneContainerStyle={{backgroundColor: '#FFF'}}
      >
        <Tab.Screen name={'Feed'} component={FeedList} options={{
          tabBarIndicatorStyle: {height: RFValue(2), color:"#0056F1"},
          tabBarItemStyle: {width: (width / 2) - RFValue(20)},
          tabBarLabelStyle: {fontSize: RFValue(14), fontFamily:"Poppins-SemiBold"},
        }}
        />
      </Tab.Navigator>
    </View>
  )
}

export default UserProfile;
