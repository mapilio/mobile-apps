import React, {useEffect, useState} from "react";
import {Dimensions, ScrollView, View} from "react-native";
import ListProfileUploads from "../components/ListProfileUploads";
import {userSequenceStyles} from "../styles/userSequenceStyle";
import {CustomText, MapView} from "../highordercomponents";
import {appMapStyle} from "../styles/appMapStyle";
import MapLibre from "@maplibre/maplibre-react-native";
import SwitchSelector from "react-native-switch-selector";
import {RFValue} from "react-native-responsive-fontsize";
import {styles} from "../styles/circleStyles";
import {Routes} from "../navigator/Routes";
import {ActivityIndicator} from "react-native-paper";
import {setGeoJson} from "../helper/geojson";
import Config from "react-native-config";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {useTranslation} from "react-i18next";
import { FocusAwareStatusBar } from "../components";
import {api} from "../util/helpers/api";

const UserSequence = ({ navigation, route }) => {
  const {t} = useTranslation("profile");
  const [active, setActive] = useState("image");
  const [points, setPoints] = useState({});
  const [loading, setLoading] = useState(true);
  const [mapLoading, setMapLoading] = useState(true);
  const [coordinates, setCoordinates] = useState({});
  const [imageList, setImagesList] = useState([]);
  const [mapList, setMapList] = useState([]);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [paginationURL, setPaginationURL] = useState(`/api/user-uploads-detail-v2?options[parameters][user_id]=${route.params.user_id}&options[parameters][group_key]=${route.params.id}&options[limit]=40&page=1`);
  const {bottom}  = useSafeAreaInsets();


  const [center, setCenter] = useState([]);
  const icons = {
    image: require("../assets/images/imgIcon.png"),
    map: require("../assets/images/mapIcon.png"),
  };

  const options = [
    { label: t("image"), value: "image", imageIcon: icons.image },
    { label: t("map"), value: "map", imageIcon: icons.map },
  ];

  useEffect(() => {
    navigation.addListener("blur", () => {
      setImagesList([]);
      setMapList([]);
      setMapLoading(true);
      setActive("image");
    });
  }, [navigation]);

  useEffect(() => {
    return navigation.addListener("focus", () => {
      setPaginationURL(
        `/api/user-uploads-detail-v2?options[parameters][user_id]=${route.params.user_id}&options[parameters][group_key]=${route.params.id}&options[limit]=40&page=1`
      );
      fetchNext(
        `/api/user-uploads-detail-v2?options[parameters][user_id]=${route.params.user_id}&options[parameters][group_key]=${route.params.id}&options[limit]=40&page=1`
      );
    });
  }, [navigation, route.params.id]);

  const fetchNext = (foreignURL) => {
    api.get(foreignURL ? foreignURL : paginationURL)
      .then((res) => {
        setPaginationLoading(false);
        setPaginationURL(res.pagination.next_page_url);
        const newImageList = [...imageList, ...res.data];
        setImagesList(newImageList);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };

  const fetchMapNext = (foreignURL) => {
    setMapLoading(true);
    api.get(foreignURL)
      .then((res) => {
        const newImageList = [...res.data];
        setMapList(newImageList);
        getMap();
      })
      .catch((err) => console.log(err));
  };

  const getMap = () => {
    if (mapList.length) {
      setCenter([Number(mapList[0].longitude), Number(mapList[0].latitude)]);
      setCoordinates(setGeoJson(mapList, "line"));
      setPoints(setGeoJson(mapList, "point"));
      setMapLoading(false);
    }
  };

  useEffect(() => {
    fetchMapNext(
      `/api/user-uploads-detail-v2?options[parameters][user_id]=${route.params.user_id}&options[parameters][group_key]=${route.params.id}&options[limit]=1000&page=1`
    );
  }, [active, imageList]);

  const scrollHandler = ({ nativeEvent }) => {
    if (isCloseToBottom(nativeEvent) && paginationURL && active === "image") {
      setPaginationLoading(true);
      fetchNext();
    }
  }

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
    <View style={{ flex: 1, height: Dimensions.get("screen").height }}>
      <FocusAwareStatusBar barStyle="dark-content" translucent backgroundColor="#fff" />
      <ScrollView onScroll={scrollHandler} scrollEventThrottle={400} scrollEnabled={active === "image"}>
        <View style={userSequenceStyles.tabBar}>
          <SwitchSelector
            initial={0}
            options={options}
            value={active === "image" ? 0 : 1}
            onPress={(value) => setActive(value)}
            backgroundColor={"#F5F5F5"}
            borderColor={"#CBD1D9"}
            buttonColor={"#130C47"}
            borderRadius={5}
            textColor={"#130C47"}
            hasPadding
            style={{
              top: RFValue(15),
              alignSelf: "center",
              width: RFValue(250),
              zIndex: 99999999999,
            }}
            imageStyle={{ width: 18, height: 18, marginRight: 3 }}
            height={32}
          />
        </View>
        {active === "image" ? (
          <>
            <ListProfileUploads
              navigation={navigation}
              sequence_uuid={route.params.id}
              user_id={route.params.user_id}
              imageList={imageList}
              imageMapList={mapList}
              setImagesList={setImagesList}
              loading={loading}
              paginationLoading={paginationLoading}
            />
          </>
        ) : mapLoading ? (
          <View
            style={{
              flex: 1,
              height: Dimensions.get("window").height - RFValue(60),
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator color={"#130C47"} size={"large"} />
            <CustomText
              style={{
                color: "#130C47",
                fontSize: RFValue(15),
                marginTop: RFValue(25),
              }}
            >
              Map loading...
            </CustomText>
          </View>
        ) : (
          <MapView mapStyle={{...appMapStyle.map, height: Dimensions.get("screen").height - bottom}}>
            <MapLibre.Camera
              animationMode={"flyTo"}
              animationDuration={0}
              centerCoordinate={center.length !== 0 && [center[0] + 0.0009, center[1]]}
              zoomLevel={16}
            />
            {!!Object.keys(points).length && (
              <MapLibre.ShapeSource
                id={"pointsProfileShape"}
                shape={points}
                onPress={(point) => {
                  navigation.navigate(Routes.feedDetail, {
                    id: point.features[0].properties.item.id,
                    path: `${Config.IMAGE_API}/${point.features[0].properties.item.img_code}/${point.features[0].properties.item.filename}/1080`,
                    coordinate: point.features[0].geometry.coordinates,
                    points: mapList,
                    heading: point.features[0].properties.item.heading,
                    base: true,
                    sequence_uuid: route.params.id,
                    user_id: route.params.user_id,
                  });
                }}
              >
                <MapLibre.CircleLayer id={"circle5"} style={styles.circles} />
                <MapLibre.CircleLayer
                  id={"circleBuffer5"}
                  style={styles.circlesOpacity}
                />
              </MapLibre.ShapeSource>
            )}
            {!!Object.keys(coordinates).length && (
              <MapLibre.ShapeSource id={"uploadedShape"} shape={coordinates}>
                <MapLibre.LineLayer id="linelayer2" style={styles.lineStyles} />
              </MapLibre.ShapeSource>
            )}
          </MapView>
        )}
      </ScrollView>
    </View>
  );
};

export default UserSequence;
