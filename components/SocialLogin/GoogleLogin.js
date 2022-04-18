import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, TouchableOpacity, View } from "react-native";
import { CustomText } from "../../highordercomponents";
import GoogleIcon from "../../assets/svg/illustrations/GoogleIcon";
import * as Google from "expo-auth-session/providers/google";
import { fetchHandler, toastGenerator } from "../../helper/helper";
import { Routes } from "../../navigator/Routes";
import {
  successAlertStyles,
  warningAlertStyles,
} from "../../styles/alertStyles";
import { socialLoginStyles } from "../../styles/loginStyles";

import axios from "axios";
import { useDispatch } from "react-redux";
import { GET_TOKEN_SUCCESS } from "../../store/actionsName";
import { getUserInformation } from "../../store/reducers/loginReducer/getUserInformation";
import Database from "../../db";
import {
  GOOGLE_ANDROID_CLIENT_ID,
  GOOGLE_IOS_CLIENT_ID,
  GOOGLE_REQUEST_URL,
  SERVICE_URL,
} from "@env";
import OneSignal from "react-native-onesignal";

const GoogleLogin = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [stateKey, setStateKey] = useState("");
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: GOOGLE_IOS_CLIENT_ID,
    androidClientId: GOOGLE_ANDROID_CLIENT_ID,
    expoClientId: GOOGLE_ANDROID_CLIENT_ID,
    scopes: ["profile", "email"],
    permissions: ["public_profile", "email"],
  });

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async (e) => {
      fetchHandler({ url: `${SERVICE_URL}/oauth-api/generate-state` })
        .then((response) => setStateKey(response.data.state))
        .catch((err) => console.error(err));
    });
    return () => unsubscribe();
  }, [navigation]);

  const login = async () => {
    await promptAsync();
  };

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      axios.get(GOOGLE_REQUEST_URL + authentication.accessToken).then((res) => {
        loginToMapilio(res.data);
      });
    } else {
      setLoading(false);
    }
  }, [response]);

  const loginToMapilio = (response) => {
    fetchHandler({
      url: `${SERVICE_URL}/oauth-api/callback`,
      method: "POST",
      data: {
        email: response.email,
        name: response.name,
        state: stateKey,
      },
    })
      .then((res) => {
        if (res.id) {
          OneSignal.setExternalUserId(res.id.toLocaleString(), (results) => {});
          dispatch({ type: GET_TOKEN_SUCCESS, payload: res });
          dispatch(getUserInformation(res));
          Database.startDB(res.id);
          toastGenerator(
            `Login Success ${response.name}`,
            require("../../assets/images/Success.png"),
            successAlertStyles.alertContainer,
            successAlertStyles.alertTitle,
            successAlertStyles.alertImage,
            3000
          );
          navigation.navigate(Routes.tabHome);
        } else {
          toastGenerator(
            "There was a problem registering. Please try a different method.",
            require("../../assets/images/Warning.png"),
            warningAlertStyles.alertContainer,
            warningAlertStyles.alertTitle,
            warningAlertStyles.alertImage,
            3000
          );
          setLoading(false);
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <View style={socialLoginStyles.googleButton}>
      {loading ? (
        <View>
          <ActivityIndicator size="small" color="#000" />
        </View>
      ) : (
        <TouchableOpacity
          onPress={() => {
            setLoading(true);
            login();
          }}
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View style={{ position: "absolute", left: 10 }}>
            <GoogleIcon />
          </View>
          <CustomText style={{ textAlign: "center" }}>Google</CustomText>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default GoogleLogin;
