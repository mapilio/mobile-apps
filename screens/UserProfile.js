import React, {useEffect, useState} from "react";
import {StyleSheet, View, ScrollView, ActivityIndicator, Platform, RefreshControl} from "react-native";
import {globalStyles} from "../styles/globalStyles";
import {ProfileFeed, UserInfos} from "../components";
import {useSelector} from "react-redux";
import {fetchHandler} from "../helper/helper";
import Config from "react-native-config";
import {RFValue} from "react-native-responsive-fontsize";
import DropDownPicker from "react-native-dropdown-picker";
import {CustomText, CustomTextBold} from "../highordercomponents";
import {marketplaceReceivedStyles} from "../styles/marketplaceStyles";
import {Routes} from "../navigator/Routes";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

const UserProfile = ({navigation}) => {
  const {userInformation} = useSelector((state) => state.getTokenReducer);
  const [loading, setLoading] = useState(true);
  const [isOrganization, setOrganization] = useState(true);
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrganization, setSelectedOrganization] = useState({type: "individual"});
  const [feedData, setFeedData] = useState([]);
  const [gettingData, setGettingData] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!!userInformation) {
      const {id, display_name, username} = userInformation;

      const initialOrganization = {
        id: id,
        organization_name: display_name,
        organization_username: username,
        type: "individual"
      };

      setOrganizations([initialOrganization])
      setSelectedOrganization(initialOrganization)
    }
  }, []);


  useEffect(() => {
    fetchHandler({url: `${Config.SERVICE_URL}/api/function/organizations/organization/myOrganizations`}).then(({data}) => {
      data !== null && setOrganizations(prev => [...prev, ...data])
    })
  }, [userInformation]);

  const getData = () => {
    return new Promise((resolve) => {
      const url = selectedOrganization.type
        ? `/api/user-uploads?options[parameters][user_id]=${userInformation?.id}&options[limit]=10&page=${page}`
        : `/api/function/organizations/organization/feedList?options[parameters][organization_key]=${selectedOrganization.organization_key}&options[limit]=10&page=${page}`

      if (page <= totalPage && !gettingData) {
        fetchHandler({url: `${Config.SERVICE_URL}${url}`,}).then(({data, pagination}) => {
          if (data) {
            setTotalPage(pagination ? pagination.last_page : 1)
            setFeedData(prev => page === 1 ? [...data] : [...prev, ...data])
          }
        }).finally(() => {
          setPage(prev => prev + 1)
          setGettingData(false)
          resolve()
        })
        setGettingData(true)
      } else {
        resolve()
      }
    })
  }

  useEffect(() => {
    if (Object.entries(selectedOrganization).length) {
      setLoading(true)
      setPage(1)
      setLoading(true)
      setOrganization(selectedOrganization.type === "individual")
      setFeedData([])
      getData().then(() => setLoading(false))
    }
  }, [selectedOrganization])

  useEffect(() => {
    page === 1 && getData()
  }, [page]);

  const handleRefresh = () => {
    setRefreshing(true)
    getData().finally(() => setRefreshing(false))
  }

  return (
    <View style={globalStyles.container}>
      <UserInfos isOrganization={isOrganization} selectedItem={selectedOrganization}/>
      {
        organizations.length >= 2 &&
        <OrganizationSelector items={organizations} onSelectItem={setSelectedOrganization}/>
      }
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh}/>}>
        <FeedList
          data={feedData}
          navigation={navigation}
          selectedOrganization={selectedOrganization}
          loading={loading}
          isLoadingData={gettingData}
          onLoad={getData}
        />
      </ScrollView>
    </View>
  )
};

const OrganizationSelector = ({items, onSelectItem}) => {
  const {userInformation} = useSelector((state) => state.getTokenReducer);
  const [open, setOpen] = useState(false);

  const [value, setValue] = useState({
    organization_name: userInformation?.display_name,
    organization_username: userInformation?.username,
    id: userInformation?.id,
    type: "individual",
  });

  return (
    <View style={[styles.dropdownWrapper, Platform.OS === "ios" && styles.iosDropdownWrapper]}>
      <DropDownPicker
        open={open}
        setOpen={setOpen}
        value={value}
        setValue={setValue}
        showArrowIcon={false}
        items={items}
        placeholder={"Select organization"}
        closeAfterSelecting
        style={styles.dropdown}
        listItemLabelStyle={styles.listItemLabelStyle}
        textStyle={styles.dropdownTextStyle}
        dropDownContainerStyle={styles.dropDownContainerStyle}
        schema={{label: "organization_username", value: "organization_name", testID: "organization_key"}}
        onSelectItem={(item) => onSelectItem(item)}
        CellRendererComponent={({children, index, style, ...props}) => {
          const cellStyle = [style, {zIndex: -1, elevation: -1},];
          return <View style={cellStyle} index={index} {...props}>{children}</View>;
        }}
      >
      </DropDownPicker>
    </View>
  )
}

const FeedList = ({data, navigation, selectedOrganization, loading, isLoadingData, onLoad}) => {
  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };
  const scrollHandle = ({nativeEvent}) => {
    if (isCloseToBottom(nativeEvent)) {onLoad()}
  }

  return loading ? (
    [0, 1, 2, 3].map((i) => <SkeletonPlaceholder key={i}><View style={styles.skeletonItem}/></SkeletonPlaceholder>)
  ) : (
    <ScrollView onScroll={scrollHandle} scrollEventThrottle={400}>
      {data.length ? (
        data.map(item => {
          return (
            <ProfileFeed
              key={item.id}
              data={item}
              navigation={navigation}
              selectedOrganization={selectedOrganization.type}
              organizationKey={selectedOrganization.organization_key ? selectedOrganization.organization_key : 0}
            />
          )
        })
      ) : (
        <View style={styles.noFeedWrapper}>
          <CustomTextBold style={styles.noFeedTitle}>
            No feed
          </CustomTextBold>
          <CustomText style={styles.noFeedDescription}>
            There are no feeds to display. You can contribute by starting the catch now.
          </CustomText>
          <CustomText
            style={marketplaceReceivedStyles.button}
            onPress={() => navigation.navigate(Routes.camera)}>
            Start Capture
          </CustomText>
        </View>
      )}

      <ActivityIndicator animating={isLoadingData} size={"large"}/>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  dropdownWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: RFValue(20),
    marginTop: RFValue(-20),
  },
  iosDropdownWrapper: {zIndex: 1},
  dropdown: {
    height: RFValue(30),
    backgroundColor: "#4A90E2",
    borderWidth: 0,
  },
  listItemLabelStyle: {color: "#000"},
  dropdownTextStyle: {color: '#FFF'},
  dropDownContainerStyle: {zIndex: 1},
  noFeedWrapper: {
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    marginTop: RFValue(60),
  },
  noFeedTitle: {
    fontSize: RFValue(16),
    color: "#000000",
    textAlign: "center",
  },
  noFeedDescription: {
    fontSize: RFValue(14),
    color: "#4A4A4A",
    marginVertical: RFValue(10),
    textAlign: "center"
  },
  skeletonItem: {
    height: RFValue(70),
    width: "100%",
    marginTop: RFValue(10)
  }
})

export default UserProfile;
