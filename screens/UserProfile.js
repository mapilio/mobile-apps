import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { ProfileFeed, UserInfos } from "../components";
import { globalStyles } from "../styles/globalStyles";
import { fetchHandler } from "../helper/helper";
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

const UserProfile = ({ navigation }) => {
  const [listData, setListData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userInformation, isUploaded } = useSelector(
    (state) => state.getTokenReducer
  );

  useEffect(() => {
    if (!isUploaded) {
      fetchHandler({
        url: `${SERVICE_URL}/api/user-uploads?options[parameters][user_id]=${userInformation.id}`,
      })
        .then((res) => {
          setListData(res.data !== null ? res.data : []);
          setLoading(false);
          setListData(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  useEffect(() => {
    if (isUploaded) {
      fetchHandler({
        url: `${SERVICE_URL}/api/user-uploads?options[parameters][user_id]=${userInformation.id}`,
      })
        .then((res) => {
          dispatch({ type: IS_UPLOADED, payload: false });
          setListData(res.data !== null ? res.data : []);
          setLoading(false);
          setListData(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [isUploaded]);

  return (
    <View style={globalStyles.container}>
      <UserInfos />
      <ScrollView>
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
            <ProfileFeed key={index} data={data} navigation={navigation} />
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
      </ScrollView>
    </View>
  );
};

export default UserProfile;
