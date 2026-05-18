import React, {useEffect, useState} from "react";
import { Dimensions, View} from "react-native";
import {sequenceDetailStyles} from "../styles/userSequenceStyle";
import MapLibre from "@maplibre/maplibre-react-native";
import {appMapStyle} from "../styles/appMapStyle";
import {MapView} from "../highordercomponents";
import {styles} from "../styles/circleStyles";
import {useDispatch, useSelector} from "react-redux";
import {UPDATE_CURRENT_SEQUENCE} from "../store/actionsName";
import {Heading} from "../components/Map";
import {setGeoJson} from "../helper/geojson";

import {FocusAwareStatusBar, Panorama} from "../components";
import {useSafeAreaInsets} from "react-native-safe-area-context";

const ProfileUploadDetail = ({ navigation, route }) => {
  const [points, setPoints] = useState({});
  const [coordinates, setCoordinates] = useState({});
  const [coord, setCoord] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const dispatch = useDispatch();
  const {userInformation} = useSelector((state) => state.getTokenReducer);
  const {bottom} = useSafeAreaInsets();
  const {height} = Dimensions.get("screen")
  const image = currentImage ? currentImage : `${route.params.path}`

  useEffect(() => {
    return navigation.addListener("focus", () => {
      dispatch({
        type: UPDATE_CURRENT_SEQUENCE,
        payload: {
          sequence_uuid: route.params.points[0]?.sequence_uuid,
          user_id: userInformation.id,
        },
      });
    });
  }, [navigation, dispatch, route.params.points, userInformation?.id]);

  const getMap = () => {
    setCoordinates(setGeoJson(route.params.points, "line"));
    setPoints(setGeoJson(route.params.points, "point"));

    setCoord({
      heading: route.params.heading,
      longitude: Number(route.params.coordinate[0]),
      latitude: Number(route.params.coordinate[1]),
    });
  };

  useEffect(() => {
    navigation.addListener("blur", () => {
      setCoord(null);
    });
  }, [navigation]);

  useEffect(() => {
    getMap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.params.points]);

  return (
    <View>
      <FocusAwareStatusBar barStyle="dark-content" translucent backgroundColor="#fff" />
      <View style={sequenceDetailStyles.imageArea}>
        <Panorama image={image} height={height / 2}/>
      </View>
      <MapView
        mapStyle={{ ...appMapStyle.map, height: "50%" }}
      >
        <MapLibre.Camera
          zoomLevel={17}
          animationMode={"none"}
          centerCoordinate={[
            route.params.coordinate[0] + 0.0009,
            route.params.coordinate[1],
          ]}
          animationDuration={1000}
        />
        {!!Object.keys(points).length && (
          <MapLibre.ShapeSource
            id={"pointsProfileShape"}
            shape={points}
            onPress={(point) => {
              setCoord({
                heading: point.features[0].properties.item.heading,
                latitude: Number(point.features[0].properties.item.latitude),
                longitude: Number(point.features[0].properties.item.longitude),
              });
              setCurrentImage(
                `${process.env.EXPO_PUBLIC_IMAGE_API}/${point.features[0].properties.item.img_code}/${point.features[0].properties.item.filename}/480`
              );
            }}
          >
            <MapLibre.CircleLayer
              id={"circle2"}
              style={styles.circles}
            />
            <MapLibre.CircleLayer
              id={"circleBuffer2"}
              style={styles.circlesOpacity}
            />
          </MapLibre.ShapeSource>
        )}
        {!!Object.keys(coordinates).length && (
          <MapLibre.ShapeSource id={"uploadedShape"} shape={coordinates}>
            <MapLibre.LineLayer
              id="linelayer2"
              style={styles.lineStyles}
            />
          </MapLibre.ShapeSource>
        )}
         <Heading
          heading={coord ? coord.heading : `${route.params.heading}deg`}
          coordinates={
            coord
              ? [Number(coord.longitude), Number(coord.latitude)]
              : route.params.coordinate
          }
          markerPath={require("../assets/images/heading.png")}
        />
      </MapView>
    </View>
  );
};

export default ProfileUploadDetail;
