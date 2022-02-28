import React, { useEffect, useState } from "react";
import { Animated, ScrollView, View } from "react-native";
import ListProfileUploads from "../components/ListProfileUploads";
import { useDispatch, useSelector } from "react-redux";
import {
  UPDATE_CURRENT_FEED_SEQUENCE,
  UPDATE_CURRENT_SEQUENCE,
} from "../store/actionsName";
import { userSequenceStyles } from "../styles/userSequenceStyle";
import { MapView } from "../highordercomponents";
import { appMapStyle } from "../styles/appMapStyle";
import MapboxGL from "@react-native-mapbox-gl/maps";
import SwitchSelector from "react-native-switch-selector";
import { RFValue } from "react-native-responsive-fontsize";
import { SERVICE_URL, IMAGE_API } from "@env";
import { fetchHandler } from "../helper/helper";
import { styles } from "../styles/circleStyles";
import { Routes } from "../navigator/Routes";

const UserSequence = ({ navigation, route }) => {
  const [active, setActive] = useState("image");
  const [points, setPoints] = useState({});
  const [loading, setLoading] = useState(true);
  const [coordinates, setCoordinates] = useState({});
  const [imageList, setImagesList] = useState([]);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [paginationURL, setPaginationURL] = useState(
    `/api/user-uploads-detail?options[parameters][user_id]=${route.params.user_id}&options[parameters][sequence_uuid]=${route.params.id}&options[limit]=40&page=1`
  );

  const [center, setCenter] = useState([]);
  const icons = {
    image: require("../assets/images/imgIcon.png"),
    map: require("../assets/images/mapIcon.png"),
  };

  const options = [
    { label: "Image", value: "image", imageIcon: icons.image },
    { label: "Map", value: "map", imageIcon: icons.map },
  ];

  useEffect(() => {
    navigation.addListener("blur", () => {
      setImagesList([]);
    });
  }, [navigation]);

  useEffect(() => {
    let subscribe = navigation.addListener("focus", () => {
      if (route.params.isIndividual) {
        setPaginationURL(
          `/api/user-uploads-detail?options[parameters][user_id]=${route.params.user_id}&options[parameters][sequence_uuid]=${route.params.id}&options[limit]=40&page=1`
        );
        fetchNext(
          `/api/user-uploads-detail?options[parameters][user_id]=${route.params.user_id}&options[parameters][sequence_uuid]=${route.params.id}&options[limit]=40&page=1`
        );
      } else {
        setPaginationURL(
          `/api/function/organizations/organization/feedDetail?options[parameters][organization_key]=${route.params.org_id}&options[parameters][sequence_uuid]=${route.params.id}&options[limit]=40&page=1`
        );
        fetchNext(
          `/api/function/organizations/organization/feedDetail?options[parameters][organization_key]=${route.params.org_id}&options[parameters][sequence_uuid]=${route.params.id}&options[limit]=40&page=1`
        );
      }
    });
    return subscribe;
  }, [navigation, route.params.id]);

  const fetchNext = (foreignURL) => {
    fetchHandler({
      url: foreignURL
        ? `${SERVICE_URL}${foreignURL}`
        : `${SERVICE_URL}${paginationURL}`,
    })
      .then((res) => {
        setPaginationLoading(false);
        setPaginationURL(res.pagination.next_page_url);
        const newImageList = [...imageList, ...res.data];
        setImagesList(newImageList);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };

  const getMap = () => {
    if (imageList.length) {
      setCenter([
        Number(imageList[0].longitude),
        Number(imageList[0].latitude),
      ]);
    }
    if (imageList.length) {
      let line = { type: "FeatureCollection" };
      let points = { type: "FeatureCollection" };

      line.features = [
        {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: [],
          },
          properties: {},
        },
      ];
      points.features = [];
      imageList.map((item) => {
        points.features.push({
          type: "Feature",
          properties: { item },
          geometry: {
            type: "Point",
            coordinates: [Number(item.longitude), Number(item.latitude)],
          },
        });
        line.features[0].geometry.coordinates.push([
          Number(item.longitude),
          Number(item.latitude),
        ]);
      });
      setCoordinates(line);
      setPoints(points);
    }
  };

  useEffect(() => {
    getMap();
  }, [imageList]);

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
    <View style={{ flex: 1 }}>
      <ScrollView
        onScroll={({ nativeEvent }) => {
          if (
            isCloseToBottom(nativeEvent) &&
            paginationURL &&
            active === "image"
          ) {
            setPaginationLoading(true);
            fetchNext();
          }
        }}
        scrollEventThrottle={400}
      >
        <View style={userSequenceStyles.tabBar}>
          <SwitchSelector
            initial={0}
            options={options}
            onPress={(value) => setActive(value)}
            backgroundColor={"#F5F5F5"}
            borderColor={"#CBD1D9"}
            buttonColor={"#32425B"}
            borderRadius={5}
            textColor={"#32425B"}
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
              setImagesList={setImagesList}
              loading={loading}
              paginationLoading={paginationLoading}
            />
          </>
        ) : (
          <MapView
            mapStyle={appMapStyle.map}
            attributionPosition={{ bottom: 26, right: 8 }}
          >
            <MapboxGL.Camera
              centerCoordinate={
                center.length !== 0 && [center[0] + 0.0009, center[1]]
              }
              zoomLevel={16}
            />
            {!!Object.keys(points).length && (
              <MapboxGL.ShapeSource
                id={"pointsProfileShape"}
                shape={points}
                onPress={(point) => {
                  navigation.navigate(Routes.feedDetail, {
                    id: point.features[0].properties.item.id,
                    path: `${IMAGE_API}/${point.features[0].properties.item.img_code}/${point.features[0].properties.item.filename}/1080`,
                    coordinate: point.features[0].geometry.coordinates,
                    points: imageList,
                    heading: point.features[0].properties.item.heading,
                    base: true,
                    sequence_uuid: route.params.sequence_uuid,
                    user_id: route.params.user_id,
                  });
                }}
              >
                <MapboxGL.CircleLayer id={"circle5"} style={styles.circles} />
                <MapboxGL.CircleLayer
                  id={"circleBuffer5"}
                  style={styles.circlesOpacity}
                />
              </MapboxGL.ShapeSource>
            )}
            {!!Object.keys(coordinates).length && (
              <MapboxGL.ShapeSource id={"uploadedShape"} shape={coordinates}>
                <MapboxGL.LineLayer id="linelayer2" style={styles.lineStyles} />
              </MapboxGL.ShapeSource>
            )}
          </MapView>
        )}
      </ScrollView>
    </View>
  );
};

export default UserSequence;
