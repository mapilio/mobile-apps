import { useRef, useState } from "react";
import { FlatList, View, TouchableOpacity } from "react-native";
import { leaderStyles as styles } from "../../styles/leaderStyles";
import renderItem from "./RenderItem";
import AuthUserButton from "./AuthUserButton";
import { useDispatch, useSelector } from "react-redux";
import { fetchLeaderUsers, fetchLeaderUsersWeek, fetchLeaderUsersMonth } from "../../store/actions/leaderboard";
import { RFValue } from "react-native-responsive-fontsize";
import { vibrate } from "../../util/helpers";
import InfoBox from "../InfoBox/InfoBox";
import { Trans } from "react-i18next";
import { CustomTextBold } from "../../highordercomponents";
import WinnersBox from "./WinnersBox";
import i18next from "i18next";

const LeadersList = ({ leaders, authUserIndex, listType, usersType }) => {
  const dispatch = useDispatch();

  const [isAuthUserVisible, setIsAuthUserVisible] = useState(false);
  const [isRefresh, setIsRefresh] = useState(false);
  const flatListRef = useRef(null);

  const challengeWinners = useSelector(
    (state) => state.leaderboardReducer.challengeWinners
  );

  const {config:{isInfoBoxOpen, infoBoxDescTR, infoBoxDescEN, challengeDates}} = useSelector((state) => state.generalReducer);

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
      if (usersType === "all") {
        dispatch(fetchLeaderUsers());
      } else if (usersType === "week") {
        dispatch(fetchLeaderUsersWeek());
      } else if (usersType === "month") {
        dispatch(fetchLeaderUsersMonth());
      } else {
        dispatch(fetchLeaderUsers(challengeDates[0], challengeDates[1], true));
      }
      setIsRefresh(false);
    }, 500);
  };

  const InfoHeader = () => {
    if (listType === "challange_users") {
     if(isInfoBoxOpen) {
        return (
          <View style={{ paddingVertical: RFValue(10) }}>
            <InfoBox
              type="info"
              content={
                <Trans
                  defaults={i18next.language === "en" ? infoBoxDescEN : infoBoxDescTR}
                  components={[<CustomTextBold />]}
                />
              }
            />
          </View>
        );
      }else if (challengeWinners.is_calculated && challengeWinners.leaderboard.length > 0) {
        return <WinnersBox winners={challengeWinners.leaderboard} />;
      } else{
        return null
      }
    }
  }

  return (
    <View style={styles.subScreens}>
      <FlatList
        style={{paddingHorizontal:RFValue(10)}}
        ref={flatListRef}
        data={leaders}
        extraData={authUserIndex}
        keyExtractor={(_, index) => index.toString()}
        onRefresh={refreshLeaderboard}
        refreshing={isRefresh}
        ItemSeparatorComponent={() => <View style={styles.seperator} />}
        initialNumToRender={30}
        onScrollToIndexFailed={() => {
          flatListRef.current.scrollToEnd();
        }}
        ListHeaderComponent={() => <InfoHeader />}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        renderItem={({ item, index }) =>
          renderItem({ item, index }, authUserIndex, listType)
        }
        ListFooterComponent={() =>
          authUserIndex > 0 && <View style={{ height: 90 }} />
        }
      />
      {AuthUserInLeadersAndVisible ? (
        <TouchableOpacity
          style={{ ...styles.authUserInList, marginBottom: RFValue(21), paddingHorizontal:RFValue(10) }}
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
