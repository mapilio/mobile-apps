import React, { memo, useEffect, useRef, useState } from "react";
import {
  Platform,
  View,
  StyleSheet,
  ActivityIndicator,
  AppState,
} from "react-native";
import { appMapStyle } from "../styles/appMapStyle";
import { RFValue } from "react-native-responsive-fontsize";
import { MapView } from "../highordercomponents";
import Config from "react-native-config";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Search } from "../components/Search";
import { initialPermissions } from "../helper/helper";
import { RESULTS } from "react-native-permissions";
import { point } from "@turf/turf";
import { useDispatch, useSelector } from "react-redux";
import { Routes } from "../navigator/Routes";
import FocusAwareStatusBar from "../components/FocusAwareStatusBar";
import { ActiveSources, Lines, Points } from "../components/Map/layers";
import {
  CenterToUserButton,
  ProfileButton,
  Pano,
  AttributionButton,
} from "../components/Map";
import { MapilioBetaWatermark } from "../assets/svg/illustrations";
import MapLoading from "../components/Map/MapLoading";
import { useTranslation } from "react-i18next";
import { api } from "../util/helpers/api";
import MapLibreGL from "@maplibre/maplibre-react-native";
import { getConfig, checkMaintenance } from "../store/actions/generalReducer";

const AppMap = ({ navigation }) => {
  const [pointInformation, setPointInformation] = useState(null);
  const [clickedCoord, setClickedCoord] = useState(null);
  const [showPano, setShowPano] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);
  const [isPanoLoading, setIsPanoLoading] = useState(false);
  const [showLocation, setShowLocation] = useState(true);
  const { welcomeWalkthroughStatus } = useSelector(
    (state) => state.generalReducer
  );
  const { connection } = useSelector((state) => state.generalReducer);
  let cameraRef = useRef();
  let mapRef = useRef();
  const { top } = useSafeAreaInsets();
  const { auth } = useSelector((state) => state.getTokenReducer);
  const { t } = useTranslation("map");
  const userCoordinate = useRef(null);
  const initialCoordinate = useRef(null);
  const appState = useRef(AppState.currentState);
  const dispatch = useDispatch();

  useEffect(() => {
    !connection.connectionStatus &&
      navigation.navigate(Routes.noInternetAccess);
    initialPermissions();
    
    const listener = AppState.addEventListener("change", handleAppStateChange);
    return () => {
      listener.remove();
    };
  }, []);

  const handleAppStateChange = (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      dispatch(getConfig());
      dispatch(checkMaintenance());
    }
    appState.current = nextAppState;
  };

  useEffect(() => {
    if (!isMapReady && welcomeWalkthroughStatus) {
      toast.show(t("map_loading"), {
        type: "loading",
        duration: 3000,
      });
    } else {
      toast.hideAll();
    }
  }, [isMapReady]);

  const zoomPoint = (coordinates) => {
    mapRef.current?.getZoom().then((zoomLevel) => {
      cameraRef.current?.setCamera({
        centerCoordinate: [coordinates?.longitude, coordinates?.latitude],
        zoomLevel: zoomLevel + 3,
        animationDuration: 800,
      });
    });
  };

  const touchPoint = async (e) => {
    cameraRef.current?.setCamera({
      centerCoordinate: e.features[0]?.geometry?.coordinates,
      animationDuration: 200,
    });

    const { geometry, properties } = e.features[0];
    setClickedCoord(geometry.coordinates);
    if (!showPano) {
      setIsPanoLoading(true);
    }

    const imageDetails = await api
      .get("/api/sequence-detail?sequence_uuid=" + properties.sequence_uuid)
      .then((res) => {
        const image = res.data.find((image) => image.id === properties.id);
        return image;
      })
      .catch(() => {
        toast.show(t("pano_error"), { type: "error" });
      });

    setPointInformation({
      sequenceID: properties.sequence_uuid,
      date: imageDetails.capture_time,
      user: properties.created_by_id,
      pointID: properties.id,
      heading: imageDetails.heading,
      resolution: imageDetails.resolution,
      image: `${Config.IMAGE_API}/${imageDetails.uploaded_hash}/${imageDetails.filename}/480`,
      highResImage: `${Config.IMAGE_API}/${imageDetails.uploaded_hash}/${imageDetails.filename}/1080`,
    });

    setIsPanoLoading(false);
    setShowPano(true);
  };

  const handleSetCenter = async () => {
    initialPermissions().then((res) => {
      if (res !== RESULTS.GRANTED) {
        toast.show(t("gps_disabled"), { type: "error" });
      } else {
        cameraRef.current?.setCamera({
          centerCoordinate: userCoordinate.current?.geometry.coordinates,
          zoomLevel: 15,
          pitch: 0,
          animationDuration: 500,
          heading: 0,
        });
      }
    });
  };

  const handleProfile = () => {
    if (auth) {
      navigation.navigate(Routes.stackNavigator, {
        screen: Routes.profileNavigator,
      });
      return true;
    } else {
      navigation.navigate(Routes.stackNavigator, {
        screen: Routes.login,
      });
      return true;
    }
  };

  const mapStyles = {
    ...appMapStyle.map,
    height: showPano ? "50%" : "100%",
    backgroundColor: "white",
  };

  const onDidFinishLoadingMap = () => {
    setTimeout(() => {
      setIsMapReady(true);
    }, 500);
  };

  const PanoLoading = () => {
    return (
      <View
        style={{
          zIndex: 2,
          justifyContent: "center",
          ...StyleSheet.absoluteFillObject,
        }}
        pointerEvents="none"
      >
        <ActivityIndicator size="large" color="#191919" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {!isMapReady && <MapLoading />}
      {isPanoLoading && <PanoLoading />}


      <FocusAwareStatusBar
        barStyle="dark-content"
        backgroundColor={"transparent"}
        translucent={true}
      />
      {showPano && (
        <Pano
          hidePano={() => setShowPano(false)}
          pointInformation={pointInformation}
          navigation={navigation}
        />
      )}
      <MapView
        mapStyle={mapStyles}
        mapRef={mapRef}
        onDidFinishLoadingMap={onDidFinishLoadingMap}
        rotateEnabled={false}
      >
        <MapLibreGL.Camera
          animationMode={"flyTo"}
          ref={cameraRef}
          zoomLevel={6}
          centerCoordinate={initialCoordinate.current?.geometry?.coordinates}
        />
        <Points touchPoint={touchPoint} />
        <Lines zoomPoint={zoomPoint} />

        {showLocation && (
          <MapLibreGL.UserLocation
            renderMode={Platform.OS === "ios" ? "native" : "normal"}
            onUpdate={(e) => {
              if(!userCoordinate.current){
                initialCoordinate.current = point([e.coords.longitude, e.coords.latitude]);
                cameraRef.current?.setCamera({
                  centerCoordinate: [
                    e.coords.longitude,
                    e.coords.latitude,
                  ],
                  zoomLevel: 10,
                  heading: 0,
                  pitch: 0,
                  bearing: 0,
                });
              }
              userCoordinate.current = point([e.coords.longitude, e.coords.latitude]);
            }}
          />
        )}

        {clickedCoord && showPano && (
          <ActiveSources
            clickedCoord={clickedCoord}
            pointInformation={pointInformation}
          />
        )}
      </MapView>
      <View style={appMapStyle.watermark}>
        <MapilioBetaWatermark />
      </View>
      <AttributionButton />
      <View style={{ ...appMapStyle.mapButtons, marginBottom: RFValue(20) }}>
        <CenterToUserButton
          handleSetCenter={handleSetCenter}
          setShowUser={() => {
            setShowLocation(!showLocation);
          }}
        />
      </View>
      {/**  Mapbox cause overflow on early android versions. That's necessarry to call them in here for early devices. */}
      {!showPano && (
        <View
          style={[appMapStyle.topWrapper, { marginTop: top + RFValue(10) }]}
        >
          <Search camera={cameraRef} />
          <ProfileButton onPress={handleProfile} />
        </View>
      )}
    </View>
  );
};

export default memo(AppMap);
