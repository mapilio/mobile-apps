import React from "react";
import { ScrollView, View } from "react-native";
import {UserFeed, UserInfos, Walkthougher} from "../components";
import { globalStyles } from "../styles/globalStyles";

const UserProfile = ({ navigation }) => {
  return (
    <ScrollView>
      <View style={globalStyles.container}>
        <UserInfos />
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
          <UserFeed key={item} navigation={navigation} />
        ))}
      </View>
      <Walkthougher mode={"manual"} />
    </ScrollView>
  );
};

export default UserProfile;
