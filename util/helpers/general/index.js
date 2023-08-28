import { store } from "../../../store/store";
import { api, cdn } from "../api";
import Config from "react-native-config";
import { SET_CONFIG, SET_MAINTENANCE_MODE } from "../../../store/actionsName";
import * as Application from "expo-application";
import { Alert, Platform, Linking } from "react-native";
import { translate } from "..";

export const checkVersion = (versionData) => {
  const platform = Platform.OS;

  const { version } = versionData;

  if (platform !== "ios" && platform !== "android") {
    console.warn(
      "Platform is not supported for version check. Expected ios or android, got " +
        platform
    );
    return;
  }

  const appVersion = parseInt(
    Application.nativeApplicationVersion.split(".").join("")
  );
  const latestVersion = parseInt(version.split(".").join(""));

  if (appVersion < latestVersion) {
    Alert.alert(
      translate("update_required_title", "alerts"),
      translate("update_required_description", "alerts"),
      [
        {
          text: translate("later", "alerts"),
          style: "cancel",
        },
        {
          text: translate("update", "alerts"),
          onPress: () => {
            if (platform === "ios") {
              Linking.openURL(
                "https://apps.apple.com/tr/app/mapilio/id1609035791"
              );
            } else {
              Linking.openURL(
                "https://play.google.com/store/apps/details?id=com.mapilio.app"
              );
            }
          },
        },
      ]
    );
  }
};
export const getConfig = async () => {
  try {
    const { config } = await api.get(
      "/config/general?token=" + Config.APP_CONFIG_TOKEN
    );

    const {
      leaderboard: {
        isChallengeOpen,
        challengeDescEN,
        challengeDescTR,
        challengeURL,
        challengeDates,
        isInfoBoxOpen,
        infoBoxDescTR,
        infoBoxDescEN,
        showWeek,
      },
      socialLogin: { isFacebookEnabled, isGoogleEnabled, isAppleEnabled },
      versions: { ios, android },
    } = config;

    store.dispatch({
      type: SET_CONFIG,
      payload: {
        isMarketOpen: false,
        challengeDates: challengeDates.split(","),
        isChallengeOpen,
        challengeDescEN,
        challengeDescTR,
        challengeURL,
        isInfoBoxOpen,
        infoBoxDescTR,
        infoBoxDescEN,
        showWeek,
        socialLogin: {
          isFacebookEnabled,
          isGoogleEnabled,
          isAppleEnabled,
        },
        versions: {
          ios: {
            version: ios.version,
            minVersion: ios.minVersion,
          },
          android: {
            version: android.version,
            minVersion: android.minVersion,
          },
        },
      },
    });

    const versionData = Platform.OS === "ios" ? ios : android;
    checkVersion(versionData);
  } catch {
    store.dispatch({
      type: SET_CONFIG,
      payload: {
        isMarketOpen: false,
        isChallengeOpen: false,
      },
    });
  }
};

export const checkMaintenance = () => {
  const {
    connection: { connectionStatus },
  } = store.getState().generalReducer;

  if (connectionStatus) {
    cdn
      .get("/v1/hearbeat-check")
      .then((res) => {
        if (res.mode) {
          store.dispatch({ type: SET_MAINTENANCE_MODE, payload: true });
        } else {
          store.dispatch({ type: SET_MAINTENANCE_MODE, payload: false });
        }
      })
      .catch(() => {
        store.dispatch({ type: SET_MAINTENANCE_MODE, payload: true });
      });
  }
};
