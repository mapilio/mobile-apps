import { useRef, useState } from "react";
import { FlatList, View, TouchableOpacity } from "react-native";
import { leaderStyles as styles } from "../../styles/leaderStyles";
import renderItem from "./RenderItem";
import AuthUserButton from "./AuthUserButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import {
  fetchLeaderOrganizations,
  fetchLeaderUsers,
  resetLeaderboard,
} from "../../store/actions/leaderboard";

const LeadersList = ({ leaders, authUserIndex, listType }) => {
  const { bottom } = useSafeAreaInsets();
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
        dispatch(fetchLeaderOrganizations());
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
        onRefresh={() => {
          refreshLeaderboard();
        }}
        refreshing={isRefresh}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        renderItem={({ item, index }) =>
          renderItem({ item, index }, authUserIndex, listType)
        }
      />
      {AuthUserInLeadersAndVisible ? (
        <TouchableOpacity
          style={{ ...styles.authUserInList, marginBottom: bottom }}
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
