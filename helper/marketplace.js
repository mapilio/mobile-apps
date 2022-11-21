import {ActionCamera, Camera, PhoneCamera} from "../assets/svg/illustrations";

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
