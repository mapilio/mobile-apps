import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  TouchableOpacity,
  View,
  Image,
  Platform,
  Pressable,
  Keyboard,
  Alert,
  Animated,
} from "react-native";
import { appMapStyle } from "../styles/appMapStyle";
import MapboxGL, { Logger } from "@react-native-mapbox-gl/maps";
import SearchIcon from "../assets/svg/illustrations/SearchIcon";
import Pano from "../components/Map/Pano";
import CurrentLocationIcon from "../assets/svg/illustrations/CurrentLocationIcon";
import PanoMinimize from "../assets/svg/illustrations/PanoMinimize";
import SlidingUpPanel from "rn-sliding-up-panel";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import SearchbarSwipe from "../components/SearchbarSwipe";
import { MAPBOX_TILESET_URL, MAPBOX_TILESET_ID, IMAGE_API } from "@env";
import { useHeaderHeight } from "@react-navigation/elements";
import { CustomText, MapView } from "../highordercomponents";
import { styles } from "../styles/circleStyles";
import { Heading } from "../components/Map";
import * as Location from "expo-location";
import { toastGenerator } from "../helper/helper";
import { infoAlertStyles } from "../styles/alertStyles";
import { CloseIcon } from "../assets/svg/illustrations";

MapboxGL.setAccessToken(
  "pk.your_mapbox_public_token"
);

const { height } = Dimensions.get("window");

Logger.setLogCallback((log) => {
  const { message } = log;

  // expected warnings - see https://github.com/mapbox/mapbox-gl-native/issues/15341#issuecomment-522889062
  if (
    message.match("Request failed due to a permanent error: Canceled") ||
    message.match("Request failed due to a permanent error: Socket Closed")
  ) {
    return true;
  }
  return false;
});

const AppMap = ({ navigation }) => {
  const [flyLocation, setFlyLocation] = useState([29.9081, 40.8793]);
  const [imageInformations, setImageInformations] = useState(null);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [openSearchbar, setOpenSearchbar] = useState(false);
  const [minimizePano, setMinimizePano] = useState(false);
  const [zoom, setCurrentZoom] = useState(0);
  const [clickedCoord, setClickedCoord] = useState(null);
  const [onScroll, setOnScroll] = useState(false);
  const [showPano, setShowPano] = useState(true);
  const [userCoordinate, setUserCoordinate] = useState([10, 10]);
  const [visible, setVisible] = useState(true);
  const [hide, setHide] = useState(false);
  const headerHeight = useHeaderHeight();
  let cameraRef = useRef();
  let panelRef = useRef();
  let mapRef = useRef();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    if (isKeyboardVisible) {
      panelRef?.current?.show(1800);
    }
  }, [isKeyboardVisible]);

  const hidePano = () => {
    setShowPano(true);
  };

  const runMinimizePano = () => {
    setClickedCoord(null);
    setMinimizePano(true);
    hidePano();
  };

  const unminimizePano = () => {
    setMinimizePano(false);
    setShowPano(false);
  };

  useEffect(() => {
    if (openSearchbar) {
      panelRef?.current?.show(225);
    }
  }, [openSearchbar]);

  const touchPoint = (e) => {
    const pointFeatures = e.features[0].properties;
    setClickedCoord(e.features[0].geometry.coordinates);
    setImageInformations({
      sequenceID: pointFeatures.SEQUENCE_UUID,
      date: pointFeatures.created_at,
      user: pointFeatures.created_by_id,
      pointID: pointFeatures.id,
      heading: pointFeatures.heading,
      image: `${IMAGE_API}/${pointFeatures.img_code}/${pointFeatures.filename}/480`,
      highResImage: `${IMAGE_API}/${pointFeatures.img_code}/${pointFeatures.filename}/1080`,
    });
    setShowPano(false);
  };

  const willHide = async (e) => {
    const zoom = await mapRef.current.getZoom();
    setCurrentZoom(Math.round(zoom));
    if (Math.round(zoom) < 10) {
      setHide(true);
    } else {
      setHide(false);
    }
  };

  const touchFromAway = (e) => {
    if (zoom < 16) {
      setFlyLocation(e.geometry.coordinates);
    }
  };

  return (
    <View>
      {!showPano ? (
        <Pano
          hidePano={hidePano}
          minimizePano={runMinimizePano}
          imageInformation={imageInformations}
          navigation={navigation}
        />
      ) : (
        <>
          <Pressable
            onPress={() => {
              setOpenSearchbar((state) => !state);
            }}
            style={appMapStyle.searchIcon}
          >
            {openSearchbar ? (
              <CloseIcon color={"#FFFFFF"} />
            ) : (
              <SearchIcon width={19.55} height={19.55} />
            )}
          </Pressable>
        </>
      )}
      {openSearchbar ? (
        <SlidingUpPanel
          draggableRange={{
            top: height - headerHeight * 2,
            bottom: RFValue(120),
          }}
          allowDragging={!onScroll}
          showBackdrop={false}
          ref={panelRef}
          containerStyle={{
            marginBottom:
              Platform.OS === "android"
                ? RFValue(63)
                : Dimensions.get("window").height > 775
                ? RFValue(83)
                : RFValue(63),
            zIndex: 6,
          }}
        >
          <SearchbarSwipe
            setFly={setFlyLocation}
            panelRef={panelRef}
            flyLocation={flyLocation}
            setOnScroll={setOnScroll}
            isKeyboardVisible={isKeyboardVisible}
          />
        </SlidingUpPanel>
      ) : null}
      {showPano && imageInformations ? (
        <TouchableOpacity
          style={appMapStyle.minimizePano}
          onPress={unminimizePano}
        >
          <PanoMinimize />
        </TouchableOpacity>
      ) : null}

      <View style={appMapStyle.mapWrapper}>
        <MapView
          mapStyle={appMapStyle.map}
          regionChange={willHide}
          mapRef={mapRef}
          onPress={touchFromAway}
        >
          <MapboxGL.UserLocation
            visible={visible}
            showsUserHeadingIndicator={Platform.OS === "android"}
            ref={(location) => setUserCoordinate(location?.state.coordinates)}
          />
          <MapboxGL.VectorSource
            id="road-points"
            url={"mapbox://mapilio.ckzy904h607j827pbqjtx9n4d-3v9sn"}
            onPress={touchPoint}
          >
            <MapboxGL.CircleLayer
              minZoomLevel={14}
              id={"mapilio-point-v1"}
              sourceLayerID={"mapilio-point-v1"}
              style={styles.circles}
              layerIndex={80}
            />
          </MapboxGL.VectorSource>
          <MapboxGL.VectorSource
            id="road-points-2"
            url={"mapbox://mapilio.ckzy90tfh0fdy27mvc11qnz23-4ow72"}
          >
            <MapboxGL.CircleLayer
              id={"mapilio-point-v1-stroke"}
              sourceLayerID={"mapilio-point-v1"}
              style={styles.circlesOpacity}
              layerIndex={79}
            />
          </MapboxGL.VectorSource>
          <MapboxGL.VectorSource
            id={"road-shape"}
            url={"mapbox://mapilio.ckzy90tfh0fdy27mvc11qnz23-4ow72"}
          >
            <MapboxGL.LineLayer
              id={"mapilio-road-v1"}
              sourceLayerID={"mapilio-road-v1"}
              style={styles.lineStyles}
              layerIndex={55}
            />
          </MapboxGL.VectorSource>
          {clickedCoord && !hide ? (
            <Heading
              heading={imageInformations ? imageInformations.heading : 0}
              coordinates={clickedCoord}
              markerPath={require("../assets/images/heading.png")}
            />
          ) : null}
          <MapboxGL.Camera
            ref={cameraRef}
            centerCoordinate={flyLocation}
            animationMode={"flyTo"}
            animationDuration={1000}
            zoomLevel={flyLocation[0] === 29.9081 ? 1 : 13}
            maxZoomLevel={20}
          />
        </MapView>
      </View>

      <Pressable
        style={[appMapStyle.currentIcon]}
        onPress={async () => {
          setVisible((prev) => !prev);
          // TODO INTEGRATE IF USER LOCATION WAS DISABLED
          // let isEnabled = await Location.hasServicesEnabledAsync();
          // let permissionStatus = await Location.getForegroundPermissionsAsync();
          if (userCoordinate.length !== 0) {
            setFlyLocation(userCoordinate);
          }
        }}
      >
        <CurrentLocationIcon />
      </Pressable>
    </View>
  );
};

export default AppMap;
