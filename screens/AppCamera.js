import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import * as Brightness from 'expo-brightness';
import React, { useCallback, useEffect, useState } from 'react';
import { Camera, CameraSidebar } from '../components';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  BackHandler,
  StatusBar,
  StyleSheet,
  AppState,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import {
  GROUP_ID,
  SET_CAMERA_LOCATION,
  UPDATE_ACCURACY_LEVEL,
  UPDATE_GPS_ACCURACY,
  UPDATE_MOCKED_STATUS,
  UPDATE_OPENED_STATUS,
  UPDATE_PHOTO_AMOUNT,
} from '../store/actionsName';
import { useDispatch } from 'react-redux';
import * as ScreenOrientation from 'expo-screen-orientation';
import uuid from 'react-native-uuid';
import { exitCapture } from '../helper/camera';
import { Routes } from '../navigator/Routes';
import { useOrientation } from '../hooks/ui';
import { LocationAccuracy, watchPositionAsync } from 'expo-location';
import { captureException } from '@sentry/react-native';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { GoBackIcon } from '../assets/svg/illustrations';
import { useTranslation } from 'react-i18next';

const AppCamera = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const orientation = useOrientation();
  const { t } = useTranslation('camera');
  const [lowBrightness, setLowBrightness] = useState(false);

  const breakBrightness = () => {
    lowBrightness && Brightness.setSystemBrightnessAsync(0.7).then(() => setLowBrightness(false));
  };

  const closeHandler = useCallback(() => {
    exitCapture();

    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: Routes.uploadTab, params: { screen: Routes.captureCompleted } }],
      })
    );
  }, []);

  useEffect(() => {
    StatusBar.setHidden(true);
    dispatch({ type: GROUP_ID, payload: uuid.v4() });
    dispatch({ type: UPDATE_PHOTO_AMOUNT, payload: 0 });
    dispatch({ type: UPDATE_OPENED_STATUS, payload: false });
    activateKeepAwakeAsync('camera').catch((error) => toast.show(`${error}`, { type: 'error' }));

    let isMounted = true;
    let isForeground = AppState.currentState === 'active';
    let gpsGeneration = 0;
    let gpsSubscription = null;
    let pendingGpsRequest = null;

    const reportGpsError = (error, generation) => {
      if (!isMounted || !isForeground || generation !== gpsGeneration) {
        return;
      }

      captureException(error, {
        tags: {
          priority: 'GPSFatal',
          screen: 'AppCamera',
          function: 'watchPosition',
        },
      });
      toast.show('GPS Error. Please restart your app', { type: 'error' });
    };

    const stopGpsWatcher = () => {
      gpsGeneration += 1;
      const subscription = gpsSubscription;
      gpsSubscription = null;

      if (subscription && typeof subscription.remove === 'function') {
        subscription.remove();
      }
    };

    const startGpsWatcher = () => {
      if (!isMounted || !isForeground || gpsSubscription || pendingGpsRequest) {
        return;
      }

      const generation = ++gpsGeneration;
      let request;

      try {
        request = Promise.resolve(
          watchPositionAsync(
            {
              accuracy: LocationAccuracy.BestForNavigation,
              distanceInterval: 2,
              timeInterval: 0,
            },
            ({ coords, mocked }) => {
              if (!isMounted || !isForeground || generation !== gpsGeneration) {
                return;
              }

              dispatch({ type: UPDATE_MOCKED_STATUS, payload: mocked });
              dispatch({ type: SET_CAMERA_LOCATION, payload: coords });
              dispatch({
                type: UPDATE_GPS_ACCURACY,
                payload: coords.accuracy <= 35,
              });
              dispatch({
                type: UPDATE_ACCURACY_LEVEL,
                payload: Math.round(coords.accuracy),
              });
            }
          )
        );
      } catch (error) {
        reportGpsError(error, generation);
        return;
      }

      pendingGpsRequest = request;
      request
        .then((subscription) => {
          if (pendingGpsRequest === request) {
            pendingGpsRequest = null;
          }

          const stale = !isMounted || !isForeground || generation !== gpsGeneration;
          if (stale) {
            subscription?.remove?.();
            if (isMounted && isForeground) {
              startGpsWatcher();
            }
            return;
          }

          gpsSubscription = subscription;
        })
        .catch((error) => {
          if (pendingGpsRequest === request) {
            pendingGpsRequest = null;
          }

          const stale = !isMounted || !isForeground || generation !== gpsGeneration;
          if (stale) {
            if (isMounted && isForeground) {
              startGpsWatcher();
            }
            return;
          }

          reportGpsError(error, generation);
        });
    };

    const appStateSubscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        if (isForeground) {
          isForeground = false;
          stopGpsWatcher();
          dispatch({
            type: UPDATE_GPS_ACCURACY,
            payload: false,
          });
        }
      } else if (nextAppState === 'active' && !isForeground) {
        isForeground = true;
        startGpsWatcher();
      }
    });
    const backHandlerSubscription = BackHandler.addEventListener('hardwareBackPress', closeHandler);
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE).catch(
      captureException
    );
    startGpsWatcher();

    return () => {
      isMounted = false;
      isForeground = false;
      stopGpsWatcher();
      deactivateKeepAwake('camera').catch((error) => toast.show(`${error}`, { type: 'error' }));
      backHandlerSubscription.remove();
      appStateSubscription.remove();
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP).catch(
        captureException
      );
    };
  }, []);

  if (orientation !== 'LANDSCAPE') {
    return (
      <SafeAreaProvider>
        <SafeAreaView edges={['top', 'right', 'bottom', 'left']} style={styles.orientationScreen}>
          <TouchableOpacity
            style={styles.orientationExitButton}
            accessibilityRole="button"
            accessibilityLabel={t('exit_camera')}
            onPress={closeHandler}>
            <GoBackIcon />
          </TouchableOpacity>
          <View style={styles.orientationMessageWrapper}>
            <Text style={styles.orientationMessage}>{t('orientation_required')}</Text>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView
        edges={[]}
        style={{ flex: 1, flexDirection: 'row' }}
        onTouchEndCapture={breakBrightness}>
        <Camera />

        <LinearGradient
          colors={['rgba(51, 51, 51, 0)', 'rgba(0, 0, 0, 0.8)']}
          style={styles.gradient}
          start={{ x: 0, y: 1 }}>
          <CameraSidebar setLowBrightness={setLowBrightness} />
        </LinearGradient>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  orientationScreen: {
    flex: 1,
    backgroundColor: '#000000',
  },
  orientationExitButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 44,
    minHeight: 44,
    alignSelf: 'flex-end',
    margin: RFValue(8),
  },
  orientationMessageWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: RFValue(24),
  },
  orientationMessage: {
    color: '#FFFFFF',
    fontSize: RFValue(18),
    textAlign: 'center',
  },
  gradient: {
    padding: RFValue(16),
    position: 'absolute',
    right: 0,
    height: '100%',
    width: '25%',
    zIndex: 2,
  },
});
export default AppCamera;
