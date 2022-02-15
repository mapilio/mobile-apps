import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Maximize from "../assets/svg/illustrations/Maximize";
import { sequenceDetailStyles } from "../styles/userSequenceStyle";
import Minimize from "../assets/svg/illustrations/Minimize";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import MapboxGL from "@react-native-mapbox-gl/maps";
import { appMapStyle } from "../styles/appMapStyle";
import database from "../db";
import { useSelector } from "react-redux";
import { MapView } from "../highordercomponents";

const UserSequenceDetail = ({ navigation, route }) => {
  const [maximize, setMaximize] = useState(false);
  const [lines, setLines] = useState({});
  const [points, setPoints] = useState({});
  const [center, setCenter] = useState([30.8, 41.015137]);
  const [clickedPoint, setClickedPoint] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [width, setWidth] = useState(RFValue(33));
  const { activeSequence } = useSelector((state) => state.uploadReducer);
  const screenHeight = Dimensions.get("window").height - RFValue(110);

  useEffect(() => {
    navigation.addListener("blur", () => {
      setClickedPoint(null);
    });
  }, [navigation]);

  const getCoordinates = () => {
    database.query(
      `SELECT * FROM captures WHERE sequence_uuid='${activeSequence}'`,
      (_, result) => {
        setCenter([
          JSON.parse(result.rows._array[0].location).coords.longitude,
          JSON.parse(result.rows._array[0].location).coords.latitude,
        ]);
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
        result.rows._array.map((item) => {
          points.features.push({
            type: "Feature",
            properties: { item },
            geometry: {
              type: "Point",
              coordinates: [
                JSON.parse(item.location).coords.longitude,
                JSON.parse(item.location).coords.latitude,
              ],
            },
          });
          line.features[0].geometry.coordinates.push([
            JSON.parse(item.location).coords.longitude,
            JSON.parse(item.location).coords.latitude,
          ]);
        });
        setLines(line);
        setPoints(points);
        setClickedPoint({
          heading: route.params.heading,
          longitude: route.params.coordinate[0],
          latitude: route.params.coordinate[1],
        });
        setTimeout(() => {
          setWidth(RFValue(35));
        }, 1000);
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
        {/* <View
          style={[
            sequenceDetailStyles.resizeButton,
            maximize
              ? sequenceDetailStyles.maximizeButton
              : sequenceDetailStyles.minimizeButton,
          ]}
        >
          <TouchableOpacity onPress={() => setMaximize(!maximize)}>
            {maximize ? <Minimize /> : <Maximize />}
          </TouchableOpacity>
        </View> */}
      </ScrollView>

      <MapView
        mapStyle={{ ...appMapStyle.map, height: RFPercentage(74) }}
        attributionPosition={{ bottom: 26, right: 8 }}
      >
        <MapboxGL.Camera
          centerCoordinate={[center[0] + 0.0009, center[1]]}
          zoomLevel={16}
          animationMode={"flyTo"}
          animationDuration={1000}
        />
        {!!Object.keys(points).length && (
          <MapboxGL.ShapeSource
            id={"pointsShape"}
            shape={points}
            onPress={(point) => {
              setCurrentImage(point.features[0].properties.item.path);
              setClickedPoint({
                heading: JSON.parse(point.features[0].properties.item.location)
                  .coords.heading,
                longitude: Number(point.features[0].geometry.coordinates[0]),
                latitude: Number(point.features[0].geometry.coordinates[1]),
              });
            }}
          >
            <MapboxGL.CircleLayer
              id={"circle"}
              style={{ circleColor: "#1AD971", circleRadius: 5 }}
              layerIndex={60}
            />
            <MapboxGL.CircleLayer
              id={"circleBuffer"}
              style={{
                circleColor: "#1AD971",
                circleRadius: 8,
                circleOpacity: 0.3,
              }}
              layerIndex={30}
            />
          </MapboxGL.ShapeSource>
        )}
        {clickedPoint && (
          <MapboxGL.PointAnnotation
            key="pointAnnotation3"
            id="pointAnnotation3"
            coordinate={[clickedPoint.longitude, clickedPoint.latitude]}
            style={{ zIndex: 100000000 }}
          >
            <Image
              source={require("../assets/images/heading.png")}
              resizeMode={"cover"}
              style={{
                zIndex: 100000000,
                transform: [
                  {
                    rotate: `${clickedPoint.heading}deg`,
                  },
                ],
                width: clickedPoint ? width : RFValue(32),
                height: clickedPoint ? RFValue(35) : RFValue(32),
              }}
            />
          </MapboxGL.PointAnnotation>
        )}
        {!!Object.keys(lines).length && (
          <MapboxGL.ShapeSource id={"detailShape"} shape={lines}>
            <MapboxGL.LineLayer
              id="linelayer1"
              style={{ lineColor: "#1AD971", lineWidth: 3 }}
              layerIndex={29}
            />
          </MapboxGL.ShapeSource>
        )}
      </MapView>
    </View>
  );
};

export default UserSequenceDetail;
