import React, {useEffect, useState} from "react";
import {Dimensions, Image, View} from "react-native";
import {sequenceDetailStyles} from "../styles/userSequenceStyle";
import {RFPercentage, RFValue} from "react-native-responsive-fontsize";
import MapboxGL from "@rnmapbox/maps";
import {appMapStyle} from "../styles/appMapStyle";
import {MapView} from "../highordercomponents";
import {styles} from "../styles/circleStyles";
import {useDispatch, useSelector} from "react-redux";
import {UPDATE_CURRENT_SEQUENCE} from "../store/actionsName";
import {Heading} from "../components/Map";
import {setGeoJson} from "../helper/geojson";
import Config from "react-native-config";

const ProfileUploadDetail = ({ navigation, route }) => {
  const screenHeight = Dimensions.get("window").height - RFValue(110);
  const [points, setPoints] = useState({});
  const [coordinates, setCoordinates] = useState({});
  const [coord, setCoord] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const dispatch = useDispatch();
  const { userInformation } = useSelector((state) => state.getTokenReducer);

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
  }, [navigation]);

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
  }, [route.params.points]);

  return (
    <View>
      <View style={sequenceDetailStyles.imageArea}>
        <Image
          source={{
            width: RFValue(200),
            height: RFValue(78),
            uri: currentImage ? currentImage : `${route.params.path}`,
          }}
          resizeMode={"cover"}
          style={{...sequenceDetailStyles.image, height: screenHeight / 2}}
        />
      </View>
      <MapView
        mapStyle={{ ...appMapStyle.map, height: RFPercentage(64) }}
        attributionPosition={{ bottom: 26, right: 8 }}
      >
        <MapboxGL.Camera
          zoomLevel={17}
          animationMode={"none"}
          centerCoordinate={[
            route.params.coordinate[0] + 0.0009,
            route.params.coordinate[1],
          ]}
          animationDuration={1000}
        />
        {!!Object.keys(points).length && (
          <MapboxGL.ShapeSource
            id={"pointsProfileShape"}
            shape={points}
            onPress={(point) => {
              setCoord({
                heading: point.features[0].properties.item.heading,
                latitude: Number(point.features[0].properties.item.latitude),
                longitude: Number(point.features[0].properties.item.longitude),
              });
              setCurrentImage(
                `${Config.IMAGE_API}/${point.features[0].properties.item.img_code}/${point.features[0].properties.item.filename}/480`
              );
            }}
          >
            <MapboxGL.CircleLayer
              id={"circle2"}
              style={styles.circles}
              layerIndex={60}
            />
            <MapboxGL.CircleLayer
              id={"circleBuffer2"}
              style={styles.circlesOpacity}
              layerIndex={59}
            />
          </MapboxGL.ShapeSource>
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
        {!!Object.keys(coordinates).length && (
          <MapboxGL.ShapeSource id={"uploadedShape"} shape={coordinates}>
            <MapboxGL.LineLayer
              id="linelayer2"
              style={styles.lineStyles}
              layerIndex={58}
            />
          </MapboxGL.ShapeSource>
        )}
      </MapView>
    </View>
  );
};

export default ProfileUploadDetail;
