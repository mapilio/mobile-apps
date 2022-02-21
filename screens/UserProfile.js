import React, { useEffect, useState } from "react";
import { Animated, LogBox, ScrollView, View } from "react-native";
import { ProfileFeed, UserInfos } from "../components";
import { globalStyles } from "../styles/globalStyles";
import { fetchHandler, toastGenerator } from "../helper/helper";
import { useSelector } from "react-redux";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { RFValue } from "react-native-responsive-fontsize";
import {
  CustomText,
  CustomTextBold,
  CustomTextMedium,
} from "../highordercomponents";
import { SERVICE_URL } from "@env";
import { marketplaceReceivedStyles } from "../styles/marketplaceStyles";
import { Routes } from "../navigator/Routes";
import { ActivityIndicator } from "react-native-paper";

const UserProfile = ({ navigation }) => {
  const [listData, setListData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const { userInformation, isUploaded } = useSelector(
    (state) => state.getTokenReducer
  );
  const [paginationURL, setPaginationURL] = useState(
    `/api/user-uploads?options[parameters][user_id]=${userInformation.id}&options[limit]=10&page=1`
  );

  useEffect(() => {
    if (!isUploaded) {
      fetchNext();
    }
  }, []);

  const fetchNext = () => {
    fetchHandler({
      url: `${SERVICE_URL}${paginationURL}`,
    })
      .then((res) => {
        const newListData = [...listData, ...res.data];
        setListData(res.data !== null ? newListData : []);
        setLoading(false);
        setPaginationLoading(false);
        setPaginationURL(res.pagination.next_page_url);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (isUploaded) {
      fetchNext();
    }
  }, [isUploaded]);

  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  return (
    <View style={globalStyles.container}>
      <UserInfos />
      <ScrollView
        onScroll={({ nativeEvent }) => {
          if (isCloseToBottom(nativeEvent) && paginationURL) {
            setPaginationLoading(true);
            fetchNext();
          }
        }}
        scrollEventThrottle={400}
      >
        {loading ? (
          [0, 1, 2, 3].map((i) => (
            <SkeletonPlaceholder key={i}>
              <View
                style={{
                  height: RFValue(70),
                  width: "100%",
                  marginTop: RFValue(10),
                }}
              />
            </SkeletonPlaceholder>
          ))
        ) : listData ? (
          listData.map((data, index) => (
            <ProfileFeed
              key={`${data.id}${Math.random()}`}
              data={data}
              navigation={navigation}
            />
          ))
        ) : (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              marginTop: RFValue(60),
            }}
          >
            <CustomTextBold
              style={{
                fontSize: RFValue(16),
                color: "#000000",
                textAlign: "center",
              }}
            >
              No feed
            </CustomTextBold>
            <CustomText
              style={{
                fontSize: RFValue(14),
                color: "#4A4A4A",
                marginVertical: RFValue(10),
                textAlign: "center",
              }}
            >
              There are no feeds to display. You can contribute by starting the
              catch now.
            </CustomText>
            <CustomText
              style={marketplaceReceivedStyles.button}
              onPress={() => {
                navigation.navigate(Routes.camera);
              }}
            >
              Start Capture
            </CustomText>
          </View>
        )}
        {paginationLoading && (
          <ActivityIndicator
            style={{
              alignSelf: "center",
              textAlign: "center",
              marginVertical: RFValue(10),
            }}
            color={"#213348"}
          />
        )}
      </ScrollView>
    </View>
  );
};

export default UserProfile;
