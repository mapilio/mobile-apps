import { Fragment, useEffect, useRef, useState } from 'react';
import { Animated, PermissionsAndroid, Platform, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import {
  IS_ACTIVE,
  UPDATE_DISTANCE_BETWEEN,
  UPDATE_LOW_RESOLUTION,
  UPDATE_DEFAULT_STORAGE,
} from '../store/actionsName';
import { CustomText, CustomTextMedium } from '../highordercomponents';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Slider } from '@miblanchard/react-native-slider';
import { Snackbar, Switch } from 'react-native-paper';
import { DeviceIcon, SDCardIcon } from '../assets/svg/illustrations';
import * as RNFS from 'react-native-fs';
import { PERMISSIONS, request } from 'react-native-permissions';

const GeneralSettings = ({ navigation }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation('camera_settings');
  const { distanceBetween, lowResolution, defaultStoragePath } = useSelector(
    (state) => state.settingsReducer
  );
  const { photoAmount, batteryLevel, phoneMemory } = useSelector(
    (state) => state.cameraReducer
  );
  const [showSnackbar, setShowSnackbar] = useState(false);

  const { left, right } = useSafeAreaInsets();
  const translateX = useRef(new Animated.Value(defaultStoragePath !== 'internal' ? RFValue(100) : RFValue(0) )).current;

  const animatedStyle = {
    transform: [
      { translateX: translateX },
    ],
  };

  const changeDefaultStorage = async (storage) => {
    if (storage === 'internal'){
      dispatch({ type: UPDATE_DEFAULT_STORAGE, payload: 'internal' });
    }

    if (storage === 'external'){
      // List directories in the /storage folder
      const sdCardPath = await RNFS.getAllExternalFilesDirs()
      //find emulated path and delete emulated storage
      const emulatedStorage = sdCardPath.filter((path) => path.includes('emulated'))
      if (emulatedStorage.length > 0) {
        sdCardPath.splice(sdCardPath.indexOf(emulatedStorage[0]), 1)
      }
      if (sdCardPath.length === 0) return toast.show(t("please-pluck-sdcard"), {type: 'info'});

      const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

      let granted = false

      if (Number(Platform.Version) >= 33) granted = true

      const hasPermission = await PermissionsAndroid.check(permission);

      if (hasPermission) {
        granted = true
      }

      if (!granted) {
        const req = await PermissionsAndroid.request(permission,
          {
            title: t('storage-permission.title'),
            message: t('storage-permission.message'),
            buttonNeutral: t('storage-permission.buttonNeutral'),
            buttonNegative: t('storage-permission.buttonNegative'),
            buttonPositive: t('storage-permission.buttonPositive'),
          },
        );
        if (req === PermissionsAndroid.RESULTS.GRANTED) granted = true
      }

      if (granted){
        dispatch({ type: UPDATE_DEFAULT_STORAGE, payload: 'external' });
      } else return
    }

    Animated.timing(translateX, {
      toValue: storage === 'internal' ? RFValue(0) : RFValue(100),
      duration: 200,
      useNativeDriver: true,
    }).start();
  };


  useEffect(() => {
    dispatch({ type: IS_ACTIVE, payload: false });
    return () => {
      dispatch({ type: IS_ACTIVE, payload: true });
    };
  }, []);

  const changeDistanceValue = (value) => {
    if (distanceBetween !== value[0]) {
      dispatch({ type: UPDATE_DISTANCE_BETWEEN, payload: value[0] });
    }
  };

  const onToggleSwitch = () => {
    setShowSnackbar(true);
    dispatch({ type: UPDATE_LOW_RESOLUTION, payload: !lowResolution });
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      StatusBar.setHidden(true);
    });
    return () => unsubscribe();
  }, [navigation]);

  const safeAreaPaddings = {
    paddingLeft: left ? left : RFValue(35),
    paddingRight: right ? right : RFValue(35),
  };

  return (
    <View style={styles.wrapper}>
      <Snackbar
        visible={showSnackbar}
        duration={3000}
        onDismiss={() => {
          setShowSnackbar(false);
        }}
        wrapperStyle={{
          zIndex: 2,
        }}
        action={{
          label: t('ok'),
          color: '#fff',
        }}
      >
        {t('settings_saved')}
      </Snackbar>

      <View style={styles.item}>
        <View style={safeAreaPaddings}>
          <CustomText style={styles.itemMenuTitle}>
            {t('camera_settings')}
          </CustomText>
          <CustomText style={styles.itemTitle}>
            {t('distance_between')}
          </CustomText>
          <View style={styles.row}>
            <Slider
              minimumValue={5}
              maximumValue={15}
              step={1}
              value={distanceBetween}
              onValueChange={changeDistanceValue}
              containerStyle={{ width: '90%' }}
              minimumTrackTintColor={'#3F8BE9'}
              maximumTrackTintColor={'#C7C7CC'}
              thumbStyle={styles.thumbStyle}
            />
            <CustomTextMedium
              style={{ ...styles.itemDesc, marginLeft: RFValue(13) }}
            >
              {distanceBetween} m
            </CustomTextMedium>
          </View>
          {Platform.OS === 'ios' && (
            <Fragment>
              <View style={styles.seperator} />
              <View style={styles.row}>
                <View style={{ flexDirection: 'column' }}>
                  <CustomText style={styles.itemTitle}>
                    {t('enable_low_resolution')}
                  </CustomText>
                  <CustomText style={{ color: 'grey' }}>
                    {t('enable_low_resolution_desc')}
                  </CustomText>
                </View>
                <Switch
                  value={lowResolution}
                  onChange={onToggleSwitch}
                  color="#0056F1"
                />
              </View>
            </Fragment>
          )}
        </View>
      </View>
      <View style={styles.padding} />

      <View style={styles.item}>
        <View style={safeAreaPaddings}>
          <CustomText style={styles.itemMenuTitle}>
            {t('capture_settings')}
          </CustomText>
          <View style={styles.row}>
            <CustomText style={styles.itemTitle}>
              {t('remaining_images')}
            </CustomText>
            <View style={styles.row}>
              <CustomTextMedium
                style={{ ...styles.itemDesc, color: '#3F8BE9' }}
              >
                {photoAmount}{' '}
              </CustomTextMedium>
              <CustomTextMedium style={styles.itemDesc}>
                / {phoneMemory}
              </CustomTextMedium>
            </View>
          </View>
          <View style={styles.seperator} />
          <View style={styles.row}>
            <CustomText style={styles.itemTitle}>
              {t('battery_level')}
            </CustomText>
            <CustomText style={styles.itemDesc}>%{batteryLevel}</CustomText>
          </View>

          {Platform.OS === 'android' && (
            <View style={styles.row}>
              <CustomText style={styles.itemTitle}>
                {t('default_storage')}
              </CustomText>
              <View style={styles.customButtonWrapper}>
                <TouchableOpacity style={styles.customRowButton} onPress={()=>changeDefaultStorage('internal')}>
                  <DeviceIcon />
                  <CustomText style={styles.customRowButtonText}>Device</CustomText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.customRowButton} onPress={()=>changeDefaultStorage('external')}>
                  <SDCardIcon />
                  <CustomText style={styles.customRowButtonText}>SD Card</CustomText>
                </TouchableOpacity>
                <Animated.View style={[styles.customButtonBackdrop, animatedStyle]} />
              </View>
            </View>
          )}

        </View>
      </View>


    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  itemMenuTitle: {
    fontSize: RFValue(12),
    color: '#666666',
    marginBottom: RFValue(6),
    fontFamily: 'Poppins-Medium',
  },
  seperator: {
    height: RFValue(2),
    backgroundColor: '#EAEAEA',
    marginVertical: RFValue(4),
  },
  padding: {
    marginVertical: RFValue(5),
  },
  item: {
    backgroundColor: '#F7F7F7',
    paddingVertical: RFValue(8),
  },
  itemDesc: {
    fontSize: RFValue(15),
    color: '#333333',
    fontFamily: 'Poppins-Medium',
  },
  itemTitle: {
    fontSize: RFValue(14),
    color: '#333333',
    fontFamily: 'Poppins-Medium',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: RFValue(2),
  },
  thumbStyle: {
    width: RFValue(18),
    height: RFValue(18),
    borderRadius: RFValue(9),
    backgroundColor: '#3F8BE9',
    borderColor: '#FFFFFF',
    borderWidth: RFValue(2),
  },
  customButtonWrapper: {
    marginTop: RFValue(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#C2C2C2',
    minHeight: RFValue(36),
    borderRadius: RFValue(24),
    minWidth: RFValue(204),
  },
  customRowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: RFValue(100),
    justifyContent: 'center',
    borderRadius: RFValue(24),
    color: '#ECECEC',
  },
  customRowButtonText: {
    color: '#ECECEC',
    fontSize: RFValue(14),
    marginLeft: RFValue(5),
    lineHeight: RFValue(20),
  },
  customButtonBackdrop: {
    position: 'absolute',
    width: '50%',
    height: RFValue(32),
    top: RFValue(2),
    zIndex: -1,
    backgroundColor: '#0056F1',
    borderRadius: RFValue(24),
    left: RFValue(2),
  },
});

export default GeneralSettings;
