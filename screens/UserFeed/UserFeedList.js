import { View, StyleSheet } from "react-native";
import {
  FeedList,
  FocusAwareStatusBar,
} from "../../components";
import { api } from "../../util/helpers/api";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const UserFeedList = ({ route }) => {
  const { userID } = route.params;
  const [userDetails, setUserDetails] = useState(null);
  const { t } = useTranslation("profile");

  const getUserDetails = () => {
    api
      .get(`/api/search-user?options[parameters][id]=${userID}`)
      .then((res) => {
        if (res.data && Object.keys(res.data).length > 0) {
          setUserDetails(res.data[0]);
        }
      })
      .catch(() => {
        toast.show(t("fetch_error"), {
          type: "error",
        });
        setUserDetails(null);
      });
  };

  useEffect(() => {
    getUserDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userID]);

  return (
    <View style={styles.container}>
       <FocusAwareStatusBar
        translucent={true}
        barStyle="dark-content"
        backgroundColor={"transparent"}
      />
      {userDetails &&
        <View style={styles.container}>
          <FocusAwareStatusBar barStyle="dark-content" backgroundColor="#fff" />
          <FeedList userDetails={userDetails} />
        </View>}
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
