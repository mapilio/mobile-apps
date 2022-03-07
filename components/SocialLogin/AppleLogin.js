import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, TouchableOpacity, View } from "react-native";
import { AppleIcon } from "../../assets/svg/logos";
import { CustomText } from "../../highordercomponents";
import { socialLoginStyles } from "../../styles/loginStyles";
import * as AppleAuthentication from "expo-apple-authentication";
import { RFValue } from "react-native-responsive-fontsize";
import { GET_TOKEN_SUCCESS } from "../../store/actionsName";
import { useDispatch } from "react-redux";
import { getUserInformation } from "../../store/reducers/loginReducer/getUserInformation";
import Database from "../../db";
import { Routes } from "../../navigator/Routes";
import { fetchHandler, toastGenerator } from "../../helper/helper";
import { SERVICE_URL } from "@env";
import { successAlertStyles } from "../../styles/alertStyles";

const AppleLogin = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [available, setAvailable] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    let isAvailable = async () => {
      let status = AppleAuthentication.isAvailableAsync();
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
          navigation.navigate(Routes.tabHome);
        })
        .catch((err) => console.error(err));
      toastGenerator(
        `Login Success ${credential.fullName.familyName}`,
        require("../../assets/images/Success.png"),
        successAlertStyles.alertContainer,
        successAlertStyles.alertTitle,
        successAlertStyles.alertImage,
        3000
      );
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
        cornerRadius={16}
        style={{
          color: "#FFFFFF",
          flex: 1,
          padding: 10,
          borderRadius: 20,
          marginRight: 6,
          justifyContent: "center",
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
