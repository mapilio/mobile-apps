import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Touchable,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { appMapStyle } from "../styles/appMapStyle";
import MapboxGL, { Logger } from "@react-native-mapbox-gl/maps";
import SearchIcon from "../assets/svg/illustrations/SearchIcon";
import Pano from "../components/Map/Pano";
import CurrentLocationIcon from "../assets/svg/illustrations/CurrentLocationIcon";
import PanoMinimize from "../assets/svg/illustrations/PanoMinimize";
import SlidingUpPanel from "rn-sliding-up-panel";
import { RFValue } from "react-native-responsive-fontsize";
import SearhcbarSwipe from "../components/SearchbarSwipe";

MapboxGL.setAccessToken(
  "pk.your_mapbox_public_token"
);

// const coordinates = [
//     [-73.98330688476561, 40.76975180901395],
//     [-73.96682739257812, 40.761560925502806],
//     [-74.00751113891602, 40.746346606483826],
//     [-73.95343780517578, 40.7849607714286],
//     [-73.99017333984375, 40.71135347314246],
//     [-73.98880004882812, 40.758960433915284],
//     [-73.96064758300781, 40.718379593199494],
//     [-73.95172119140624, 40.82731951134558],
//     [-73.9829635620117, 40.769101775774935],
//     [-73.9822769165039, 40.76273111352534],
//     [-73.98571014404297, 40.748947591479705]
// ]

const styles = {
  circles: {
    circleRadius: [
      "interpolate",
      ["exponential", 1.75],
      ["zoom"],
      12,
      2,
      22,
      180,
    ],

    circleColor: "#49b5f8",
  },
};

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
  const [imageInformations, setImageInformations] = useState(null);
  const [openSearchbar, setOpenSearchbar] = useState(false);
  const [minimizePano, setMinimizePano] = useState(false);
  const [flyLocation, setFlyLocation] = useState([29.9081, 40.8793]);
  const [showPano, setShowPano] = useState(true);
  const [clickedCoord, setClickedCoord] = useState([30.8, 41.015137]);
  const [hide, setHide] = useState(false);
  let cameraRef = useRef();
  let panelRef = useRef();
  let mapRef = useRef();

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
      panelRef.current.show(400);
    }
  }, [openSearchbar]);

  // function renderAnnotation(counter) {
  //     const id = `pointAnnotation${counter}`;
  //     const coordinate = coordinates[counter];
  //     const title = `Longitude: ${coordinates[counter][0]} Latitude: ${coordinates[counter][1]}`;
  //
  //     return (
  //         <MapboxGL.PointAnnotation
  //             key={id}
  //             id={id}
  //             title='Test'
  //             coordinate={coordinate}>
  //
  //             {/*<Image*/}
  //             {/*    source={require('../common/images/marker.png')}*/}
  //             {/*    style={{*/}
  //             {/*        flex: 1,*/}
  //             {/*        resizeMode: 'contain',*/}
  //             {/*        width: 25,*/}
  //             {/*        height: 25*/}
  //             {/*    }}/>*/}
  //         </MapboxGL.PointAnnotation>
  //     );
  // }
  //
  // function renderAnnotations() {
  //     const items = [];
  //
  //     for (let i = 0; i < coordinates.length; i++) {
  //         items.push(renderAnnotation(i));
  //     }
  //
  //     return items;
  // }

  const touchPoint = (e) => {
    const pointFeatures = e.features[0].properties;
    setClickedCoord([e.coordinates.longitude, e.coordinates.latitude]);
    setImageInformations({
      sequenceID: pointFeatures.SEQUENCE_UUID,
      date: pointFeatures.created_at,
      user: pointFeatures.created_by_id,
      pointID: pointFeatures.id,
      heading: pointFeatures.heading,
      image: `https://cdn.mapilio.com/im/${pointFeatures.img_code}/${pointFeatures.filename}/480`,
    });
    setShowPano(false);
  };

  const willHide = async (e) => {
    const zoom = await mapRef.current.getZoom();
    if (Math.round(zoom) < 10) {
      setHide(true);
    } else {
      setHide(false);
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
        <View
          onStartShouldSetResponder={() => setOpenSearchbar((state) => !state)}
          style={appMapStyle.searchIcon}
        >
          <SearchIcon width={19.55} height={19.55} />
        </View>
      )}
      {openSearchbar ? (
        <SlidingUpPanel
          draggableRange={{ top: height, bottom: RFValue(60) }}
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
          <SearhcbarSwipe setFly={setFlyLocation} panelRef={panelRef} />
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
        <MapboxGL.MapView
          styleURL={MapboxGL.StyleURL.Light}
          style={appMapStyle.map}
          onRegionDidChange={willHide}
          ref={mapRef}
        >
          <MapboxGL.UserLocation
            ref={(location) => location}
            showsUserHeadingIndicator
          />

          <MapboxGL.VectorSource
            id="road-points"
            url={"mapbox://your_tileset_url"}
            onPress={touchPoint}
          >
            <MapboxGL.CircleLayer
              id="mapilio_point_v1"
              sourceLayerID="mapilio_point_v1"
              style={styles.circles}
              layerIndex={60}
            />
          </MapboxGL.VectorSource>

          {clickedCoord && !hide ? (
            <MapboxGL.PointAnnotation
              key="pointAnnotation"
              id="pointAnnotation"
              coordinate={clickedCoord}
              style={{ zIndex: 1000 }}
            >
              <Image
                source={require("../assets/images/heding.png")}
                resizeMode={"cover"}
                style={{
                  transform: [{ rotate: imageInformations ? `${imageInformations.heading}deg` : '0deg' }],
                }}
                width={80}
                height={80}
              />
            </MapboxGL.PointAnnotation>
          ) : null}

          {/*{renderAnnotations()}*/}

          <MapboxGL.Camera
            ref={cameraRef}
            centerCoordinate={flyLocation}
            zoomLevel={7}
            animationMode={"flyTo"}
            animationDuration={1000}
          />
        </MapboxGL.MapView>
      </View>

      <View style={[appMapStyle.currentIcon]}>
        <CurrentLocationIcon />
      </View>
    </View>
  );
};

export default AppMap;
