import * as Haptics from 'expo-haptics';
import i18n from 'i18next';
import { length, lineString } from '@turf/turf';

/**
 *
 * @param {"success" | "warning" | "info" | "error" | "light" | "medium" | "heavy" | "selection" } type
 * @returns {void}
 * @description
 * Light, medium and heavy are impact feedbacks.
 * Success, warning, info and error are notification feedbacks
 * Selection is a selection feedback
 */
export const vibrate = (type) => {
  switch (type) {
    case 'success':
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      break;
    case 'warning':
    case 'info':
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      break;
    case 'error':
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      break;
    case 'light':
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      break;
    case 'medium':
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      break;
    case 'heavy':
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      break;
    case 'selection':
      Haptics.selectionAsync();
      break;
    default:
      break;
  }
};

/**
 *
 * @param {string} key key of the translation
 * @param {*} ns namespace of the translation
 * @returns {string} translated string
 */
export const translate = (key, ns) => i18n.t(key, { ns });

/**
 *
 * @description Calculate the score of the sequence based on the length of the sequence and the distance between the points
 * @param {Array} sequence Array of sequence objects with location property in JSON format
 * @returns {number} score of the sequence
 */
export const scoreCalculate = (sequence) => {
  const line = lineString(
    sequence.map(({ location }) => [JSON.parse(location).longitude, JSON.parse(location).latitude])
  );
  const meters = length(line, { units: 'kilometers' });

  return parseFloat((meters + sequence.length / 100).toFixed(2));
};
