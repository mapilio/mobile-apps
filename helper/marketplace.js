import {ActionCamera, Camera, PhoneCamera} from "../assets/svg/illustrations";
import Geolocation from "react-native-geolocation-service";
import {distance, point} from "@turf/turf";

export const getEquipment = (equipment) => {
  switch (equipment) {
    case 'phone':
      return {icon: <PhoneCamera/>, name: 'Phone'}
    case 'gopro':
      return {icon: <ActionCamera/>, name: 'Action & Dash cam'}
    case 'surveyingcar':
      return {icon: <ActionCamera/>, name: 'Action & Dash cam'}
    default:
      return {icon: <Camera/>, name: 'Any Camera'}
  }
}

/**
 *
 * @param targetPoint {object} should be point of geojson
 */
export const isNear = (targetPoint) => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(({coords: {latitude, longitude}}) => {
      const currentPoint = point([latitude, longitude])
      resolve(distance(currentPoint, targetPoint, {units: "kilometers"}))
    }, (err) => reject(err))
  })
}
