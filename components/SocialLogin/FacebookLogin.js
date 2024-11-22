import React, { useState } from "react";
import { ActivityIndicator, Modal, TouchableOpacity, View } from "react-native";
import FacebookLogo from "../../assets/svg/logos/FacebookLogo";
// import { AccessToken, LoginManager } from "react-native-fbsdk-next";
import { socialLoginStyles } from "../../styles/loginStyles";
import { getUserInformation } from "../../store/reducers/loginReducer/getUserInformation";
import { useDispatch } from "react-redux";
import { GET_TOKEN_SUCCESS, SET_CREDENTIAL } from "../../store/actionsName";

import { api } from "../../util/helpers/api";
import { useTranslation } from "react-i18next";
import { RFValue } from "react-native-responsive-fontsize";
import {captureException} from "@sentry/react-native";

const FacebookLogin = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation("login");

  const facebookAccess = async () => {
    try {
      const authResult = await LoginManager.logInWithPermissions([
        "public_profile",
        "email",
      ]);

      if (authResult.isCancelled) {
        setLoading(false);
        return;
      }
      setLoading(true);

      const { accessToken } = await AccessToken.getCurrentAccessToken();

      if (!accessToken) {
        setLoading(false);
        return;
      }

      const json = await api.get(
        `${process.env.EXPO_PUBLIC_FACEBOOK_REQUEST_URL}${accessToken}`
      );

      if (!json.email) {
        toast.show(t("mail_error"), { type: "error" });
      } else {
        api
          .post(
            `/oauth-api/facebook/authenticate?token=${accessToken}&client_id=${process.env.EXPO_PUBLIC_AUTH_CLIENT_ID}&client_secret=${process.env.EXPO_PUBLIC_AUTH_CLIENT_SECRET}&is_mobile=true`
          )
          .then((res) => {
            dispatch({
              type: SET_CREDENTIAL,
              payload: { ...json, type: "facebook" },
            });
            dispatch({ type: GET_TOKEN_SUCCESS, payload: res });
            dispatch(getUserInformation());
            setLoading(false);
            navigation.goBack();
            toast.show(t("login_success") + json.name, { type: "success" });
          })
          .catch((err) => {
            captureException(err, {
              tags:{
                functionName: "facebookAccess"
              }
            });
            setLoading(false);
            toast.show(t("error"), { type: "error" })
          })
      }
    } catch {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={socialLoginStyles.facebookButton}
      onPress={facebookAccess}
    >
      <Modal visible={loading} transparent={true} animationType="fade" statusBarTranslucent>
        <View style={socialLoginStyles.modal}>
          <ActivityIndicator size="large" color="white" />
        </View>
      </Modal>

      <FacebookLogo width={RFValue(12)} height={RFValue(12)} />
    </TouchableOpacity>
  );
};

export default FacebookLogin;
