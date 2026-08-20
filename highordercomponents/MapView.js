import React, { Fragment, memo } from 'react';
import MapLibreGL, { LogManager } from '@maplibre/maplibre-react-native';
import { AttributionButton } from '../components/Map';
import { appMapStyle } from '../styles/appMapStyle';
import { Platform, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useActionSheet } from '@expo/react-native-action-sheet';
import * as Linking from 'expo-linking';

LogManager.setLogLevel('error');

const STYLE_URL = 'https://tiles.openfreemap.org/styles/positron';

const MapView = ({
  children,
  mapRef,
  regionChange,
  mapStyle,
  onPress,
  onDidFinishLoadingMap,
  isAttributionsEnabled = true,
  ...props
}) => {
  const { showActionSheetWithOptions } = useActionSheet();

  const showAttributions = () => {
    showActionSheetWithOptions(
      {
        title: `MapLibre Maps SDK for ${Platform.OS.toUpperCase()}`,
        options: ['Cancel', '© OpenFreeMap contributors', '© OpenStreetMap contributors'],
        cancelButtonIndex: 0,
      },
      (buttonIndex) => {
        if (buttonIndex === 1) {
          Linking.openURL('https://openfreemap.org');
        } else if (buttonIndex === 2) {
          Linking.openURL('https://www.openstreetmap.org/copyright');
        }
      }
    );
  };

  return (
    <Fragment>
      <MapLibreGL.Map
        style={mapStyle}
        mapStyle={STYLE_URL}
        ref={mapRef}
        onRegionDidChange={regionChange}
        logo={false}
        attributionPosition={{ right: RFValue(30), bottom: RFValue(10) }}
        compass={false}
        attribution={false}
        scaleBar={false}
        logoPosition={{ bottom: 20, left: 25 }}
        touchRotate={false}
        onPress={onPress}
        onDidFinishLoadingMap={() => {
          onDidFinishLoadingMap && onDidFinishLoadingMap();
        }}
        {...props}>
        {children}
      </MapLibreGL.Map>
      {isAttributionsEnabled && (
        <View style={{ ...appMapStyle.mapButtons, width: RFValue(35) }}>
          <AttributionButton showAttribution={showAttributions} />
        </View>
      )}
    </Fragment>
  );
};

export default memo(MapView);
