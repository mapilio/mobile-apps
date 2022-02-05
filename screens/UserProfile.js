import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { ProfileFeed, UserInfos } from "../components";
import { globalStyles } from "../styles/globalStyles";
import { fetchHandler } from "../helper/helper";
import { useSelector } from "react-redux";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { RFValue } from "react-native-responsive-fontsize";
import { CustomTextMedium } from "../highordercomponents";
 

const UserProfile = ({ navigation }) => {
  const [listData, setListData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userInformation } = useSelector((state) => state.getTokenReducer);

  useEffect(() => {
    fetchHandler({
      url: `${process.env.SERVICE_URL}/api/user-uploads?options[parameters][user_id]=${userInformation.id}`,
    })
      .then((res) => {
        setListData(res.data !== null ? res.data : []);
        setLoading(false);
        setListData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

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
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <CustomTextMedium
              style={{ fontSize: RFValue(16), color: "#1AD971" }}
            >
              You have no feed.
            </CustomTextMedium>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default UserProfile;
