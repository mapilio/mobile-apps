import {ActivityIndicator, FlatList, Platform, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {globalStyles} from "../styles/globalStyles";
import FocusAwareStatusBar from "../components/FocusAwareStatusBar";
import React, {useEffect, useState} from "react";
import {RFValue} from "react-native-responsive-fontsize";
import {ProfileFeed, UserInfos} from "../components";
import {fetchHandler} from "../helper/helper";
import Config from "react-native-config";
import {useSelector} from "react-redux";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {CustomText, CustomTextBold} from "../highordercomponents";
import {marketplaceReceivedStyles} from "../styles/marketplaceStyles";
import {Routes} from "../navigator/Routes";
import {useNavigation} from "@react-navigation/native";
import {useTranslation} from "react-i18next";
import DropDownPicker from "react-native-dropdown-picker";

const SkeletonList = () => (
  [...Array(6)].map((_v, i) => (
    <SkeletonPlaceholder key={i}><View style={styles.skeletonItem}/></SkeletonPlaceholder>
  ))
)

const EmptyComponent = () => {
  const navigation = useNavigation();
  const {t} = useTranslation("profile")

  return (
    <View style={styles.noFeedWrapper}>
      <CustomTextBold style={styles.noFeedTitle}>{t("no_feed")}</CustomTextBold>
      <CustomText style={styles.noFeedDescription}>{t("no_feed_desc")}</CustomText>
      <TouchableOpacity
        style={marketplaceReceivedStyles.button}
        onPress={() => navigation.navigate(Routes.cameraTab)}
      >
        <Text style={marketplaceReceivedStyles.startCapture}>{t("start_capture")}</Text>
      </TouchableOpacity>
    </View>
  )
}

const OrganizationSelector = ({items, onSelectItem}) => {
  const {t} = useTranslation("profile");
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
        placeholder={t("select_organization")}
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

const UserProfile = () => {
  const {userInformation} = useSelector((state) => state.getTokenReducer);
  const [loading, setLoading] = useState(true);
  const [_organizations, setOrganizations] = useState([]);
  const [gettingData, setGettingData] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState({type: "individual"});
  const [feedData, setFeedData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const {t} = useTranslation("profile");
  const {bottom} = useSafeAreaInsets();
  const navigation = useNavigation();

  const setInitialOrganization = () => {
    const {id, display_name: organization_name, username: organization_username} = userInformation;
    const initialOrganization = {id, organization_name, organization_username, type: "individual"};
    setOrganizations([initialOrganization])
    setSelectedOrganization(initialOrganization)
  }

  const getData = async () => {
    setGettingData(true)

    const url = selectedOrganization.type
      ? `/api/user-uploads?options[parameters][user_id]=${userInformation?.id}&options[limit]=10&page=${page}`
      : `/api/function/organizations/organization/feedList?options[parameters][organization_key]=${selectedOrganization.organization_key}&options[limit]=10&page=${page}`

    try {
      const {data, pagination} = await fetchHandler({url: `${Config.SERVICE_URL}${url}`})

      if (!!pagination) {
        setPage(pagination?.current_page + 1)
        setTotalPage(pagination?.last_page)
      }

      setGettingData(false)

      return {status: 'success', data, pagination}
    } catch (e) {
      toast.show(t("fetch_error"), {type: 'error'})
    }
  }

  const nextPage = async () => {
    if (page > totalPage) return;

    const {data} = await getData()
    setFeedData(prev => [...prev, ...data])
  }

  const initial = async () => {
    try {
      setInitialOrganization();

      const {data} = await fetchHandler({
        url: `${Config.SERVICE_URL}/api/function/organizations/organization/myOrganizations`
      })

      data && setOrganizations(prev => [...prev, ...data])

      const {data: feeds} = await getData()
      setFeedData(feeds)
      setLoading(false)
    } catch (e) {
      throw new Error('fetch_error')
    }
  }

  useEffect(() => {
    setInitialOrganization();
    initial().catch(() => toast.show(t("fetch_error"), {type: 'error'}))

    return () => setPage(1)
  }, [])

  const pressHandler = (sequence_uuid) => {
    navigation.navigate(Routes.profileSequence, {
      id: sequence_uuid,
      user_id: userInformation.id,
      isIndividual: selectedOrganization,
      org_id: selectedOrganization.organization_key || 0
    });
  }

  return (
    <View style={{...globalStyles.container, paddingBottom: bottom}}>
      <FocusAwareStatusBar barStyle="light-content" />
      <UserInfos selectedItem={selectedOrganization}/>

      {/* TODO: This action is not true. services is will update with Vedat.
        {
          organizations.length >= 2 &&
          <OrganizationSelector items={organizations} onSelectItem={setSelectedOrganization}/>
        }
      */}

      {loading ? <SkeletonList/> : (
        <FlatList
          data={feedData}
          onEndReached={() => !gettingData && nextPage()}
          ListFooterComponent={() => gettingData && <ActivityIndicator size={"small"}/>}
          ListEmptyComponent={() => <EmptyComponent/>}
          renderItem={({item}) => <ProfileFeed data={item} onPress={() => pressHandler(item.sequence_uuid)}/>}
        />
      )}

    </View>
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
