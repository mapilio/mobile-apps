import React, { useEffect, useState } from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import GoogleLogo from "../../assets/svg/logos/GoogleLogo";
import * as Google from "expo-auth-session/providers/google";
import { fetchHandler } from "../../helper/helper";
import { socialLoginStyles } from "../../styles/loginStyles";
import { useDispatch } from "react-redux";
import {GET_TOKEN_SUCCESS, SET_CREDENTIAL} from "../../store/actionsName";
import { getUserInformation } from "../../store/reducers/loginReducer/getUserInformation";
import Config from "react-native-config";
import {api} from "../../util/helpers/api";
import { RFValue } from "react-native-responsive-fontsize";

const GoogleLogin = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [stateKey, setStateKey] = useState("");
  const [_request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: Config.GOOGLE_IOS_CLIENT_ID,
    androidClientId: Config.GOOGLE_ANDROID_CLIENT_ID,
    expoClientId: Config.GOOGLE_ANDROID_CLIENT_ID,
    scopes: ["profile", "email"],
    permissions: ["public_profile", "email"],
  });

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      api.get('/oauth-api/generate-state').then((response) => {
          setStateKey(response.data.state)
        }).catch((err) => {
          toast.show("An error occurred, try again later.", {type: 'error'})
        });
    });
    return () => unsubscribe();
  }, [navigation]);

  const handleLogin = async () => {
    setLoading(true);
    await promptAsync();
  };

  useEffect(() => {
    if (response?.type === "success") {
      const {authentication} = response;
      fetchHandler({url: Config.GOOGLE_REQUEST_URL + authentication.accessToken}).then(data => loginToMapilio(data))
    } else {
      setLoading(false);
    }
  }, [response]);

  const loginToMapilio = (user) => {
    const data = {
      email: user.email,
      name: user.name,
      state: stateKey,
      client_id: Config.AUTH_CLIENT_ID,
      client_secret: Config.AUTH_CLIENT_SECRET,
      device_type: "mobile",
      login_type: "google",
    }
    api.post('/oauth-api/callbackV2', data).then((res) => {
      dispatch({type: SET_CREDENTIAL, payload: {...response, type: 'google'}});
      dispatch({type: GET_TOKEN_SUCCESS, payload: res});
      dispatch(getUserInformation(res));
      toast.show(`Login Success ${user.name}`, {type: 'success'})
      navigation.goBack()
    }).catch(() => {
      toast.show("An error occurred, try again later.", {type: 'error'})
    }).finally(() => {
      setLoading(false)
    });
  };

  return (
    <View style={socialLoginStyles.googleButton}>
      {loading ? (
        <ActivityIndicator size="small" color="#000" />
      ) : (
        <TouchableOpacity onPress={handleLogin} style={{justifyContent: "center", alignItems: "center"}}>
          <View>
            <GoogleLogo width={RFValue(12)} height={RFValue(12)} />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default GoogleLogin;
