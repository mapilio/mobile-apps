import React, {memo, useEffect, useRef, useState} from "react";
import {Dimensions, TouchableOpacity, View, Platform, Pressable} from "react-native";
import {appMapStyle} from "../styles/appMapStyle";
import MapboxGL, {Camera} from "@rnmapbox/maps";
import Pano from "../components/Map/Pano";
import CurrentLocationIcon from "../assets/svg/illustrations/CurrentLocationIcon";
import PanoMinimize from "../assets/svg/illustrations/PanoMinimize";
import { RFValue } from "react-native-responsive-fontsize";
import * as Location from "expo-location";
import {MapView} from "../highordercomponents";
import {styles} from "../styles/circleStyles";
import {Heading} from "../components/Map";
import Config from "react-native-config";
import SafeAreaView from "react-native-safe-area-view";
import Geolocation from "react-native-geolocation-service";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {Search} from "../components/Search";

MapboxGL.setAccessToken("pk.your_mapbox_public_token");

const AppMap = ({ navigation }) => {
  const [imageInformations, setImageInformations] = useState(null);
  const [clickedCoord, setClickedCoord] = useState(null);
  const [showPano, setShowPano] = useState(false);
  const [userCoordinate, setUserCoordinate] = useState([10, 10]);
  const [userLocation, setUserLocation] = useState(true);
  let cameraRef = useRef();
  let mapRef = useRef();
  const {height} = Dimensions.get("window");
  const {bottom, top} = useSafeAreaInsets();

  useEffect(() => {
    Geolocation.getCurrentPosition(({coords}) => {
      cameraRef.current?.flyTo([coords.longitude, coords.latitude], 0)
    })
  }, [cameraRef.current]);

  const contentHeight = height - RFValue(63) - RFValue(50) - bottom - top

  const zoomPoint = async (coordinate) => {
    const zoomLevel = await mapRef.current?.getZoom()
    cameraRef.current?.setCamera({centerCoordinate: coordinate, zoomLevel: zoomLevel + 5})
  }

  const touchPoint = (e) => {
    const {geometry, properties} = e.features[0];
    setClickedCoord(geometry.coordinates);
    setImageInformations({
      sequenceID: properties.SEQUENCE_UUID,
      date: properties.created_at,
      user: properties.created_by_id,
      pointID: properties.id,
      heading: properties.heading,
      image: `${Config.IMAGE_API}/${properties.img_code}/${properties.filename}/480`,
      highResImage: `${Config.IMAGE_API}/${properties.img_code}/${properties.filename}/1080`,
    });

    setShowPano(true);
  }

  const handleSetCenter = async () => {
    const isEnabled = await Location.hasServicesEnabledAsync();
    const {granted}  = await Location.getForegroundPermissionsAsync();
    if (!isEnabled || !granted) {
      toast.show(`Your GPS is disabled.`, {type: "error"})
    }

    if (userCoordinate && isEnabled) {
      cameraRef.current?.setCamera({centerCoordinate: userCoordinate, zoomLevel: 10});
    }
  }

  return (
    <SafeAreaView>
      {showPano ? (
        <Pano hidePano={() => setShowPano(false)} imageInformation={imageInformations} navigation={navigation}/>
      ) : (
        <Search camera={cameraRef}/>
      )}

      {!showPano && imageInformations && (
        <TouchableOpacity
          style={appMapStyle.minimizePano}
          onPress={() => setShowPano(true)}
        >
          <PanoMinimize />
        </TouchableOpacity>
      )}

      <View>
        <MapView
          mapStyle={{...appMapStyle.map, height: showPano ? (contentHeight / 2) : contentHeight}}
          mapRef={mapRef}
        >
          <MapboxGL.UserLocation
            visible={userLocation}
            showsUserHeadingIndicator={Platform.OS === "android"}
            onUpdate={({coords}) => {
              setUserCoordinate([coords.longitude, coords.latitude])
            }}
          />

          <MapboxGL.VectorSource
            id="road-points"
            url={Config.MAPBOX_POINT_URL}
            onPress={touchPoint}
          >
            <MapboxGL.CircleLayer
              id={"mapilio_point_new"}
              sourceLayerID={Config.MAPBOX_POINT_ID}
              style={styles.circles}
              minZoomLevel={14}
            />
          </MapboxGL.VectorSource>

          <MapboxGL.VectorSource
            id="road-points-2"
            url={Config.MAPBOX_POINT_URL}
          >
            <MapboxGL.CircleLayer
              id={"mapilio-point-v1-stroke"}
              sourceLayerID={Config.MAPBOX_POINT_ID}
              style={styles.circlesOpacity}
              maxZoomLevel={15}
            />
          </MapboxGL.VectorSource>

          <MapboxGL.VectorSource
            id={"road-shape"}
            url={Config.MAPBOX_ROAD_URL}
            onPress={(e) => zoomPoint(e.features[0].geometry.coordinates[0])}
          >
            <MapboxGL.LineLayer
              id={"mapilio-road-v1"}
              sourceLayerID={Config.MAPBOX_ROAD_ID}
              style={styles.lineStyles}
            />
          </MapboxGL.VectorSource>
          {(clickedCoord && showPano) && (
            <Heading
              heading={imageInformations ? imageInformations.heading : 0}
              coordinates={clickedCoord}
              markerPath={require("../assets/images/heading.png")}
            />
          )}
          <Camera ref={cameraRef} />
        </MapView>
        <Pressable
          style={appMapStyle.currentIcon}
          onPress={handleSetCenter}
          onLongPress={() => setUserLocation(prev => !prev)}
        >
          <CurrentLocationIcon />
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default memo(AppMap);
