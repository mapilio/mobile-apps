import { View, StyleSheet } from "react-native";
import { FeedList, UserInfos } from "../../components";

const UserFeedList = ({ route }) => {
  const { userDetails } = route.params;
  return (
    <View style={styles.container}>
      <UserInfos userDetails={userDetails} />
      <FeedList userDetails={userDetails} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default UserFeedList;
