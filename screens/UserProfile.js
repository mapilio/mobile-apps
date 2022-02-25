import React, { useEffect, useState } from "react";
import { Animated, LogBox, Platform, ScrollView, View } from "react-native";
import { ProfileFeed, UserInfos } from "../components";
import { globalStyles } from "../styles/globalStyles";
import { fetchHandler } from "../helper/helper";
import { useSelector } from "react-redux";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { RFValue } from "react-native-responsive-fontsize";
import { CustomText, CustomTextBold } from "../highordercomponents";
import { SERVICE_URL } from "@env";
import { marketplaceReceivedStyles } from "../styles/marketplaceStyles";
import { Routes } from "../navigator/Routes";
import { ActivityIndicator } from "react-native-paper";
import DropDownPicker from "react-native-dropdown-picker";

const UserProfile = ({ navigation }) => {
  const [listData, setListData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingOrganization, setOrganizationLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState({
    organization_name: userInformation?.display_name,
    organization_username: userInformation?.username,
    id: userInformation?.id,
    type: "individual",
  });
  const { userInformation, isUploaded } = useSelector(
    (state) => state.getTokenReducer
  );
  const [selectedItem, setSelectedItem] = useState({
    organization_name: userInformation?.display_name,
    organization_username: userInformation?.username,
    id: userInformation?.id,
    type: "individual",
  });
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [items, setItems] = useState([
    {
      organization_name: userInformation?.display_name,
      organization_username: userInformation?.username,
      id: userInformation?.id,
      type: "individual",
    },
  ]);
  const [paginationURL, setPaginationURL] = useState(
    `/api/user-uploads?options[parameters][user_id]=${userInformation?.id}&options[limit]=10&page=1`
  );

  useEffect(() => {
    if (!isUploaded) {
      fetchNext();
    }
  }, []);

  useEffect(() => {
    if (selectedItem.type) {
      fetchNext(
        `/api/user-uploads?options[parameters][user_id]=${userInformation?.id}&options[limit]=10&page=1`
      );
    } else {
      fetchNext(
        `/api/function/organizations/organization/feedList?options[parameters][organization_key]=${selectedItem.organization_key}&options[limit]=10&page=1`
      );
    }
  }, [selectedItem]);

  useEffect(() => {
    setLoading(true);
    fetchHandler({
      url: `${SERVICE_URL}/api/function/organizations/organization/myOrganizations`,
    })
      .then((res) => {
        setLoading(false);
        res.data ? setItems([...items, ...res.data]) : setItems([]);
      })
      .catch((err) => {
        dispatch({
          type: "ALERT_TOAST_TOGGLE",
          payload: {
            open: true,
            text: "An error while fetching your organizations. Please try again.",
            color: getTheme().palette.button,
            cardcolor: "red",
            type: "error",
          },
        });
      });
  }, []);

  const fetchNext = (foreignUrl) => {
    if (foreignUrl &&  items.length >= 2) {
      setLoading(true);
    }
    fetchHandler({
      url: foreignUrl
        ? `${SERVICE_URL}${foreignUrl}`
        : `${SERVICE_URL}${paginationURL}`,
    })
      .then((res) => {
        if (res.data !== null) {
          let newListData;
          if (listData !== null) {
            newListData = [...listData, ...res.data];
          } else {
            newListData = res.data;
          }
          setListData(newListData);
          setLoading(false);
          setPaginationLoading(false);
          setPaginationURL(res.pagination.next_page_url);
        } else {
          setListData(null);
          setLoading(false);
        }
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
      {items.length >= 2 &&
        (Platform.OS === "ios" ? (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginBottom: RFValue(15),
              marginTop: RFValue(-20),
              zIndex: 9999999,
            }}
          >
            <DropDownPicker
              open={open}
              value={value}
              items={items}
              placeholder={"Select organization"}
              setOpen={setOpen}
              setValue={setValue}
              closeAfterSelecting
              onSelectItem={(item) => {
                setSelectedItem(item);
              }}
              loading={loadingOrganization}
              setItems={setItems}
              key={Math.random()}
              dropDownContainerStyle={{ zIndex: -1 }}
              CellRendererComponent={({ children, index, style, ...props }) => {
                const cellStyle = [
                  style,
                  {
                    zIndex: -1,
                    elevation: -1,
                  },
                ];

                return (
                  <View style={cellStyle} index={index} {...props}>
                    {children}
                  </View>
                );
              }}
              schema={{
                label: "organization_username",
                value: "organization_name",
                testID: "organization_key",
              }}
              style={{
                height: RFValue(30),
                backgroundColor: "#4A90E2",
                borderWidth: 0,
                zIndex: 999999999999,
              }}
              listItemLabelStyle={{
                color: "#000",
              }}
              textStyle={{
                color: "#FFFFFF",
              }}
              showArrowIcon={false}
            />
          </View>
        ) : (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginBottom: RFValue(15),
              marginTop: RFValue(-20),
            }}
          >
            <DropDownPicker
              open={open}
              value={value}
              items={items}
              placeholder={"Select organization"}
              setOpen={setOpen}
              setValue={setValue}
              closeAfterSelecting
              onSelectItem={(item) => {
                setSelectedItem(item);
              }}
              loading={loadingOrganization}
              setItems={setItems}
              key={Math.random()}
              schema={{
                label: "organization_username",
                value: "organization_name",
                testID: "organization_key",
              }}
              style={{
                height: RFValue(30),
                backgroundColor: "#4A90E2",
                borderWidth: 0,
              }}
              listItemLabelStyle={{
                color: "#000",
              }}
              textStyle={{
                color: "#FFFFFF",
              }}
              showArrowIcon={false}
            />
          </View>
        ))}
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
          listData.map((data) => (
            <ProfileFeed
              key={data.id}
              data={data}
              navigation={navigation}
              selectedOrganization={selectedItem.type}
              organizationKey={
                selectedItem.organization_key
                  ? selectedItem.organization_key
                  : 0
              }
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
        {paginationLoading && items.length >= 2 ? (
          <ActivityIndicator
            style={{
              alignSelf: "center",
              textAlign: "center",
              marginVertical: RFValue(10),
            }}
            color={"#213348"}
          />
        ) : null}
      </ScrollView>
    </View>
  );
};

export default UserProfile;
