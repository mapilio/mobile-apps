import React from 'react';
import { StyleSheet, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import BatteryLevel from './BatteryLevel';
import GPSLevel from './GPSLevel';
import PhotoAmounts from './PhotoAmounts';
import RecordStatus from './RecordStatus';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CameraFrame = () => {
  const { left } = useSafeAreaInsets();
  return (
    <View style={{ ...styles.wrapper, marginLeft: left }}>
      <View style={styles.batteryGps}>
        <BatteryLevel />
        <GPSLevel />
      </View>
      <View style={styles.record}>
        <RecordStatus />
      </View>
      <View style={styles.amount}>
        <PhotoAmounts />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  record: {
    position: 'absolute',
    bottom: RFValue(2),
    right: '45%',
  },
  amount: {
    position: 'absolute',
    bottom: RFValue(2),
    left: 0,
  },
  batteryGps: {
    flexDirection: 'row',
    position: 'absolute',
    left: 0,
    top: 0,
    alignItems: 'center',
  },
});

export default CameraFrame;
