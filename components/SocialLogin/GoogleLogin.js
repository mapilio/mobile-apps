import React, { useEffect, useState } from "react";
import { ActivityIndicator, Modal, TouchableOpacity, View } from "react-native";
import GoogleLogo from "../../assets/svg/logos/GoogleLogo";
import * as Google from "expo-auth-session/providers/google";
import { socialLoginStyles } from "../../styles/loginStyles";
import { useDispatch } from "react-redux";
import { GET_TOKEN_SUCCESS, SET_CREDENTIAL } from "../../store/actionsName";
import { getUserInformation } from "../../store/reducers/loginReducer/getUserInformation";

import { api } from "../../util/helpers/api";
import { RFValue } from "react-native-responsive-fontsize";
import { useTranslation } from "react-i18next";
import {captureException} from "@sentry/react-native";


const GoogleLogin = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const {t} = useTranslation("login");
  const dispatch = useDispatch();
  const [_request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    expoClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    scopes: ["profile", "email"],
    permissions: ["public_profile", "email"],
  });

  const handleLogin = async () => {
    await promptAsync();
  };

  useEffect(() => {
    if (response?.type === "success") {
      const {
        authentication: { accessToken },
      } = response;
      api.get(process.env.EXPO_PUBLIC_GOOGLE_REQUEST_URL + accessToken).then((user) => {
        setLoading(true);
        loginToMapilio(user, accessToken);
      });
    } else {
      setLoading(false);
    }
  }, [response]);

  const loginToMapilio = (user, accessToken) => {
    api
      .post(
        `/oauth-api/google/authenticate?token=${accessToken}&client_id=${process.env.EXPO_PUBLIC_AUTH_CLIENT_ID}&client_secret=${process.env.EXPO_PUBLIC_AUTH_CLIENT_SECRET}&is_mobile=true`
      )
      .then((res) => {
        dispatch({
          type: SET_CREDENTIAL,
          payload: { ...response, type: "google" },
        });
        dispatch({ type: GET_TOKEN_SUCCESS, payload: res });
        dispatch(getUserInformation());
        toast.show(`Login Success ${user.name}`, { type: "success" });
        setLoading(false);
        navigation.goBack();
      })
      .catch((err) => {
        captureException(err, {
          tags: {
            functionName: "loginToMapilioGoogle",
          },
        });
        setLoading(false);
        toast.show(t("error"), { type: "error" });
      })
  };

  return (
    <TouchableOpacity
      style={socialLoginStyles.googleButton}
      onPress={handleLogin}
    >
      <Modal visible={loading} transparent={true} animationType="fade" statusBarTranslucent>
        <View style={socialLoginStyles.modal}>
          <ActivityIndicator size="large" color="white" />
        </View>
      </Modal>
      <GoogleLogo width={RFValue(12)} height={RFValue(12)} />
    </TouchableOpacity>
  );
};

export default GoogleLogin;
