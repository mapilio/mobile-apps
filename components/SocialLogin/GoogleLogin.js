import React, { useEffect, useState } from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import GoogleLogo from "../../assets/svg/logos/GoogleLogo";
import * as Google from "expo-auth-session/providers/google";
import { fetchHandler } from "../../helper/helper";
import { socialLoginStyles } from "../../styles/loginStyles";
import { useDispatch } from "react-redux";
import { GET_TOKEN_SUCCESS } from "../../store/actionsName";
import { getUserInformation } from "../../store/reducers/loginReducer/getUserInformation";
import Config from "react-native-config";

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
      fetchHandler({ url: `${Config.SERVICE_URL}/oauth-api/generate-state` })
        .then((response) => setStateKey(response.data.state))
        .catch(() => {
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
      const { authentication } = response;
      fetchHandler({url: Config.GOOGLE_REQUEST_URL + authentication.accessToken}).then(data => {
        loginToMapilio(data);
      })
    } else {
      setLoading(false);
    }
  }, [response]);

  const loginToMapilio = (response) => {
    const data = {email: response.email, name: response.name, state: stateKey}
    fetchHandler({url: `${Config.SERVICE_URL}/oauth-api/callback`, method: "POST", data: data,}).then((res) => {
      if (res.id) {
        dispatch({type: GET_TOKEN_SUCCESS, payload: res});
        dispatch(getUserInformation(res));
        toast.show(`Login Success ${response.name}`, {type: 'success'})
        navigation.goBack()
      } else {
        toast.show(`There was a problem registering. Please try a different method.`, {type: 'warning'})
      }
    }).catch(() => {
      toast.show("An error occurred, try again later.", {type: 'error'})
    }).finally(() => {
      setLoading(false)
    });
  };

  return (
    <View style={socialLoginStyles.googleButton}>
      {loading ? (
        <View>
          <ActivityIndicator size="small" color="#000" />
        </View>
      ) : (
        <TouchableOpacity onPress={handleLogin} style={{justifyContent: "center", alignItems: "center"}}>
          <View>
            <GoogleLogo />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default GoogleLogin;
