import { View, StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { FeedList, UserInfos } from "../../components";

const UserFeedList = ({ route }) => {
  const { userDetails } = route.params;
  return (
    <View style={styles.container}>
      <UserInfos userDetails={userDetails} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: RFValue(20),
    paddingTop: RFValue(20),
    backgroundColor: "#fff",
  },
});

export default UserFeedList;
