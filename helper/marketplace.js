import { getCurrentPositionAsync } from 'expo-location';
import { Platform } from 'react-native';
import { ActionCamera, Camera, PhoneCamera } from '../assets/svg/illustrations';
import { distance, point } from '@turf/turf';

export const getEquipment = (equipment) => {
  switch (equipment) {
    case 'phone':
      return { icon: <PhoneCamera />, name: 'Phone' };
    case 'gopro':
      return { icon: <ActionCamera />, name: 'Action & Dash cam' };
    case 'surveyingcar':
      return { icon: <ActionCamera />, name: 'Action & Dash cam' };
    default:
      return { icon: <Camera />, name: 'Any Camera' };
  }
};

/**
 *
 * @param targetPoint {object} should be point of geojson
 */
export const isNear = (targetPoint) => {
  return new Promise((resolve) => {
    getCurrentPositionAsync({
      accuracy: Platform.OS === 'ios' ? 3 : 6,
    }).then(({ coords: { latitude, longitude } }) => {
      const currentPoint = point([latitude, longitude]);
      resolve(distance(currentPoint, targetPoint, { units: 'kilometers' }));
    });
  });
};
