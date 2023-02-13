import * as Haptics from "expo-haptics";

/**
 *
 * @param {"success" | "warning" | "info" | "error" | "light" | "medium" | "heavy"} type
 * @returns {void}
 * @description
 * Light, medium and heavy are impact feedbacks.
 * Success, warning, info and error are notification feedbacks
 */
export const vibrate = (type) => {
  switch (type) {
    case "success":
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      break;
    case "warning":
    case "info":
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      break;
    case "error":
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      break;
    case "light":
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      break;
    case "medium":
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      break;
    case "heavy":
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    default:
      break;
  }
};
