import {ActivityIndicator, FlatList, Text, TouchableOpacity, View} from "react-native";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {ProfileFeed} from "../index";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import styles from './FeedList.styles'
import {useTranslation} from "react-i18next";
import {useNavigation} from "@react-navigation/native";
import {NoFeed} from "../../assets/svg/illustrations";
import {Routes} from "../../navigator/Routes";
import {api} from "../../util/helpers/api";

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
      <NoFeed/>
      <Text style={styles.noFeedTitle}>{t("no_feed")}</Text>
      <Text style={styles.noFeedDescription}>{t("no_feed_desc")}</Text>
      <TouchableOpacity
        style={styles.noFeedButton}
        onPress={() => navigation.navigate(Routes.cameraTab)}
      >
        <Text style={styles.noFeedButton.text}>{t("start_capture")}</Text>
      </TouchableOpacity>
    </View>
  )
}

const FeedList = ({userDetails}) => {
  const {userInformation} = useSelector((state) => state.getTokenReducer);
  const {t} = useTranslation("profile");
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [gettingData, setGettingData] = useState(false);

  const getData = async () => {
    const userid = userDetails?.id || userInformation?.id
    const url = `/api/user-uploads-v2?options[parameters][user_id]=${userid}&options[limit]=10&page=${page}`

    try {
      const {data, pagination} = await api.get(url, {
        headers: {
          "Content-Type": "application/json",
        }
      })

      if (!!pagination) {
        setPage(pagination?.current_page + 1)
        setTotalPage(pagination?.last_page)
      }

      return {status: 'success', data, pagination}
    } catch (e) {
      throw new Error(e)
    }
  }

  useEffect(() => {
    setGettingData(true)

    getData()
      .then(({data}) => {
        setData(data)
        setLoading(false)
      })
      .catch(() => toast.show(t("fetch_error"), {type: 'error'}))
      .finally(() => setGettingData(false))
  }, []);

  const nextPage = async () => {
    if (page > totalPage) return;
    setGettingData(true);

    getData()
      .then(({data}) => setData(prev => [...prev, ...data]))
      .catch(() => toast.show(t("fetch_error"), {type: 'error'}))
      .finally(() => setGettingData(false))
  }

  if (loading) {
    return <SkeletonList />
  }

  const pressHandler = (group_key, start_address, capture_time) => {
    const userID = userDetails?.id || userInformation?.id;
    navigation.navigate(Routes.stackUserFeedDetail , {id: group_key, user_id: userID, start_address, capture_time});
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        style={styles.list}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        automaticallyAdjustsScrollIndicatorInsets={false}
        onEndReached={() => !gettingData && nextPage()}
        ListEmptyComponent={() => !userDetails ? <EmptyComponent /> : null}
        ListFooterComponent={() => gettingData && <ActivityIndicator size={"small"}/>}
        renderItem={({item}) => <ProfileFeed data={item} pressHandle={() => pressHandler(item.group_key, item.start_address, item.capture_time)}/>}
      />
    </View>
  )
}

export default FeedList;
