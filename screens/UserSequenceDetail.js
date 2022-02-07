import React, {useEffect, useState} from "react";
import {Dimensions, Image, View, TouchableOpacity} from "react-native";
import Maximize from "../assets/svg/illustrations/Maximize";
import {sequenceDetailStyles} from "../styles/userSequenceStyle";
import Minimize from "../assets/svg/illustrations/Minimize";
import {RFPercentage, RFValue} from "react-native-responsive-fontsize";
import MapboxGL from "@react-native-mapbox-gl/maps";
import {appMapStyle} from "../styles/appMapStyle";
import database from "../db";
import {useSelector} from "react-redux";
import {Routes} from "../navigator/Routes";

const UserSequenceDetail = ({navigation, route}) => {
  const [maximize, setMaximize] = useState(false);
  const [lines, setLines] = useState({});
  const [points, setPoints] = useState({});
  const [center, setCenter] = useState([30.8, 41.015137]);
  const {activeSequence} = useSelector((state) => state.uploadReducer);
  const screenHeight = Dimensions.get('window').height - RFValue(110);

  const getCoordinates = () => {
    database.query(`SELECT * FROM captures WHERE sequence_uuid='${activeSequence}'`, (_, result) => {
      setCenter([JSON.parse(result.rows._array[0].location).coords.longitude, JSON.parse(result.rows._array[0].location).coords.latitude]);
      let line = {type: "FeatureCollection"}
      let points = {type: "FeatureCollection"}

      line.features = [{
        type: 'Feature',
        geometry: {
          type: "LineString",
          coordinates: [],
        },
        properties: {}
      }];
      points.features = []
      result.rows._array.map((item) => {
        points.features.push(
          {
            type: "Feature",
            properties: {item},
            geometry: {
              type: "Point",
              coordinates: [JSON.parse(item.location).coords.longitude, JSON.parse(item.location).coords.latitude],
            },
          })
        line.features[0].geometry.coordinates.push([JSON.parse(item.location).coords.longitude, JSON.parse(item.location).coords.latitude]);
      })
      setLines(line)
      setPoints(points)
    })
  }

  useEffect(() => {
    getCoordinates()
  }, [activeSequence]);

  return (
    <View>
      <View style={sequenceDetailStyles.imageArea}>
        <Image
          source={{width: RFValue(200), height: RFValue(78), uri: `${route.params.path}`}}
          resizeMode={"cover"}
          style={{
            ...sequenceDetailStyles.image,
            height: maximize ? screenHeight : screenHeight / 2,
          }}
        />
        <View style={[
          sequenceDetailStyles.resizeButton,
          maximize ? sequenceDetailStyles.maximizeButton : sequenceDetailStyles.minimizeButton
        ]}>
          <TouchableOpacity onPress={() => setMaximize(!maximize)}>
            {
              maximize ? <Minimize /> : <Maximize />
            }
          </TouchableOpacity>
        </View>
      </View>

      <MapboxGL.MapView
        styleURL={'mapbox://styles/mapbox/light-v10'}
        style={{...appMapStyle.map, height: RFPercentage(54)}}
        attributionPosition={{bottom: 26, right: 8}}
      >
        <MapboxGL.Camera
          centerCoordinate={center}
          zoomLevel={20}
          animationMode={"flyTo"}
          animationDuration={1000}
        />
        {
          !!Object.keys(points).length && (
            <MapboxGL.ShapeSource id={"pointsShape"} shape={points} onPress={(point) => {
                navigation.navigate(Routes.sequenceDetail, {
                  id: point.features[0].properties.item.id,
                  path: point.features[0].properties.item.path,
                  coordinate: point.features[0].geometry.coordinates,
                })
              }}>
              {/* TODO highlight the active image */}
              <MapboxGL.CircleLayer id={'circle'} style={{circleColor: '#1AD971', circleRadius: 5}} />
              <MapboxGL.CircleLayer id={'circleBuffer'} style={{circleColor: '#1AD971', circleRadius: 8, circleOpacity: .3}} />
            </MapboxGL.ShapeSource>
          )
        }
        {
          !!Object.keys(lines).length && (
            <MapboxGL.ShapeSource
              id={"detailShape"}
              shape={lines}
            >
              <MapboxGL.LineLayer id='linelayer1' style={{lineColor: '#1AD971', lineWidth: 3}} />
            </MapboxGL.ShapeSource>
          )
        }
      </MapboxGL.MapView>
    </View>
  );
};

export default UserSequenceDetail;
