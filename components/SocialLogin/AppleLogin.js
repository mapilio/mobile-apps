import React, { useEffect, useState, Fragment } from "react";
import * as AppleAuthentication from "expo-apple-authentication";
import {GET_TOKEN_SUCCESS, SET_CREDENTIAL} from "../../store/actionsName";
import { useDispatch } from "react-redux";
import { getUserInformation } from "../../store/reducers/loginReducer/getUserInformation";
import {socialLoginStyles} from "../../styles/loginStyles";
import {api} from "../../util/helpers/api";
import Config from "react-native-config";
import {Modal, View, ActivityIndicator} from "react-native";
import { useTranslation } from "react-i18next";

const AppleLogin = ({ navigation }) => {
  const dispatch = useDispatch();
  const [available, setAvailable] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation("login");

  useEffect(() => {
    AppleAuthentication.isAvailableAsync().then(status => setAvailable(status))
  }, []);

  const signInToApple = (credential, stateKey) => {
    let params = {
      token: credential.user,
      state: stateKey,
      client_id: Config.AUTH_CLIENT_ID,
      client_secret: Config.AUTH_CLIENT_SECRET,
      device_type: "mobile",
      login_type: "apple",
    };
    let url = `/oauth-api/w-tokenV2`;

    if (credential.email) {
      url = `/oauth-api/callbackV2`;
      params.email = credential.email;
      params.name = credential.fullName.givenName + " " + credential.fullName.familyName;
    }

    api
      .post(url, params)
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
      .catch(({response}) => toast.show(response.data.message || t("error"), {type: 'error'}))
      .finally(() => setLoading(false));
  };

  const loginHandler = () => {
    const options = {
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ]
    }

    AppleAuthentication.signInAsync(options).then((credential) => {
      api.get('/oauth-api/generate-state').then(({data}) => {
        setLoading(true);
        signInToApple(credential, data.state)
      }).catch(({response}) => {
        setLoading(false);
        toast.show(`${response.data.message || t("error")}`, {type: 'error'})
      });
    }).catch(() => {
      setLoading(false);
    });
  }

  if (available) {
    return (
      <Fragment>
        <Modal visible={loading} transparent={true} animationType="fade">
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
