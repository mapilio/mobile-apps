import {ActivityIndicator, FlatList, Text, TouchableOpacity, View} from "react-native";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {fetchHandler} from "../../helper/helper";
import Config from "react-native-config";
import {ProfileFeed} from "../index";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import styles from './FeedList.styles'
import {useTranslation} from "react-i18next";
import {useNavigation} from "@react-navigation/native";
import {NoFeed} from "../../assets/svg/illustrations";
import {Routes} from "../../navigator/Routes";

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

const FeedList = () => {
  const {userInformation} = useSelector((state) => state.getTokenReducer);
  const {t} = useTranslation("profile");
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [gettingData, setGettingData] = useState(false);

  const getData = async () => {
    const url = `${Config.SERVICE_URL}/api/user-uploads-v2?options[parameters][user_id]=${userInformation?.id}&options[limit]=10&page=${page}`

    try {
      const {data, pagination} = await fetchHandler({url: url})

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

  const pressHandler = (group_key) => {
    navigation.navigate(Routes.profileSequence, {id: group_key, user_id: userInformation.id});
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        style={styles.list}
        onEndReached={() => !gettingData && nextPage()}
        ListEmptyComponent={() => <EmptyComponent/>}
        ListFooterComponent={() => gettingData && <ActivityIndicator size={"small"}/>}
        renderItem={({item}) => <ProfileFeed data={item} pressHandle={() => pressHandler(item.group_key)}/>}
      />
    </View>
  )
}

export default FeedList;
