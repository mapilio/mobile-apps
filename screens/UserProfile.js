import React from "react";
import { View } from "react-native";
import {UserInfos} from "../components";
import { globalStyles } from "../styles/globalStyles";
import {List} from "../components/Uploads";

const UserProfile = ({ navigation }) => {
  return (
    <View style={globalStyles.container}>
        <UserInfos />
        <List navigation={navigation} />
    </View>
  );
};

export default UserProfile;
