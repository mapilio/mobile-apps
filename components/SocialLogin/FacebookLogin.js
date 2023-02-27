import React, { useState } from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import FacebookLogo from "../../assets/svg/logos/FacebookLogo";
import * as Facebook from "expo-facebook";
import { socialLoginStyles } from "../../styles/loginStyles";
import { getUserInformation } from "../../store/reducers/loginReducer/getUserInformation";
import { useDispatch } from "react-redux";
import {GET_TOKEN_SUCCESS, SET_CREDENTIAL} from "../../store/actionsName";
import Config from "react-native-config";
import {api} from "../../util/helpers/api";

const FacebookLogin = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleLogin = () => {
    setLoading(true)
    api.get('/oauth-api/generate-state').then(({data}) => {
      facebookAccess(data.state);
    }).catch(() => {
      toast.show("An error occurred, try again later.", {type: 'error'})
    }).finally(() => setLoading(false))
  };

  const facebookAccess = async (stateKey) => {
    try {
      Facebook.initializeAsync({appId: Config.FACEBOOK_APP_ID}).then( async () => {
        const {type, token} = await Facebook.logInWithReadPermissionsAsync({permissions: ["public_profile", "email"]});

        if (type === "success") {
          const response = await fetch(`${Config.FACEBOOK_REQUEST_URL}${token}`);
          const json = await response.json();
          if (!json.email) {
            toast.show("You are not a member because I cannot access your e-mail address. Please give mail permission or register another way.", {type: 'error'})
          } else {
            api.post('/oauth-api/callbackV2', {
              email: json.email,
              name: json.name,
              state: stateKey,
              client_id: Config.AUTH_CLIENT_ID,
              client_secret: Config.AUTH_CLIENT_SECRET,
              device_type: "mobile"
            }).then((res) => {
              dispatch({type: SET_CREDENTIAL, payload: {...json, type: 'facebook'}});
              dispatch({type: GET_TOKEN_SUCCESS, payload: res});
              dispatch(getUserInformation(res));
              navigation.goBack();
              toast.show(`Login Success ${(json).name}`, {type: "success"})
            }).catch((err) => console.error(err));
          }
        }
        setLoading(false);
      })
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
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
          <FacebookLogo/>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default FacebookLogin;
