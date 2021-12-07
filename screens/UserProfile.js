import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { useSelector } from "react-redux";
import { UserFeed, UserInfos } from "../components";
import { globalStyles } from "../styles/globalStyles";

const UserProfile = ({ navigation }) => {
  const [listData] = useState(
    Array(20)
      .fill("")
      .map((_, i) => ({ key: `${i}`, text: `item #${i}` }))
  );

  return (
    <View style={globalStyles.container}>
      <UserInfos />
      <ScrollView>
        {listData.map((data, index) => (
          <UserFeed key={index} data={data} navigation={navigation} />
        ))}
      </ScrollView>
    </View>
  );
};

export default UserProfile;
