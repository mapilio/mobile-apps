import React, { useEffect } from "react";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import TabNavigator from "./TabNavigator";
import NetInfo from "@react-native-community/netinfo";
import { UPDATE_CONNECTION_STATUS } from "../store/actionsName";
import { useDispatch, useSelector } from "react-redux";
import { Routes } from "./Routes";
import StackNavigator from "./StackNavigator";
import { SET_CONFIG, SET_MAINTENANCE_MODE } from "../store/actionsName";
import { api, cdn } from "../util/helpers/api";
import Config from "react-native-config";

const Stack = createStackNavigator();

const MainNavigator = () => {
  const dispatch = useDispatch();
  const { connection } = useSelector((state) => state.generalReducer);

  useEffect(() => {
    const removeListener = NetInfo.addEventListener((state) => {
      dispatch({
        type: UPDATE_CONNECTION_STATUS,
        payload: {
          connectionStatus: state.isConnected,
          connectionType: state.type,
        },
      });
    });

    return () => removeListener();
  }, []);

  useEffect(() => {
    getConfig();
    checkMaintenance();
  }, []);

  const checkMaintenance = async () => {
    if (connection.connectionStatus) {
      cdn
        .get("/v1/hearbeat-check")
        .then((res) => {
          if (res.mode) {
            dispatch({ type: SET_MAINTENANCE_MODE, payload: true });
          } else {
            dispatch({ type: SET_MAINTENANCE_MODE, payload: false });
          }
        })
        .catch(() => {
          dispatch({ type: SET_MAINTENANCE_MODE, payload: true });
        });
    }
  };

  const getConfig = () => {
    api
      .get("/config/general?token=" + Config.APP_CONFIG_TOKEN)
      .then((res) => {
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
        } = res.config;
        dispatch({
          type: SET_CONFIG,
          payload: {
            isMarketOpen: res.config.isMarketOpen,
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

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        ...TransitionPresets.SlideFromRightIOS,
      }}
    >
      <Stack.Screen name={Routes.tabNavigator} component={TabNavigator} />
      <Stack.Screen name={Routes.stackNavigator} component={StackNavigator} />
    </Stack.Navigator>
  );
};

export default MainNavigator;
