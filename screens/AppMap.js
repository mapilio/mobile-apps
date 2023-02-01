import React, { memo, useEffect, useRef, useState, Fragment } from "react";
import { Dimensions, View, Platform } from "react-native";
import { appMapStyle } from "../styles/appMapStyle";
import MapboxGL, { Camera } from "@rnmapbox/maps";
import { RFValue } from "react-native-responsive-fontsize";
import { MapView } from "../highordercomponents";
import Config from "react-native-config";
import Geolocation from "react-native-geolocation-service";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Search } from "../components/Search";
import { initialPermissions } from "../helper/helper";
import { RESULTS } from "react-native-permissions";
import { point } from "@turf/turf";
import { useDispatch, useSelector } from "react-redux";
import { Routes } from "../navigator/Routes";
import FocusAwareStatusBar from "../components/FocusAwareStatusBar";
import { MAP_WATCH_ID } from "../store/actionsName";
import {
  ActiveSources,
  Lines,
  Points,
  Userlocation,
} from "../components/Map/layers";
import { CenterToUserButton, ProfileButton, Pano } from "../components/Map";

MapboxGL.setAccessToken(Config.MAPBOX_ACCESS_TOKEN);

const AppMap = ({ navigation }) => {
  const [imageInformations, setImageInformations] = useState(null);
  const [clickedCoord, setClickedCoord] = useState(null);
  const [showPano, setShowPano] = useState(false);
  const [userCoordinate, setUserCoordinate] = useState(undefined);
  const [initialCoord, setInitialCoord] = useState(null);
  const [showUser, setShowUser] = useState(false);
  const { connection } = useSelector((state) => state.generalReducer);
  let cameraRef = useRef();
  let mapRef = useRef();
  const { height } = Dimensions.get("window");
  const { bottom } = useSafeAreaInsets();
  const { auth } = useSelector((state) => state.getTokenReducer);
  const dispatch = useDispatch();

  useEffect(() => {
    !connection.connectionStatus &&
      navigation.navigate(Routes.noInternetAccess);

    const watchId = Geolocation.watchPosition(({ coords }) => {
      setUserCoordinate(point([coords.longitude, coords.latitude], coords));
      setShowUser(true)
    });
    dispatch({ type: MAP_WATCH_ID, payload: watchId });
    return () => Geolocation.clearWatch(watchId);
  }, []);

  useEffect(() => {
     Geolocation.getCurrentPosition(({coords}) => {
      setInitialCoord([coords.longitude, coords.latitude])
     })
  }, [showUser]);

  const contentHeight = height - bottom - RFValue(52);

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
        userCoordinate &&
          cameraRef.current?.setCamera({
            centerCoordinate: userCoordinate?.geometry?.coordinates,
            zoomLevel: 15,
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
    height: showPano ? contentHeight / 2 : contentHeight,
  };

  return (
    <View style={{ flex: 1 }}>
      <FocusAwareStatusBar
        barStyle="dark-content"
        backgroundColor={Platform.OS === "android" && "white"}
      />
      {showPano ? (
        <Pano
          hidePano={() => setShowPano(false)}
          imageInformation={imageInformations}
          navigation={navigation}
        />
      ) : (
        <Fragment>
          <Search camera={cameraRef} />
          <ProfileButton onPress={handleProfile} />
        </Fragment>
      )}

      <View>
        <MapView mapStyle={mapStyles} mapRef={mapRef}>
          <Camera
            animationMode={"none"}
            ref={cameraRef}
            followZoomLevel={15}
            zoomLevel={4}
            centerCoordinate={initialCoord}
          />
          <Points touchPoint={touchPoint} />
          <Lines zoomPoint={zoomPoint} />

         {showUser &&  <Userlocation shape={userCoordinate} />}

          {clickedCoord && showPano && (
            <ActiveSources
              clickedCoord={clickedCoord}
              imageInformations={imageInformations}
            />
          )}
        </MapView>
      </View>
      <CenterToUserButton
        handleSetCenter={handleSetCenter}
        setShowUser={setShowUser}
      />
    </View>
  );
};

export default memo(AppMap);
