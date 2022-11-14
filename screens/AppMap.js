import React, {memo, useEffect, useRef, useState} from "react";
import {Dimensions, TouchableOpacity, View, Platform, Pressable, Keyboard} from "react-native";
import {appMapStyle} from "../styles/appMapStyle";
import MapboxGL, {Camera} from "@rnmapbox/maps";
import SearchIcon from "../assets/svg/illustrations/SearchIcon";
import Pano from "../components/Map/Pano";
import CurrentLocationIcon from "../assets/svg/illustrations/CurrentLocationIcon";
import PanoMinimize from "../assets/svg/illustrations/PanoMinimize";
import SlidingUpPanel from "rn-sliding-up-panel";
import { RFValue } from "react-native-responsive-fontsize";
import SearchbarSwipe from "../components/SearchbarSwipe";
import * as Location from "expo-location";
import {useHeaderHeight} from "@react-navigation/elements";
import {MapView} from "../highordercomponents";
import {styles} from "../styles/circleStyles";
import {Heading} from "../components/Map";
import {CloseIcon} from "../assets/svg/illustrations";
import {toastMessage} from "../helper/alerts";
import Config from "react-native-config";
import SafeAreaView from "react-native-safe-area-view";
import Geolocation from "react-native-geolocation-service";
import {useSafeAreaInsets} from "react-native-safe-area-context";

MapboxGL.setAccessToken("pk.your_mapbox_public_token");

const AppMap = ({ navigation }) => {
  const [imageInformations, setImageInformations] = useState(null);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [openSearchbar, setOpenSearchbar] = useState(false);
  const [clickedCoord, setClickedCoord] = useState(null);
  const [onScroll, setOnScroll] = useState(false);
  const [showPano, setShowPano] = useState(false);
  const [userCoordinate, setUserCoordinate] = useState([10, 10]);
  const [userLocation, setUserLocation] = useState(true);
  const headerHeight = useHeaderHeight();
  let cameraRef = useRef();
  let panelRef = useRef();
  let mapRef = useRef();
  const {height} = Dimensions.get("window");
  const {bottom, top} = useSafeAreaInsets();

  useEffect(() => {
    const didShow = Keyboard.addListener("keyboardDidShow", () => setKeyboardVisible(true));
    const didHide = Keyboard.addListener("keyboardDidHide", () => setKeyboardVisible(false));

    return () => {
      didShow.remove();
      didHide.remove()
    };
  }, []);

  useEffect(() => {
    isKeyboardVisible && panelRef?.current?.show(1800)
  }, [isKeyboardVisible]);

  useEffect(() => {
    Geolocation.getCurrentPosition(({coords}) => {
      cameraRef.current?.flyTo([coords.longitude, coords.latitude], 0)
    })
  }, [cameraRef.current]);

  const contentHeight = height - RFValue(63) - RFValue(50) - bottom - top

  const zoomPoint = async (coordinate) => {
    const zoomLevel = await mapRef.current?.getZoom()

    cameraRef.current?.setCamera({
      centerCoordinate: coordinate,
      zoomLevel: zoomLevel + 5,
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
    const isEnabled = await Location.hasServicesEnabledAsync();
    const {granted}  = await Location.getForegroundPermissionsAsync();

    if (!isEnabled || !granted) {
      toastMessage.error("Your GPS is disabled.")
    }

    if (userCoordinate && isEnabled) {
      cameraRef.current?.setCamera({centerCoordinate: userCoordinate, zoomLevel: 10});
    }
  }

  useEffect(() => {
    if (openSearchbar) {panelRef?.current?.show(225)}
  }, [openSearchbar]);

  return (
    <SafeAreaView>
      {showPano ? (
        <Pano hidePano={() => setShowPano(false)} imageInformation={imageInformations} navigation={navigation}/>
      ) : (
        <Pressable onPress={() => setOpenSearchbar((state) => !state)} style={appMapStyle.searchIcon}>
          {openSearchbar ? <CloseIcon color={"#FFFFFF"}/> : <SearchIcon width={19.55} height={19.55}/>}
        </Pressable>
      )}

      {openSearchbar && (
        <SlidingUpPanel
          draggableRange={{top: height - headerHeight * 2, bottom: RFValue(120)}}
          allowDragging={!onScroll}
          showBackdrop={false}
          ref={panelRef}
          containerStyle={{marginBottom: RFValue(63) + bottom, zIndex: 6}}
        >
          <SearchbarSwipe
            setFly={(coordinate) => zoomPoint(coordinate)}
            panelRef={panelRef}
            setOnScroll={setOnScroll}
            isKeyboardVisible={isKeyboardVisible}
          />
        </SlidingUpPanel>
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
            ref={(location) => setUserCoordinate(location?.state.coordinates)}
          />

          <MapboxGL.VectorSource
            id="road-points"
            url={"mapbox://mapilio.ckzy904h607j827pbqjtx9n4d-3dges"}
            onPress={touchPoint}
          >
            <MapboxGL.CircleLayer
              id={"mapilio_point"}
              sourceLayerID={"mapilio_point"}
              style={styles.circles}
              minZoomLevel={14}
            />
          </MapboxGL.VectorSource>

          <MapboxGL.VectorSource
            id="road-points-2"
            url={"mapbox://mapilio.ckzy904h607j827pbqjtx9n4d-3dges"}
            onPress={(e) => zoomPoint(e.features[0].geometry.coordinates)}
          >
            <MapboxGL.CircleLayer
              id={"mapilio-point-v1-stroke"}
              sourceLayerID={"mapilio_point"}
              style={styles.circlesOpacity}
              maxZoomLevel={15}
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
