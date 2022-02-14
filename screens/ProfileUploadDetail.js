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
import { MapView } from "../highordercomponents";
import { IMAGE_API } from "@env";

const ProfileUploadDetail = ({ navigation, route }) => {
  const screenHeight = Dimensions.get("window").height - RFValue(110);
  const [maximize, setMaximize] = useState(false);
  const [points, setPoints] = useState({});
  const [coordinates, setCoordinates] = useState({});
  const [currentImage, setCurrentImage] = useState(null);

  const getMap = () => {
    let imageList = route.params.points;
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
  };

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
          style={{
            ...sequenceDetailStyles.image,
            height: maximize ? screenHeight - RFValue(60) : screenHeight / 2,
          }}
        />
        <View
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
        </View>
      </View>

      <MapView
        mapStyle={{ ...appMapStyle.map, height: RFPercentage(64) }}
        attributionPosition={{ bottom: 26, right: 8 }}
      >
        <MapboxGL.Camera
          zoomLevel={14}
          animationMode={"flyTo"}
          centerCoordinate={route.params.coordinate}
          animationDuration={1000}
        />
        {!!Object.keys(points).length && (
          <MapboxGL.ShapeSource
            id={"pointsProfileShape"}
            shape={points}
            onPress={(point) => {
              setCurrentImage(
                `${IMAGE_API}/${point.features[0].properties.item.img_code}/${point.features[0].properties.item.filename}/480`
              );
            }}
          >
            <MapboxGL.CircleLayer
              id={"circle2"}
              style={{ circleColor: "#1AD971", circleRadius: 5 }}
            />
            <MapboxGL.CircleLayer
              id={"circleBuffer2"}
              style={{
                circleColor: "#1AD971",
                circleRadius: 8,
                circleOpacity: 0.3,
              }}
            />
          </MapboxGL.ShapeSource>
        )}
        {!!Object.keys(coordinates).length && (
          <MapboxGL.ShapeSource id={"uploadedShape"} shape={coordinates}>
            <MapboxGL.LineLayer
              id="linelayer2"
              style={{ lineColor: "#1AD971", lineWidth: 3 }}
            />
          </MapboxGL.ShapeSource>
        )}
      </MapView>
    </View>
  );
};

export default ProfileUploadDetail;
