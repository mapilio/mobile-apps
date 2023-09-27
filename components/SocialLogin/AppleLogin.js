import React, { useEffect, useState, Fragment } from "react";
import * as AppleAuthentication from "expo-apple-authentication";
import { GET_TOKEN_SUCCESS, SET_CREDENTIAL } from "../../store/actionsName";
import { useDispatch } from "react-redux";
import { getUserInformation } from "../../store/reducers/loginReducer/getUserInformation";
import { socialLoginStyles } from "../../styles/loginStyles";
import { api } from "../../util/helpers/api";
import Config from "react-native-config";
import { Modal, View, ActivityIndicator } from "react-native";
import { useTranslation } from "react-i18next";
import {captureException} from "@sentry/react-native";

const AppleLogin = ({ navigation }) => {
  const dispatch = useDispatch();
  const [available, setAvailable] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation("login");

  useEffect(() => {
    AppleAuthentication.isAvailableAsync().then((status) =>
      setAvailable(status)
    );
  }, []);

  const signInToApple = (credential) => {
    api
      .post(
        `/oauth-api/apple/authenticate?token=${credential.identityToken}&client_id=${Config.AUTH_CLIENT_ID}&client_secret=${Config.AUTH_CLIENT_SECRET}&device_type=mobile&login_type=google`
      )
      .then((res) => {
        dispatch({ type: GET_TOKEN_SUCCESS, payload: res });
        dispatch({
          type: SET_CREDENTIAL,
          payload: { ...credential, type: "apple" },
        });
        dispatch(getUserInformation(res));
        setLoading(false);
        navigation.goBack();
      })
      .catch((err) => {
        captureException(err, {
          tags: {
            functionName: "signInToApple",
          },
        });
        setLoading(false);
        toast.show(t("error"), { type: "error" });
      });
  };

  const loginHandler = () => {
    const options = {
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    };

    AppleAuthentication.signInAsync(options)
      .then((credential) => {
        signInToApple(credential);
      })
      .catch(() => {
        toast.show(t("error"), { type: "error" });
        setLoading(false);
      });
  };

  if (available) {
    return (
      <Fragment>
        <Modal
          visible={loading}
          transparent={true}
          animationType="fade"
          statusBarTranslucent
        >
          <View style={socialLoginStyles.modal}>
            <ActivityIndicator size="large" color="white" />
          </View>
        </Modal>
        <AppleAuthentication.AppleAuthenticationButton
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
          buttonStyle={
            AppleAuthentication.AppleAuthenticationButtonStyle.WHITE_OUTLINE
          }
          cornerRadius={50}
          style={socialLoginStyles.appleButton}
          onPress={loginHandler}
        />
      </Fragment>
    );
  } else {
    return null;
  }
};

export default AppleLogin;
