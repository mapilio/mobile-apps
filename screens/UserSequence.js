import React, {useEffect, useState} from "react";
import {ScrollView, View, TouchableOpacity, Alert, Dimensions} from "react-native";
import {ImageUpload} from "../components/Uploads";
import {userSequenceStyles} from "../styles/userSequenceStyle";
import {Trash} from "../assets/svg/illustrations";
import {userUploadStyles} from "../styles/userUploadStyle";
import {useDispatch, useSelector} from "react-redux";
import database from "../db";
import * as FileSystem from "expo-file-system";
import SwitchSelector from "react-native-switch-selector";
import {styles} from "../styles/circleStyles";
import {SEQUENCE_IMAGES, SWITCH_SELECTOR, UPDATE_SELECTED_IMAGES, UPLOAD_DATA} from "../store/actionsName";
import MapboxGL from "@rnmapbox/maps";
import {appMapStyle} from "../styles/appMapStyle";
import {Routes} from "../navigator/Routes";
import {MapView} from "../highordercomponents";
import {RFValue} from "react-native-responsive-fontsize";
import {setGeoJson} from "../helper/geojson";
import {useSafeAreaInsets} from "react-native-safe-area-context";

const UserSequence = ({ navigation }) => {
  const [coordinates, setCoordinates] = useState({});
  const [points, setPoints] = useState({});
  const [center, setCenter] = useState([]);
  const icons = {
    image: require("../assets/images/imgIcon.png"),
    map: require("../assets/images/mapIcon.png"),
  };
  const {activeSequence, switchSelector} = useSelector((state) => state.uploadReducer);
  const {selectedImages} = useSelector((state) => state.imagesReducer);
  const dispatch = useDispatch();
  const {bottom} = useSafeAreaInsets();

  const options = [
    { label: "Image", value: "image", imageIcon: icons.image },
    { label: "Map", value: "map", imageIcon: icons.map },
  ];

  useEffect(() => {
    navigation.addListener("blur", () => dispatch({type: SWITCH_SELECTOR, payload: "image"}));
  }, [navigation]);

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
                            "SELECT *, COUNT(*) as count FROM captures GROUP BY sequence_uuid ORDER BY id DESC",
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

  useEffect(() => {
    navigation.addListener("blur", () => {
      dispatch({ type: SWITCH_SELECTOR, payload: "image" });
    });
  }, [navigation]);

  const getCoordinates = () => {
    database.getCaptures(activeSequence).then((result) => {
      setCenter([
        JSON.parse(result[0].location)?.longitude,
        JSON.parse(result[0].location)?.latitude,
      ]);

      setCoordinates(setGeoJson(result, "line"));
      setPoints(setGeoJson(result, "point"));
    })
  };

  useEffect(() => getCoordinates(), [activeSequence]);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView scrollEnabled={switchSelector === "image"}>
        <View style={userSequenceStyles.tabBar}>
          <SwitchSelector
            initial={0}
            options={options}
            onPress={(value) => {
              dispatch({ type: SWITCH_SELECTOR, payload: value });
            }}
            value={switchSelector === "image" ? 0 : 1}
            backgroundColor={"#F5F5F5"}
            borderColor={"#CBD1D9"}
            buttonColor={"#130C47"}
            borderRadius={5}
            textColor={"#130C47"}
            hasPadding
            imageStyle={{
              width: 18,
              height: 18,
              marginRight: 3,
            }}
            style={{
              marginTop: RFValue(20),
              alignSelf: "center",
              width: RFValue(250),
              zIndex: 999999999999999,
            }}
            height={32}
          />
        </View>
        {switchSelector === "image" ? (
          <ImageUpload navigation={navigation} sequence_uuid={activeSequence} />
        ) : (
          <MapView
            mapStyle={{...appMapStyle.map, height: Dimensions.get("screen").height - bottom}}
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
                id={"pointsShape"}
                shape={points}
                onPress={(point) => {
                  navigation.reset({
                    index: 0,
                    routes: [{
                      name: Routes.sequenceDetail,
                      params: {
                        id: point.features[0].properties.item.id,
                        path: point.features[0].properties.item.path,
                        coordinate: point.features[0].geometry.coordinates,
                        heading: JSON.parse(point.features[0].properties.item.location).heading,
                      }
                    }]
                  })
                }}
              >
                <MapboxGL.CircleLayer id={"circle"} style={styles.circles} />
                <MapboxGL.CircleLayer
                  id={"circleBuffer"}
                  style={styles.circlesOpacity}
                />
              </MapboxGL.ShapeSource>
            )}

            {!!Object.keys(coordinates).length && (
              <MapboxGL.ShapeSource id={"marketplaceShape"} shape={coordinates}>
                <MapboxGL.LineLayer id="linelayer1" style={styles.lineStyles} />
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
