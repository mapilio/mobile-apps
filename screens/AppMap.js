import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  TouchableOpacity,
  View,
  Platform,
  Pressable,
  Keyboard,
} from "react-native";
import { appMapStyle } from "../styles/appMapStyle";
import MapboxGL, { Logger } from "@rnmapbox/maps";
import SearchIcon from "../assets/svg/illustrations/SearchIcon";
import Pano from "../components/Map/Pano";
import CurrentLocationIcon from "../assets/svg/illustrations/CurrentLocationIcon";
import PanoMinimize from "../assets/svg/illustrations/PanoMinimize";
import SlidingUpPanel from "rn-sliding-up-panel";
import { RFValue } from "react-native-responsive-fontsize";
import SearchbarSwipe from "../components/SearchbarSwipe";
import * as Location from "expo-location";
import { useHeaderHeight } from "@react-navigation/elements";
import { MapView } from "../highordercomponents";
import { styles } from "../styles/circleStyles";
import { Heading } from "../components/Map";
import { CloseIcon } from "../assets/svg/illustrations";
import { toastMessage } from "../helper/alerts";
import Config from "react-native-config";
import SafeAreaView from "react-native-safe-area-view";
import Geolocation from "react-native-geolocation-service";
import {useSafeAreaInsets} from "react-native-safe-area-context";

MapboxGL.setAccessToken("pk.your_mapbox_public_token");

const { height } = Dimensions.get("window");

Logger.setLogCallback((log) => {
  const { message } = log;

  // expected warnings - see https://github.com/mapbox/mapbox-gl-native/issues/15341#issuecomment-522889062
  return !!(message.match("Request failed due to a permanent error: Canceled") ||
    message.match("Request failed due to a permanent error: Socket Closed"));
});

const AppMap = ({ navigation }) => {
  const [centerCoordinate, setCenterCoordinate] = useState([29.9081, 40.8793]);
  const [imageInformations, setImageInformations] = useState(null);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [openSearchbar, setOpenSearchbar] = useState(false);
  const [minimizePano, setMinimizePano] = useState(false);
  const [zoom, setCurrentZoom] = useState(16);
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
  const {top, bottom} = useSafeAreaInsets();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
        setKeyboardVisible(false);
      }
    );

    Geolocation.getCurrentPosition(({coords}) => setCenterCoordinate([coords.longitude, coords.latitude]))

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
    setClickedCoord(pointFeatures.coordinates);
    setImageInformations({
      sequenceID: pointFeatures.SEQUENCE_UUID,
      date: pointFeatures.created_at,
      user: pointFeatures.created_by_id,
      pointID: pointFeatures.id,
      heading: pointFeatures.heading,
      image: `${Config.IMAGE_API}/${pointFeatures.img_code}/${pointFeatures.filename}/480`,
      highResImage: `${Config.IMAGE_API}/${pointFeatures.img_code}/${pointFeatures.filename}/1080`,
    });
    setShowPano(false);
  };

  const zoomPoint = (e) => {
    setCurrentZoom(prev => prev + 5)
    setCenterCoordinate([e.coordinates.longitude, e.coordinates.latitude]);
  }

  const willHide = async (e) => {
    const zoom = await mapRef.current.getZoom();
    setCurrentZoom(Math.round(zoom));
    if (Math.round(zoom) < 10) {
      setHide(true);
    } else {
      setHide(false);
    }
  };

  return (
    <SafeAreaView>
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
      {openSearchbar && (
        <SlidingUpPanel
          draggableRange={{
            top: height - headerHeight * 2,
            bottom: RFValue(120),
          }}
          allowDragging={!onScroll}
          showBackdrop={false}
          ref={panelRef}
          containerStyle={{
            marginBottom: RFValue(63) + bottom,
            zIndex: 6,
          }}
        >
          <SearchbarSwipe
            setFly={setCenterCoordinate}
            panelRef={panelRef}
            flyLocation={centerCoordinate}
            setOnScroll={setOnScroll}
            isKeyboardVisible={isKeyboardVisible}
          />
        </SlidingUpPanel>
      )}
      {showPano && imageInformations && (
        <TouchableOpacity
          style={{...appMapStyle.minimizePano, bottom: RFValue(113) + bottom }}
          onPress={unminimizePano}
        >
          <PanoMinimize />
        </TouchableOpacity>
      )}

      <View>
        <MapView
          mapStyle={{...appMapStyle.map, height: showPano ? height - top - bottom : height - top - bottom / 2 }}
          regionChange={willHide}
          mapRef={mapRef}
        >
          <MapboxGL.UserLocation
            visible={visible}
            showsUserHeadingIndicator={Platform.OS === "android"}
            ref={(location) => setUserCoordinate(location?.state.coordinates)}
          />
          <MapboxGL.VectorSource
            id="road-points"
            url={"mapbox://mapilio.ckzy904h607j827pbqjtx9n4d-3dges"}
            onPress={touchPoint}
          >
            <MapboxGL.CircleLayer
              minZoomLevel={14}
              id={"mapilio_point"}
              sourceLayerID={"mapilio_point"}
              style={styles.circles}
              layerIndex={80}
            />
          </MapboxGL.VectorSource>
          <MapboxGL.VectorSource
            id="road-points-2"
            url={"mapbox://mapilio.ckzy904h607j827pbqjtx9n4d-3dges"}
            onPress={zoomPoint}
            hitbox={{width: 5, height: 5}}
          >
            <MapboxGL.CircleLayer
              id={"mapilio-point-v1-stroke"}
              sourceLayerID={"mapilio_point"}
              style={styles.circlesOpacity}
              layerIndex={79}
            />
          </MapboxGL.VectorSource>
          <MapboxGL.VectorSource
            id={"road-shape"}
            url={"mapbox://mapilio.ckzy90tfh0fdy27mvc11qnz23-7ugs8"}
          >
            <MapboxGL.LineLayer
              id={"mapilio-road-v1"}
              sourceLayerID={"mapilio_road"}
              style={styles.lineStyles}
              layerIndex={60}
            />
          </MapboxGL.VectorSource>
          {(clickedCoord && !hide) && (
            <Heading
              heading={imageInformations ? imageInformations.heading : 0}
              coordinates={clickedCoord}
              markerPath={require("../assets/images/heading.png")}
            />
          )}
          <MapboxGL.Camera
            ref={cameraRef}
            centerCoordinate={centerCoordinate}
            animationMode={"flyTo"}
            animationDuration={1000}
            zoomLevel={zoom}
            maxZoomLevel={20}
          />
        </MapView>
      </View>

      <Pressable
        style={[appMapStyle.currentIcon]}
        onPress={async () => {
          setVisible((prev) => !prev);
          let isEnabled = await Location.hasServicesEnabledAsync();
          let permissionStatus = await Location.getForegroundPermissionsAsync();
          if (!isEnabled || !permissionStatus.granted) {
            toastMessage.error("Your GPS is disabled.");
          }
          if (userCoordinate && isEnabled) {
            setCenterCoordinate(userCoordinate);
          }
        }}
      >
        <CurrentLocationIcon />
      </Pressable>
    </SafeAreaView>
  );
};

export default AppMap;
