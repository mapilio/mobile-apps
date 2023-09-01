import { api, cdn } from "../../../util/helpers/api";
import Config from "react-native-config";
import { SET_CONFIG, SET_MAINTENANCE_MODE } from "../../../store/actionsName";
import * as Application from "expo-application";
import { Alert, Platform, Linking } from "react-native";
import { translate } from "../../../util/helpers";
import * as Network from "expo-network";

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
export const getConfig = () => {
  return (dispatch) => {
    api
      .get("/config/general?token=" + Config.APP_CONFIG_TOKEN)
      .then(({ config }) => {
        const {
          isMarketOpen,
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
          mapTokens:{
            androidToken,
            iosToken
          }
        } = config;

        const versionData = Platform.OS === "ios" ? ios : android;
        checkVersion(versionData);

        dispatch({
          type: SET_CONFIG,
          payload: {
            isMarketOpen,
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
            mapTokens:{
              androidToken,
              iosToken
            }
          },
        });
      })
      .catch(() => {
        dispatch({
          type: SET_CONFIG,
          payload: {
            isMarketOpen: false,
            isChallengeOpen: false,
          },
        });
      });
  };
};

export const checkMaintenance = () => {
  return (dispatch) => {
    Network.getNetworkStateAsync().then(({ isConnected }) => {
      if (isConnected) {
        cdn
          .get("/v1/hearbeat-check")
          .then(({ mode }) => {
            dispatch({ type: SET_MAINTENANCE_MODE, payload: mode });
          })
          .catch(() => {
            dispatch({ type: SET_MAINTENANCE_MODE, payload: true });
          });
      }
    }).catch(() => {
      dispatch({ type: SET_MAINTENANCE_MODE, payload: false });
    }) 
  }
};
