import { useRef, useState } from "react";
import { FlatList, View, TouchableOpacity } from "react-native";
import { leaderStyles as styles } from "../../styles/leaderStyles";
import renderItem from "./RenderItem";
import AuthUserButton from "./AuthUserButton";
import { useDispatch } from "react-redux";
import {
  fetchLeaderUsers,
} from "../../store/actions/leaderboard";
import { RFValue } from "react-native-responsive-fontsize";
import { vibrate } from "../../util/helpers";

const LeadersList = ({ leaders, authUserIndex, listType }) => {
  const dispatch = useDispatch();

  const [isAuthUserVisible, setIsAuthUserVisible] = useState(false);
  const [isRefresh, setIsRefresh] = useState(false);
  const flatListRef = useRef(null);

  const onViewableItemsChanged = ({ viewableItems }) => {
    const isAuthUserExistInVisibleIndex =
      viewableItems.filter((item) => {
        return item.index === authUserIndex;
      }).length > 0;

    isAuthUserExistInVisibleIndex
      ? setIsAuthUserVisible(false)
      : setIsAuthUserVisible(true);
  };

  const viewabilityConfigCallbackPairs = useRef([{ onViewableItemsChanged }]);
  const scrollToIndex = () => {
    vibrate("light")
    flatListRef.current.scrollToIndex({ index: authUserIndex });
  };

  const AuthUserInLeadersAndVisible = authUserIndex > -1 && isAuthUserVisible;
  const authUser = leaders[authUserIndex];

  const refreshLeaderboard = () => {
    setIsRefresh(true);
    setTimeout(() => {
      if (listType === "users") {
        dispatch(fetchLeaderUsers());
      } else {
        dispatch(fetchLeaderUsers("01-03-2023", "31-05-2023"));
      }
      setIsRefresh(false);
    }, 500);
  };

  return (
    <View style={styles.subScreens}>
      <FlatList
        ref={flatListRef}
        data={leaders}
        keyExtractor={(_, index) => index.toString()}
        onRefresh={refreshLeaderboard}
        refreshing={isRefresh}
        ItemSeparatorComponent={() => <View style={styles.seperator} />}
        initialNumToRender={30}
        onScrollToIndexFailed={() => {
          flatListRef.current.scrollToEnd();
        }}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        renderItem={({ item, index }) =>
          renderItem({ item, index }, authUserIndex, listType)
        }
        ListFooterComponent={() => (
          authUserIndex > 0 && <View style={{ height: 90 }} />
        )}
      />
      {AuthUserInLeadersAndVisible ? (
        <TouchableOpacity
          style={{ ...styles.authUserInList, marginBottom: RFValue(21) }}
          onPress={scrollToIndex}
        >
          <AuthUserButton
            onPress={scrollToIndex}
            authUser={authUser}
            displayName={authUser.display_name}
            rankIndex={authUserIndex}
          />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default LeadersList;
