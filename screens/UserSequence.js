import React, { useEffect, useState } from "react";
import { ScrollView, View, TouchableOpacity, Alert } from "react-native";
import Map from "../assets/svg/illustrations/Map";
import { ImageUpload } from "../components/Uploads";
import { userSequenceStyles } from "../styles/userSequenceStyle";
import SwitchSelector from "react-native-switch-selector";
import { Trash } from "../assets/svg/illustrations";
import { userUploadStyles } from "../styles/userUploadStyle";
import { useDispatch, useSelector } from "react-redux";
import database from "../db";
import * as FileSystem from "expo-file-system";
import {
  SEQUENCE_IMAGES,
  UPDATE_SELECTED_IMAGES,
  UPLOAD_DATA,
} from "../store/actionsName";
import MapboxGL from "@react-native-mapbox-gl/maps";
import { appMapStyle } from "../styles/appMapStyle";
import { Routes } from "../navigator/Routes";
import { MapView } from "../highordercomponents";

const UserSequence = ({ navigation, route }) => {
  const [active, setActive] = useState("image");
  const [coordinates, setCoordinates] = useState({});
  const [points, setPoints] = useState({});
  const [center, setCenter] = useState([]);
  const icons = {
    image: require("../assets/images/imgIcon.png"),
    map: require("../assets/images/mapIcon.png"),
  };
  const { activeSequence } = useSelector((state) => state.uploadReducer);
  const { selectedImages } = useSelector((state) => state.imagesReducer);
  const dispatch = useDispatch();

  const options = [
    { label: "Image", value: "image", imageIcon: icons.image },
    { label: "Map", value: "map", imageIcon: icons.map },
  ];

  const deletedImages = () => {
    Alert.alert("Are you sure?", "Are you sure you want to delete this image", [
      {
        text: "Yes",
        onPress: () => {
          database.query(
            `SELECT id, path FROM captures WHERE id IN (${selectedImages})`,
            (_, result) => {
              result.rows._array.map((file) => {
                FileSystem.deleteAsync(file.path).then(() => {
                  database.query(
                    `DELETE FROM captures WHERE id = ${file.id}`,
                    () => {
                      database.query(
                        `SELECT * FROM captures WHERE sequence_uuid = '${activeSequence}'`,
                        (_, result) => {
                          dispatch({
                            type: SEQUENCE_IMAGES,
                            payload: result.rows._array,
                          });
                          dispatch({
                            type: UPDATE_SELECTED_IMAGES,
                            payload: selectedImages.filter(
                              (e) => e !== file.id
                            ),
                          });
                          database.query(
                            "SELECT *, COUNT(*) as count FROM captures GROUP BY sequence_uuid",
                            (_, result) => {
                              dispatch({
                                type: UPLOAD_DATA,
                                payload: result.rows._array,
                              });
                            }
                          );
                        }
                      );
                    }
                  );
                });
              });
            }
          );
        },
      },
      {
        text: "No",
      },
    ]);
  };

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
        setCoordinates(line);
        setPoints(points);
      }
    );
  };

  useEffect(() => {
    getCoordinates();
  }, [activeSequence]);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        <View style={userSequenceStyles.tabBar}>
          {/* <SwitchSelector
          initial={0}
          options={options}
          onPress={value => setActive(value)}
          backgroundColor={'#F5F5F5'}
          borderColor={'#CBD1D9'}
          buttonColor={'#32425B'}
          borderRadius={5}
          textColor={'#32425B'}
          hasPadding
          imageStyle={{width: 18, height: 18, marginRight: 3}}
          height={32}
        /> */}
        </View>
        {active === "image" ? (
          <ImageUpload navigation={navigation} sequence_uuid={activeSequence} />
        ) : (
          <MapView
            mapStyle={appMapStyle.map}
            attributionPosition={{ bottom: 26, right: 8 }}
          >
            <MapboxGL.Camera centerCoordinate={center} zoomLevel={20} />
            {!!Object.keys(points).length && (
              <MapboxGL.ShapeSource
                id={"pointsShape"}
                shape={points}
                onPress={(point) => {
                  navigation.navigate(Routes.sequenceDetail, {
                    id: point.features[0].properties.item.id,
                    path: point.features[0].properties.item.path,
                    coordinate: point.features[0].geometry.coordinates,
                  });
                }}
              >
                <MapboxGL.CircleLayer
                  id={"circle"}
                  style={{ circleColor: "#1AD971", circleRadius: 5 }}
                />
                <MapboxGL.CircleLayer
                  id={"circleBuffer"}
                  style={{
                    circleColor: "#1AD971",
                    circleRadius: 8,
                    circleOpacity: 0.3,
                  }}
                />
              </MapboxGL.ShapeSource>
            )}

            {!!Object.keys(coordinates).length && (
              <MapboxGL.ShapeSource id={"marketplaceShape"} shape={coordinates}>
                <MapboxGL.LineLayer
                  id="linelayer1"
                  style={{ lineColor: "#1AD971", lineWidth: 3 }}
                />
              </MapboxGL.ShapeSource>
            )}
          </MapView>
        )}
      </ScrollView>
      {!!selectedImages.length && (
        <View style={userUploadStyles.deleteButton}>
          <TouchableOpacity onPress={() => deletedImages()}>
            <Trash width={24} height={24} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default UserSequence;
