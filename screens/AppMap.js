import React, { memo, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, AppState } from 'react-native';
import { appMapStyle } from '../styles/appMapStyle';
import { RFValue } from 'react-native-responsive-fontsize';
import { MapView } from '../highordercomponents';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search } from '../components/Search';
import { initialPermissions } from '../helper/helper';
import { RESULTS } from 'react-native-permissions';
import { point } from '@turf/turf';
import { useDispatch, useSelector } from 'react-redux';
import { Routes } from '../navigator/Routes';
import FocusAwareStatusBar from '../components/FocusAwareStatusBar';
import { ActiveSources, Lines, Points } from '../components/Map/layers';
import { CenterToUserButton, ProfileButton, Pano, AttributionButton } from '../components/Map';
import { MapilioBetaWatermark } from '../assets/svg/illustrations';
import MapLoading from '../components/Map/MapLoading';
import { useTranslation } from 'react-i18next';
import { api } from '../util/helpers/api';
import * as MapLibreGL from '@maplibre/maplibre-react-native';
import { useCurrentPosition } from '@maplibre/maplibre-react-native';
import { getConfig, checkMaintenance } from '../store/actions/generalReducer';
import { NewsletterModal } from '../components/SocialLogin';
import { captureMessage } from '@sentry/react-native';
import { probeVectorTile } from '../util/mapOverlayHealth';
import { isUserInitiatedRegionMovement } from '../util/mapInteraction';
import { tileConfig } from '../config/tileConfig';

const DEFAULT_MAP_CENTER = [28.9784, 41.0082];
const MAP_OVERLAY_RETRY_MS = 60000;
const MAP_OVERLAY_PROBES = {
  roads: {
    template: tileConfig.roadUrl,
    coordinates: { zoom: 6, x: 37, y: 24 },
  },
  points: {
    template: tileConfig.pointUrl,
    coordinates: { zoom: 12, x: 2377, y: 1535 },
  },
};

const AppMap = ({ navigation }) => {
  const [pointInformation, setPointInformation] = useState(null);
  const [clickedCoord, setClickedCoord] = useState(null);
  const [showPano, setShowPano] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);
  const [isPanoLoading, setIsPanoLoading] = useState(false);
  const [showLocation, setShowLocation] = useState(true);
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);
  const [availableOverlays, setAvailableOverlays] = useState({
    roads: false,
    points: false,
  });
  const { welcomeWalkthroughStatus } = useSelector((state) => state.generalReducer);
  const { connection } = useSelector((state) => state.generalReducer);
  let cameraRef = useRef();
  let mapRef = useRef();
  const { top } = useSafeAreaInsets();
  const { auth } = useSelector((state) => state.getTokenReducer);
  const { t } = useTranslation('map');
  const initialCoordinate = useRef(null);
  const appState = useRef(AppState.currentState);
  const dispatch = useDispatch();
  const followUserLocation = useRef(false);
  const currentPosition = useCurrentPosition({
    enabled: locationPermissionGranted && showLocation,
  });
  const overlayAvailabilityRef = useRef({ roads: null, points: null });

  useEffect(() => {
    if (followUserLocation.current && currentPosition) {
      cameraRef.current?.setStop({
        center: [currentPosition.coords.longitude, currentPosition.coords.latitude],
        zoom: 15,
        bearing: 0,
        pitch: 0,
        duration: 1000,
      });
    }
  }, [currentPosition]);

  useEffect(() => {
    let active = true;
    let retryTimer;

    const reportTransition = (name, result) => {
      if (overlayAvailabilityRef.current[name] === result.available) {
        return;
      }

      const diagnostic = {
        event: 'map_overlay_health',
        overlay: name,
        available: result.available,
        reason: result.reason,
        status: result.status,
      };

      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.info('[map-overlay]', diagnostic);
      } else if (!result.available) {
        captureMessage('Map overlay unavailable', {
          level: 'warning',
          tags: {
            overlay: name,
            reason: result.reason,
          },
          extra: diagnostic,
        });
      }
    };

    const checkOverlays = async (names = Object.keys(MAP_OVERLAY_PROBES)) => {
      const results = await Promise.all(
        names.map(async (name) => [name, await probeVectorTile(MAP_OVERLAY_PROBES[name])])
      );

      if (!active) {
        return;
      }

      const nextAvailability = { ...overlayAvailabilityRef.current };
      const unavailable = [];

      results.forEach(([name, result]) => {
        reportTransition(name, result);
        nextAvailability[name] = result.available;
        if (!result.available) {
          unavailable.push(name);
        }
      });

      overlayAvailabilityRef.current = nextAvailability;
      setAvailableOverlays(nextAvailability);

      if (unavailable.length > 0) {
        retryTimer = setTimeout(() => checkOverlays(unavailable), MAP_OVERLAY_RETRY_MS);
      }
    };

    checkOverlays();

    return () => {
      active = false;
      clearTimeout(retryTimer);
    };
  }, []);

  useEffect(() => {
    !connection.connectionStatus && navigation.navigate(Routes.noInternetAccess);
    initialPermissions()
      .then((status) => setLocationPermissionGranted(status === RESULTS.GRANTED))
      .catch(() => setLocationPermissionGranted(false));

    const listener = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      listener.remove();
    };
  }, []);

  const handleAppStateChange = (nextAppState) => {
    if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
      dispatch(getConfig());
      dispatch(checkMaintenance());
    }
    appState.current = nextAppState;
  };

  useEffect(() => {
    if (!isMapReady && welcomeWalkthroughStatus) {
      toast.show(t('map_loading'), {
        type: 'loading',
        duration: 3000,
      });
    } else {
      toast.hideAll();
    }
  }, [isMapReady]);

  const zoomPoint = (coordinates) => {
    mapRef.current?.getZoom().then((zoomLevel) => {
      cameraRef.current?.setStop({
        center: [coordinates?.[0], coordinates?.[1]],
        zoom: zoomLevel + 3,
        duration: 800,
      });
    });
  };

  const touchPoint = async (e) => {
    cameraRef.current?.setStop({
      center: e.features[0]?.geometry?.coordinates,
      duration: 200,
    });

    const { geometry, properties } = e.features[0];
    setClickedCoord(geometry.coordinates);
    if (!showPano) {
      setIsPanoLoading(true);
    }

    const imageDetails = await api
      .get('/api/sequence-detail?sequence_uuid=' + properties.sequence_uuid)
      .then((res) => {
        const image = res.data.find((image) => image.id === properties.id);
        return image;
      })
      .catch(() => {
        toast.show(t('pano_error'), { type: 'error' });
      });

    setPointInformation({
      sequenceID: properties.sequence_uuid,
      date: imageDetails.capture_time,
      user: properties.created_by_id,
      pointID: properties.id,
      heading: imageDetails.heading,
      resolution: imageDetails.resolution,
      image: `${process.env.EXPO_PUBLIC_IMAGE_API}/${imageDetails.uploaded_hash}/${imageDetails.filename}/480`,
      highResImage: `${process.env.EXPO_PUBLIC_IMAGE_API}/${imageDetails.uploaded_hash}/${imageDetails.filename}/1080`,
    });

    setIsPanoLoading(false);
    setShowPano(true);
  };

  const handleSetCenter = async () => {
    const status = locationPermissionGranted ? RESULTS.GRANTED : await initialPermissions();
    const granted = status === RESULTS.GRANTED;
    setLocationPermissionGranted(granted);

    if (!granted) {
      toast.show(t('gps_disabled'), { type: 'error' });
      return;
    }

    setShowLocation(true);
    followUserLocation.current = !followUserLocation.current;
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
    height: showPano ? '50%' : '100%',
    backgroundColor: 'white',
  };

  const onDidFinishLoadingMap = () => {
    setIsMapReady(true);
  };

  const PanoLoading = () => {
    return (
      <View
        style={{
          zIndex: 2,
          justifyContent: 'center',
          ...StyleSheet.absoluteFillObject,
        }}
        pointerEvents="none">
        <ActivityIndicator size="large" color="#191919" />
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {!isMapReady && <MapLoading style={{ position: 'absolute', zIndex: 10 }} />}
      {isPanoLoading && <PanoLoading />}
      <NewsletterModal />

      <FocusAwareStatusBar
        barStyle="dark-content"
        backgroundColor={'transparent'}
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
        onRegionDidChange={(event) => {
          if (isUserInitiatedRegionMovement(event)) {
            followUserLocation.current = false;
          }
        }}
        touchRotate={false}>
        <MapLibreGL.Camera
          easing={'fly'}
          ref={cameraRef}
          zoom={6}
          center={initialCoordinate.current?.geometry?.coordinates ?? DEFAULT_MAP_CENTER}
        />
        {isMapReady && availableOverlays.points && <Points touchPoint={touchPoint} />}
        {isMapReady && availableOverlays.roads && <Lines zoomPoint={zoomPoint} />}

        {locationPermissionGranted && showLocation && (
          <MapLibreGL.UserLocation accuracy heading minDisplacement={1} />
        )}

        {clickedCoord && showPano && (
          <ActiveSources clickedCoord={clickedCoord} pointInformation={pointInformation} />
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
      {/* Keep these controls outside the map view for early Android rendering compatibility. */}
      {!showPano && (
        <View style={[appMapStyle.topWrapper, { marginTop: top + RFValue(10) }]}>
          <Search camera={cameraRef} />
          <ProfileButton onPress={handleProfile} />
        </View>
      )}
    </View>
  );
};

export default memo(AppMap);
