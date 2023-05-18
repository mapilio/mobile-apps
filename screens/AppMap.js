import React, { memo, useEffect, useRef, useState } from "react";
import { Platform, View } from "react-native";
import { appMapStyle } from "../styles/appMapStyle";
import { RFValue } from "react-native-responsive-fontsize";
import { MapView } from "../highordercomponents";
import Config from "react-native-config";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Search } from "../components/Search";
import { initialPermissions } from "../helper/helper";
import { RESULTS } from "react-native-permissions";
import { point } from "@turf/turf";
import { useSelector, useDispatch } from "react-redux";
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

const AppMap = ({ navigation }) => {
  const [pointInformation, setPointInformation] = useState(null);
  const [clickedCoord, setClickedCoord] = useState(null);
  const [showPano, setShowPano] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);
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

  useEffect(() => {
    !connection.connectionStatus &&
      navigation.navigate(Routes.noInternetAccess);
      initialPermissions();
  }, []);


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

  const zoomPoint = (coordinate) => {
    mapRef.current?.getZoom().then((zoomLevel) => {
      cameraRef.current?.setCamera({
        centerCoordinate: coordinate,
        zoomLevel: zoomLevel + 5,
      });
    });
  };

  const touchPoint = async (e) => {
    const { geometry, properties } = e.features[0];
    setClickedCoord(geometry.coordinates);

    const filter = `&CQL_FILTER=id=${properties.id}&PropertyName=(sequence_uuid,uploaded_hash,filename,heading,resolution,capture_time,created_by_id)`;
    const imageURL = Config.MAPBOX_INFO_URL + filter;
    const imageDetails = await api
      .get(imageURL)
      .then((res) => res.features[0])
      .catch(() => {
        toast.show(t("pano_error"), { type: "error" });
      });

    setPointInformation({
      sequenceID: properties.sequence_uuid,
      date: properties.created_at,
      user: properties.created_by_id,
      pointID: properties.id,
      heading: imageDetails.properties.heading,
      resolution: imageDetails.properties.resolution,
      image: `${Config.IMAGE_API}/${imageDetails.properties.uploaded_hash}/${imageDetails.properties.filename}/480`,
      highResImage: `${Config.IMAGE_API}/${imageDetails.properties.uploaded_hash}/${imageDetails.properties.filename}/1080`,
    });

    setShowPano(true);
  };

  const handleSetCenter = async () => {
    initialPermissions().then((res) => {
      if (res !== RESULTS.GRANTED) {
        toast.show(`Your GPS is disabled.`, { type: "error" });
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
          centerCoordinate={userCoordinate.current?.geometry?.coordinates}
        />
        <Points touchPoint={touchPoint} />
        <Lines zoomPoint={zoomPoint} />

        {showLocation && (
          <MapLibreGL.UserLocation
            renderMode={Platform.OS === "ios" ? "native" : "normal"}
            animated
            onUpdate={(e) => {
              if(!userCoordinate.current){
                cameraRef.current?.setCamera({
                  centerCoordinate: [
                    e.coords.longitude,
                    e.coords.latitude,
                  ],
                  zoomLevel: 10,
                  heading: 0,
                  pitch: 0,
                  bearing: 0,
                  animationDuration: 500,
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
