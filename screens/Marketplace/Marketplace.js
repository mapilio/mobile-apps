import React, { useEffect, useMemo, useRef, useState } from 'react';
import { TouchableOpacity, View, StyleSheet, Platform } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { RFValue } from 'react-native-responsive-fontsize';
import { List, MarketplaceMap } from '../../components/Marketplace';
import { getContentAreaHeight } from '../../helper/helper';
import { useDispatch } from 'react-redux';
import { MARKETPLACE_DATA } from '../../store/actionsName';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CustomTextMedium } from '../../highordercomponents';
import { Document } from '../../assets/svg/illustrations';
import FocusAwareStatusBar from '../../components/FocusAwareStatusBar';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import MapLoading from '../../components/Map/MapLoading';
import { MapilioBetaWatermark } from '../../assets/svg/illustrations';
import { appMapStyle } from '../../styles/appMapStyle';
import { api } from '../../util/helpers/api';
import { getCurrentPositionAsync } from 'expo-location';

const Marketplace = ({ navigation }) => {
  const { t } = useTranslation('marketplace');
  const slidePanel = useRef();
  const dispatch = useDispatch();
  const { top, bottom } = useSafeAreaInsets();
  const [onScroll, setOnScroll] = useState(false);
  const [currentCoordinate, setCurrentCoordinate] = useState({ latitude: 0, longitude: 0 });
  const [isMapReady, setIsMapReady] = useState(false);
  const { isInitialized } = useSelector((state) => state.tooltipReducer.marketplace);

  // Snap points: ~40% (item detail) and ~60% (full list)
  const snapPoints = useMemo(() => ['40%', '60%'], []);

  useEffect(() => {
    getCurrentPositionAsync({
      accuracy: Platform.OS === 'ios' ? 3 : 6,
    }).then(({ coords: { latitude, longitude } }) => {
      setCurrentCoordinate({ latitude, longitude });
    });
  }, []);

  useEffect(() => {
    if (!isMapReady && isInitialized) {
      toast.show(t('map_loading'), { type: 'loading', duration: 3000 });
    } else {
      toast.hideAll();
    }
  }, [isMapReady]);

  useEffect(() => {
    let url = `${process.env.EXPO_PUBLIC_SERVICE_URL}/api/get-marketplaces`;
    const { latitude, longitude } = currentCoordinate;

    if (latitude !== 0 && longitude !== 0) {
      url += `?lat=${latitude}&lon=${longitude}`;
    }

    api
      .get(url)
      .then(({ data: { geojson } }) => {
        dispatch({ type: MARKETPLACE_DATA, payload: JSON.parse(geojson) });
      })
      .catch(
        ({
          response: {
            data: { message },
          },
        }) => {
          toast.show(`${message}`, { type: 'error' });
        }
      );
  }, [currentCoordinate]);

  useEffect(() => {
    if (!isInitialized) {
      slidePanel.current?.snapToIndex(1);
    }
  }, [isInitialized]);

  const onDidFinishLoadingMap = () => {
    setTimeout(() => {
      setIsMapReady(true);
    }, 300);
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      {!isMapReady && <MapLoading />}
      <MarketplaceMap navigation={navigation} onDidFinishLoadingMap={onDidFinishLoadingMap} />
      <FocusAwareStatusBar
        barStyle="dark-content"
        backgroundColor={'transparent'}
        translucent={true}
      />

      <TouchableOpacity onPress={() => slidePanel.current?.snapToIndex(1)} style={styles.button}>
        <Document />
        <View style={{ width: RFValue(3) }} />
        <CustomTextMedium style={{ color: '#FFF', fontSize: RFValue(12) }}>
          {t('market_list')}
        </CustomTextMedium>
      </TouchableOpacity>

      <View style={appMapStyle.watermark}>
        <MapilioBetaWatermark />
      </View>
      <BottomSheet
        ref={slidePanel}
        snapPoints={snapPoints}
        index={-1}
        enableDynamicSizing={false}
        enablePanDownToClose={true}
        enableHandlePanningGesture={!onScroll}
        enableContentPanningGesture={!onScroll}
        style={{ zIndex: 6 }}>
        <List navigation={navigation} setOnScroll={setOnScroll} slidePanel={slidePanel} />
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    display: 'flex',
    backgroundColor: '#191919',
    marginTop: 'auto',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: RFValue(24),
    height: RFValue(36),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: RFValue(18),
    borderRadius: RFValue(18),
    flexDirection: 'row',
    zIndex: 2,
  },
});

export default Marketplace;
