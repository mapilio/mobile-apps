import React, {memo, useEffect, useRef, useState} from "react";
import {Dimensions, TouchableOpacity, View, Pressable} from "react-native";
import {appMapStyle} from "../styles/appMapStyle";
import MapboxGL, {Camera} from "@rnmapbox/maps";
import Pano from "../components/Map/Pano";
import CurrentLocationIcon from "../assets/svg/illustrations/CurrentLocationIcon";
import PanoMinimize from "../assets/svg/illustrations/PanoMinimize";
import {RFValue} from "react-native-responsive-fontsize";
import {MapView} from "../highordercomponents";
import {Heading} from "../components/Map";
import Config from "react-native-config";
import Geolocation from "react-native-geolocation-service";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {Search} from "../components/Search";
import {initialPermissions} from "../helper/helper";
import {RESULTS} from "react-native-permissions";
import {point} from "@turf/turf";
import {styles} from "../styles/circleStyles";
import {useSelector} from "react-redux";
import {Routes} from "../navigator/Routes";

MapboxGL.setAccessToken("pk.your_mapbox_public_token");

const AppMap = ({ navigation }) => {
  const [imageInformations, setImageInformations] = useState(null);
  const [clickedCoord, setClickedCoord] = useState(null);
  const [showPano, setShowPano] = useState(false);
  const [userCoordinate, setUserCoordinate] = useState(undefined);
  const [userLocation, setUserLocation] = useState(true);
  const {connection} = useSelector((state) => state.generalReducer);
  let cameraRef = useRef();
  let mapRef = useRef();
  const {height} = Dimensions.get("window");
  const {bottom} = useSafeAreaInsets();

  useEffect(() => {
    !connection.connectionStatus && navigation.navigate(Routes.noInternetAccess)

    const watchId = Geolocation.watchPosition(({coords}) => {
      setUserCoordinate(point([coords.longitude, coords.latitude], coords))
    })

    return () => Geolocation.clearWatch(watchId)
  }, []);

  useEffect(() => {
    cameraRef.current?.flyTo(userCoordinate?.geometry?.coordinates, 0)
  }, [cameraRef.current]);

  const contentHeight = height - bottom - RFValue(63)

  const zoomPoint = (coordinate) => {
    mapRef.current?.getZoom().then((zoomLevel) => {
      cameraRef.current?.setCamera({centerCoordinate: coordinate, zoomLevel: zoomLevel + 5})
    })
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
    initialPermissions().then((res) => {
      if (res !== RESULTS.GRANTED) {
        toast.show(`Your GPS is disabled.`, {type: "error"})
      } else {
        userCoordinate && cameraRef.current?.setCamera({centerCoordinate: userCoordinate?.geometry?.coordinates, zoomLevel: 15});
      }
    })
  }

  return (
    <View>
      {showPano ? (
        <Pano hidePano={() => setShowPano(false)} imageInformation={imageInformations} navigation={navigation}/>
      ) : (
        <Search camera={cameraRef}/>
      )}

      {!showPano && imageInformations && (
        <TouchableOpacity style={appMapStyle.minimizePano} onPress={() => setShowPano(true)}>
          <PanoMinimize />
        </TouchableOpacity>
      )}

      <View>
        <MapView
          mapStyle={{...appMapStyle.map, height: showPano ? (contentHeight / 2) : contentHeight}}
          mapRef={mapRef}
        >

          {
            (userCoordinate?.geometry && userLocation) && (
              <MapboxGL.ShapeSource id={"userLocationHeadingShape"} shape={userCoordinate}>
                <MapboxGL.SymbolLayer
                  id={"userLocationHeading"}
                  style={{
                    iconImage: require("../assets/images/userLocation.png"),
                    iconSize: 1,
                    iconAllowOverlap: true,
                    iconRotate: ["get", "heading"],
                    iconRotationAlignment: 'map',
                  }}
                />
              </MapboxGL.ShapeSource>
            )
          }
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
            onPress={(e) => zoomPoint(e.features[0].geometry.coordinates)}
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
            <MapboxGL.LineLayer id={"mapilio-road-v1"} sourceLayerID={Config.MAPBOX_ROAD_ID} style={styles.lineStyles}/>
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
    </View>
  );
};

export default memo(AppMap);
