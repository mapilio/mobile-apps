import { View, ActivityIndicator, Modal,TouchableOpacity, Image,Platform } from "react-native";
import * as WebBrowser from "expo-web-browser";
import {
  makeRedirectUri,
  useAuthRequest,
  AccessTokenRequest,
} from "expo-auth-session";
import { useEffect, useState} from "react";
import { RFValue } from "react-native-responsive-fontsize";
import { GET_TOKEN_SUCCESS, SET_CREDENTIAL } from "../../store/actionsName";
import { socialLoginStyles } from "../../styles/loginStyles";
import Config from "react-native-config";
import { useTranslation } from "react-i18next";
import pkceChallenge from 'react-native-pkce-challenge';
import { api } from "../../util/helpers/api";
import { useDispatch } from "react-redux";
import { getUserInformation } from "../../store/reducers/loginReducer/getUserInformation";
import * as Application from 'expo-application';


const discovery = {
  authorizationEndpoint: "https://www.openstreetmap.org/oauth2/authorize",
  tokenEndpoint: "https://www.openstreetmap.org/oauth2/token",
};
const codeChallenge = pkceChallenge();


const redirectUri = makeRedirectUri({
  scheme: Application.applicationId,
});

WebBrowser.maybeCompleteAuthSession()
const OSMLogin = ({navigation}) => {
  const {t} = useTranslation("login")
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: Config.OSM_CLIENT_ID,
      scopes: ["read_prefs", "read_gpx"],
      redirectUri: redirectUri,
      
      codeChallengeMethod: "S256",
      usePKCE: true,
      codeChallenge: codeChallenge.codeVerifier,
    },
    discovery
  );

  const loginToMapilio = (accessToken) => {
    api
      .post(
        `/oauth-api/openstreetmap/authenticate?token=${accessToken}&client_id=${Config.AUTH_CLIENT_ID}&client_secret=${Config.AUTH_CLIENT_SECRET}&device_type=mobile&login_type=openstreetmap`
      )
      .then((res) => {
        dispatch({
          type: SET_CREDENTIAL,
          payload: { ...response, type: "openstreetmap" },
        });
        dispatch({ type: GET_TOKEN_SUCCESS, payload: res });
        dispatch(getUserInformation());
        toast.show(`Login Success`, { type: "success" });
        setLoading(false);
        navigation.goBack();
      })
      .catch(() => {
        setLoading(false);
        toast.show(t("error"), { type: "error" });
      });
  };

  useEffect(() => {
    console.log("response", response?.type);
    if (response?.type === "success") {
      const { code } = response.params;


      const getAccessToken = new AccessTokenRequest({
        code: code,
        redirectUri: redirectUri,
        clientId: Config.OSM_CLIENT_ID,
        clientSecret:  Config.OSM_CLIENT_SECRET,
        scopes: ["read_prefs"],
        extraParams: {
          code_verifier: request.codeVerifier
        },
      });

      console.log("getAccessToken", code);

      getAccessToken.performAsync(discovery).then(({accessToken}) => {
        loginToMapilio(accessToken);
      }).catch(() => {
        toast.show(t("error"), { type: "error" });
      });
    }
    

  }, [response]);

  return (
     <TouchableOpacity style={socialLoginStyles.osmButton} onPress={()=>{
      promptAsync();
     }}>
      <Modal visible={loading} transparent={true} animationType="fade" statusBarTranslucent>
        <View style={socialLoginStyles.modal}>
          <ActivityIndicator size="large" color="white" />
        </View>
      </Modal>
      <Image source={require('../../assets/images/osm.png')} style={{width:RFValue(12),height:RFValue(12)}} />
      </TouchableOpacity>
  );
};

export default OSMLogin;
