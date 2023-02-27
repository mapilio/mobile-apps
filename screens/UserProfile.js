import { View } from "react-native";
import { globalStyles } from "../styles/globalStyles";
import React, { useEffect } from "react";
import { RFValue } from "react-native-responsive-fontsize";
import { FeedList, FocusAwareStatusBar, UserInfos } from "../components";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { getUserInformation } from "../store/reducers/loginReducer/getUserInformation";
import { useDispatch } from "react-redux";

const Tab = createMaterialTopTabNavigator();

const UserProfile = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserInformation());
  }, []);

  return (
    <View
      style={{
        ...globalStyles.container,
        paddingBottom: 0,
        paddingHorizontal: RFValue(6),
        paddingTop: RFValue(34),
      }}
    >
      <FocusAwareStatusBar barStyle="dark-content" />
      <UserInfos />
      <View style={{ height: RFValue(20) }} />
      <FeedList />
    </View>
  );
};

export default UserProfile;
