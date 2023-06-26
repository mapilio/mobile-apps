import React, { useState } from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import FacebookLogo from "../../assets/svg/logos/FacebookLogo";
import { AccessToken, LoginManager } from "react-native-fbsdk-next";
import { socialLoginStyles } from "../../styles/loginStyles";
import { getUserInformation } from "../../store/reducers/loginReducer/getUserInformation";
import { useDispatch } from "react-redux";
import { GET_TOKEN_SUCCESS, SET_CREDENTIAL } from "../../store/actionsName";
import Config from "react-native-config";
import { api } from "../../util/helpers/api";
import { useTranslation } from "react-i18next";

const FacebookLogin = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation("login");

  const handleLogin = () => {
    setLoading(true);
    api
      .get("/oauth-api/generate-state")
      .then(({ data }) => {
        facebookAccess(data.state);
      })
      .catch(() => {
        toast.show(t("error"), { type: "error" });
      })
      .finally(() => setLoading(false));
  };

  const facebookAccess = async (stateKey) => {
    try {
      const authResult = await LoginManager.logInWithPermissions([
        "public_profile",
        "email",
      ]);

      if (authResult.isCancelled) {
        setLoading(false);
        return;
      }
      const userAccess = await AccessToken.getCurrentAccessToken();

      if (!userAccess) {
        setLoading(false);
        return;
      }

      const json = await api.get(
        `${Config.FACEBOOK_REQUEST_URL}${userAccess.accessToken}`
      );

      if (!json.email) {
        toast.show(t("mail_error"), { type: "error" });
      } else {
        await api
          .post("/oauth-api/callbackV2", {
            email: json.email,
            name: json.name,
            state: stateKey,
            client_id: Config.AUTH_CLIENT_ID,
            client_secret: Config.AUTH_CLIENT_SECRET,
            device_type: "mobile",
          })
          .then((res) => {
            dispatch({
              type: SET_CREDENTIAL,
              payload: { ...json, type: "facebook" },
            });
            dispatch({ type: GET_TOKEN_SUCCESS, payload: res });
            dispatch(getUserInformation(res));
            navigation.goBack();
            toast.show(t("login_success") + json.name, { type: "success" });
          });
      }
    } catch {
      setLoading(false);
    }
  };

  return (
    <View style={socialLoginStyles.facebookButton}>
      {loading ? (
        <View>
          <ActivityIndicator size="small" color="#000" />
        </View>
      ) : (
        <TouchableOpacity onPress={handleLogin}>
          <FacebookLogo />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default FacebookLogin;
