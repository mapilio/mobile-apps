import React, { useEffect, useState } from "react";
import * as AppleAuthentication from "expo-apple-authentication";
import { GET_TOKEN_SUCCESS } from "../../store/actionsName";
import { useDispatch } from "react-redux";
import { getUserInformation } from "../../store/reducers/loginReducer/getUserInformation";
import Database from "../../db";
import { Routes } from "../../navigator/Routes";
import { fetchHandler } from "../../helper/helper";
import { SERVICE_URL } from "@env";
import OneSignal from "react-native-onesignal";
import { toastMessage } from "../../helper/alerts";

const AppleLogin = ({ navigation }) => {
  const [available, setAvailable] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const isAvailable = async () => {
      const status = await AppleAuthentication.isAvailableAsync();
      setAvailable(status);
    };
    isAvailable();
  }, []);

  const signInToApple = async (credential, stateKey) => {
    if (credential.email) {
      fetchHandler({
        url: `${SERVICE_URL}/oauth-api/callback`,
        method: "POST",
        data: {
          email: credential.email,
          name: credential.fullName.givenName + credential.fullName.familyName,
          state: stateKey,
          token: credential.user,
        },
      })
        .then((res) => {
          dispatch({ type: GET_TOKEN_SUCCESS, payload: res });
          dispatch(getUserInformation(res));
          Database.startDB(res.id);
          OneSignal.setExternalUserId(res.id.toLocaleString(), () => {});
          navigation.navigate(Routes.tabHome);
        })
        .catch((err) => console.error(err));
      toastMessage.success(`Login Success ${credential.fullName.familyName}`);
    } else {
      let params = {
        token: credential.user,
        state: stateKey,
      };
      fetchHandler({
        url: `${SERVICE_URL}/oauth-api/w-token`,
        params: params,
      })
        .then((res) => {
          dispatch({ type: GET_TOKEN_SUCCESS, payload: res });
          dispatch(getUserInformation(res));
          Database.startDB(res.id);
          OneSignal.setExternalUserId(res.id, () => {});
          navigation.navigate(Routes.tabHome);
        })
        .catch((err) => console.error(err));
    }
  };

  if (available) {
    return (
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE}
        cornerRadius={1000}
        style={{
          color: "#657488",
          padding: 10,
          borderRadius: 20,
          marginRight: 6,
          justifyContent: "center",
          width: 50,
          height: 50,
        }}
        onPress={async () => {
          const credential = await AppleAuthentication.signInAsync({
            requestedScopes: [
              AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
              AppleAuthentication.AppleAuthenticationScope.EMAIL,
            ],
          });
          fetchHandler({ url: `${SERVICE_URL}/oauth-api/generate-state` })
            .then((response) => {
              signInToApple(credential, response.data.state);
            })
            .catch((err) => console.error(err));
        }}
      />
    );
  } else {
    return null;
  }
};

export default AppleLogin;
