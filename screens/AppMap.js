import React, { memo, useEffect, useRef, useState} from "react";
import { AppState, View } from "react-native";
import { appMapStyle } from "../styles/appMapStyle";
import MapboxGL, { Camera } from "@rnmapbox/maps";
import { RFValue } from "react-native-responsive-fontsize";
import { MapView } from "../highordercomponents";
import Config from "react-native-config";
import Geolocation from "@react-native-community/geolocation";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Search } from "../components/Search";
import { initialPermissions } from "../helper/helper";
import { RESULTS } from "react-native-permissions";
import { point } from "@turf/turf";
import { useSelector } from "react-redux";
import { Routes } from "../navigator/Routes";
import FocusAwareStatusBar from "../components/FocusAwareStatusBar";
import {
  ActiveSources,
  Buildings,
  Lines,
  Points,
  Userlocation,
} from "../components/Map/layers";
import {
  CenterToUserButton,
  ProfileButton,
  Pano,
  ToggleBuildings,
} from "../components/Map";
import { MapilioBetaWatermark } from "../assets/svg/illustrations";
import MapLoading from "../components/Map/MapLoading";
import { useTranslation } from "react-i18next";

MapboxGL.setAccessToken(Config.MAPBOX_ACCESS_TOKEN);

const AppMap = ({ navigation }) => {
  const [imageInformations, setImageInformations] = useState(null);
  const [clickedCoord, setClickedCoord] = useState(null);
  const [showPano, setShowPano] = useState(false);
  const [userCoordinate, setUserCoordinate] = useState(undefined);
  const [initialCoord, setInitialCoord] = useState(undefined);
  const [isMapReady, setIsMapReady] = useState(false);
  const [showUser, setShowUser] = useState(true);
  const [showBuildings, setShowBuildings] = useState(false);
  const { welcomeWalkthroughStatus } = useSelector(
    (state) => state.generalReducer
  );
  const { connection } = useSelector((state) => state.generalReducer);
  let cameraRef = useRef();
  let mapRef = useRef();
  const {top} = useSafeAreaInsets();
  const {auth} = useSelector((state) => state.getTokenReducer);
  const {t} = useTranslation("map");

  const watchID = useRef();
  const appState = useRef(AppState.currentState);

  const watchLocation = async () => {
    await initialPermissions();

    watchID.current = Geolocation.watchPosition(({coords}) => {
      setUserCoordinate(point([coords.longitude, coords.latitude], coords));
    });
  }

  useEffect(() => {
    !connection.connectionStatus && navigation.navigate(Routes.noInternetAccess);
    
    watchLocation()
    const subscription = AppState.addEventListener("change", (state) => {
        if(appState.current.match(/inactive|background/) && state === "active") {
          watchLocation()
        }else{
            Geolocation.clearWatch(watchID.current);
        }
        appState.current = state;

    });

    return () => {
      Geolocation.clearWatch(watchID.current);
      subscription.remove();
    };
  }, []);

  useEffect(() => {
     Geolocation.getCurrentPosition(({coords}) => {
      setInitialCoord([coords.longitude, coords.latitude])
     })
  }, [showUser]);

  useEffect(() => {
    if (!isMapReady && welcomeWalkthroughStatus ) {
     toast.show(t("map_loading"), {
        type: "loading",
        duration: 3000,
      });
    } else {
      toast.hideAll();
    }
  }, [isMapReady]);

  useEffect(() => {
    cameraRef.current?.setCamera({
      pitch: showBuildings ? 60 : 0,
      heading: 0,
      animationDuration: 300,
    });
  }, [showBuildings]);

  const zoomPoint = (coordinate) => {
    mapRef.current?.getZoom().then((zoomLevel) => {
      cameraRef.current?.setCamera({
        centerCoordinate: coordinate,
        zoomLevel: zoomLevel + 5,
      });
    });
  };

  const touchPoint = (e) => {
    const { geometry, properties } = e.features[0];
    setClickedCoord(geometry.coordinates);
    setImageInformations({
      sequenceID: properties.sequence_uuid,
      date: properties.created_at,
      user: properties.created_by_id,
      pointID: properties.id,
      heading: properties.heading,
      resolution: properties.resolution,
      image: `${Config.IMAGE_API}/${properties.uploaded_hash}/${properties.filename}/480`,
      highResImage: `${Config.IMAGE_API}/${properties.uploaded_hash}/${properties.filename}/1080`,
    });
    setShowPano(true);

  };

  const handleSetCenter = async () => {
    initialPermissions().then((res) => {
      if (res !== RESULTS.GRANTED) {
        toast.show(`Your GPS is disabled.`, { type: "error" });
      } else {
          cameraRef.current?.setCamera({
            centerCoordinate: userCoordinate.geometry.coordinates,
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
      navigation.navigate(Routes.stackNavigator, {screen: Routes.profileNavigator});
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

  return (
    <View style={{ flex: 1 }}>
     {!isMapReady && <MapLoading />}
     
      <FocusAwareStatusBar
        barStyle="dark-content"
        backgroundColor={"transparent"}
        translucent={true}
      />
      {showPano && (
        <Pano
          hidePano={() => setShowPano(false)}
          imageInformation={imageInformations}
          navigation={navigation}
        />
      )}
      <MapView
        mapStyle={mapStyles}
        mapRef={mapRef}
        onDidFinishLoadingMap={onDidFinishLoadingMap}
        rotateEnabled
      >
        <Camera
          animationMode={"none"}
          ref={cameraRef}
          zoomLevel={4}
          centerCoordinate={initialCoord}
        />
        <Points touchPoint={touchPoint} />
        <Lines zoomPoint={zoomPoint} />

        {showBuildings && <Buildings />}

        {showUser && userCoordinate && <Userlocation shape={userCoordinate} />}

        {clickedCoord && showPano && (
          <ActiveSources
            clickedCoord={clickedCoord}
            imageInformations={imageInformations}
          />
        )}
      </MapView>
      <View style={appMapStyle.watermark}>
        <MapilioBetaWatermark />
      </View>
      <CenterToUserButton
        handleSetCenter={handleSetCenter}
        setShowUser={setShowUser}
      />
      <ToggleBuildings isActive={showBuildings}  toggleBuildings={setShowBuildings} />
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
