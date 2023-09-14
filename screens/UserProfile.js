import { View } from "react-native";
import { globalStyles } from "../styles/globalStyles";
import React, { useEffect } from "react";
import { RFValue } from "react-native-responsive-fontsize";
import { FeedList, FocusAwareStatusBar } from "../components";
import { getUserInformation } from "../store/reducers/loginReducer/getUserInformation";
import { useDispatch } from "react-redux";


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
        paddingHorizontal: RFValue(0),
        paddingTop: 0,
      }}
    >
      <FocusAwareStatusBar barStyle="dark-content" translucent backgroundColor="#fff" />
      <FeedList />
    </View>
  );
};

export default UserProfile;
