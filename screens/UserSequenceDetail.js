import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  View,
  ScrollView,
} from "react-native";
import { sequenceDetailStyles } from "../styles/userSequenceStyle";
import { styles } from "../styles/circleStyles";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import MapboxGL from "@rnmapbox/maps";
import { appMapStyle } from "../styles/appMapStyle";
import database from "../db";
import { useDispatch, useSelector } from "react-redux";
import { MapView } from "../highordercomponents";
import { RANK } from "../store/actionsName";
import {Heading} from "../components/Map";
import {setGeoJson} from "../helper/geojson";
import * as FileSystem from "expo-file-system";

const UserSequenceDetail = ({ navigation, route }) => {
  const [maximize, setMaximize] = useState(false);
  const [lines, setLines] = useState({});
  const [points, setPoints] = useState({});
  const [center, setCenter] = useState([30.8, 41.015137]);
  const [clickedPoint, setClickedPoint] = useState(null);
  const dispatch = useDispatch();
  const [currentImage, setCurrentImage] = useState(null);
  const {activeSequence, sequenceImages} = useSelector((state) => state.uploadReducer);
  const screenHeight = Dimensions.get("window").height - RFValue(110);
  const {userInformation} = useSelector((state) => state.getTokenReducer);

  useEffect(() => navigation.addListener("blur", () => setClickedPoint(null)), [navigation]);

  useEffect(() => {
    sequenceImages.filter((value, i) => {
      if (value.id === route.params.id) {
        dispatch({type: RANK, payload: {id: value.id, total: sequenceImages.length, active: ++i}});
      }
    })
  }, [route.params]);

  const getCoordinates = () => {
    database.query(
      `SELECT * FROM captures WHERE sequence_uuid='${activeSequence}'`,
      (_, result) => {

        setLines(setGeoJson(result.rows._array, "line"));
        setPoints(setGeoJson(result.rows._array, "point"));

        setCenter([
          JSON.parse(result.rows._array[0].location).longitude,
          JSON.parse(result.rows._array[0].location).latitude,
        ]);

        setClickedPoint({
          heading: route.params.heading,
          longitude: route.params.coordinate[0],
          latitude: route.params.coordinate[1]
        });
      }
    );
  };

  useEffect(() => {
    getCoordinates();
  }, [activeSequence, route.params]);

  return (
    <View>
      <ScrollView style={sequenceDetailStyles.imageArea}>
        <Image
          source={{
            width: RFValue(200),
            height: RFValue(78),
            uri: currentImage ? currentImage : `${route.params.path}`,
          }}
          resizeMode={"cover"}
          style={{
            ...sequenceDetailStyles.image,
            height: maximize ? screenHeight : screenHeight / 2,
          }}
        />
      </ScrollView>

      <MapView
        mapStyle={{ ...appMapStyle.map, height: RFPercentage(74) }}
        attributionPosition={{ bottom: 26, right: 8 }}
      >
        <MapboxGL.Camera
          centerCoordinate={
            center.length !== 0 && [center[0] + 0.0009, center[1]]
          }
          zoomLevel={16}
          animationMode={"flyTo"}
          animationDuration={1000}
        />
        {!!Object.keys(points).length && (
          <MapboxGL.ShapeSource
            id={"pointsShape"}
            shape={points}
            onPress={(point) => {
              const properties = point.features[0].properties.item
              setCurrentImage(FileSystem.documentDirectory + `${userInformation.id}/${properties.sequence_uuid}/${properties.path.split('/').pop()}`);
              setClickedPoint({
                heading: JSON.parse(properties.location).heading,
                longitude: Number(point.features[0].geometry.coordinates[0]),
                latitude: Number(point.features[0].geometry.coordinates[1]),
              });
            }}
          >
            <MapboxGL.CircleLayer
              id={"circle"}
              style={styles.circles}
              layerIndex={60}
            />
            <MapboxGL.CircleLayer
              id={"circleBuffer"}
              style={styles.circlesOpacity}
              layerIndex={59}
            />
          </MapboxGL.ShapeSource>
        )}
        {clickedPoint && (
          <Heading
            heading={clickedPoint ? clickedPoint.heading : route.params.heading}
            coordinates={[clickedPoint.longitude, clickedPoint.latitude]}
            markerPath={require("../assets/images/heading.png")}
          />
        )}
        {!!Object.keys(lines).length && (
          <MapboxGL.ShapeSource id={"detailShape"} shape={lines}>
            <MapboxGL.LineLayer
              id="linelayer1"
              style={styles.lineStyles}
              layerIndex={58}
            />
          </MapboxGL.ShapeSource>
        )}
      </MapView>
    </View>
  );
};

export default UserSequenceDetail;
