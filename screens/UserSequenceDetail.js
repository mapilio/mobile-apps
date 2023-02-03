import React, { useEffect, useState } from "react";
import {Dimensions, View, ScrollView} from "react-native";
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
import {Panorama} from "../components";
import {useSafeAreaInsets} from "react-native-safe-area-context";

const UserSequenceDetail = ({ navigation, route }) => {
  const [lines, setLines] = useState({});
  const [points, setPoints] = useState({});
  const [center, setCenter] = useState([30.8, 41.015137]);
  const [clickedPoint, setClickedPoint] = useState(null);
  const dispatch = useDispatch();
  const [currentImage, setCurrentImage] = useState(null);
  const {activeSequence, sequenceImages} = useSelector((state) => state.uploadReducer);
  const {rank} = useSelector((state) => state.uploadReducer)
  const {bottom} = useSafeAreaInsets();
  const {height} = Dimensions.get("screen")
  const image = currentImage ? currentImage : `${route.params.path}`

  useEffect(() => navigation.addListener("blur", () => setClickedPoint(null)), [navigation]);

  useEffect(() => {
    sequenceImages.forEach((value, i) => {
      if (value.id === route.params.id) {
        dispatch({type: RANK, payload: {id: value.id, total: sequenceImages.length, active: ++i, path: value.path}});
      }
    })
  }, [route.params]);

  const getCoordinates = () => {
    database.query(
      `SELECT * FROM captures WHERE group_id='${activeSequence}'`,
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
        <Panorama image={image} height={(height - RFValue(63) - bottom) / 2}/>
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
          animationMode={"none"}
          animationDuration={0}
        />
        {!!Object.keys(points).length && (
          <MapboxGL.ShapeSource
            id={"pointsShape"}
            shape={points}
            onPress={(point) => {
              const properties = point.features[0].properties.item

              dispatch({type: RANK,
                payload: {
                  id: properties.id,
                  total: rank.total,
                  active: properties.count,
                  path: properties.path
                }
              });

              setCurrentImage(FileSystem.documentDirectory + `${properties.group_id}/${properties.path.split('/').pop()}`);
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
