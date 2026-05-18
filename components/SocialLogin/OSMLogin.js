import { View, ActivityIndicator, Modal,TouchableOpacity, Image } from "react-native";
import * as WebBrowser from "expo-web-browser";
import {
  makeRedirectUri,
  useAuthRequest,
  AccessTokenRequest,
} from "expo-auth-session";
import { useEffect, useState} from "react";
import { RFValue } from "react-native-responsive-fontsize";
import { GET_TOKEN_SUCCESS, SET_CREDENTIAL, SET_MAIL_MODAL_SHOWN } from "../../store/actionsName";
import { socialLoginStyles } from "../../styles/loginStyles";

import { useTranslation } from "react-i18next";
import pkceChallenge from 'react-native-pkce-challenge';
import { api } from "../../util/helpers/api";
import { useDispatch } from "react-redux";
import { getUserInformation } from "../../store/reducers/loginReducer/getUserInformation";
import * as Application from 'expo-application';
import {captureException} from "@sentry/react-native";


const discovery = {
  authorizationEndpoint: "https://www.openstreetmap.org/oauth2/authorize",
  tokenEndpoint: "https://www.openstreetmap.org/oauth2/token",
};
const codeChallenge = pkceChallenge();


const redirectUri = makeRedirectUri({
  scheme: Application.applicationId,
  path: "redirect",
});

WebBrowser.maybeCompleteAuthSession()
const OSMLogin = ({navigation}) => {
  const {t} = useTranslation("login")
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const checkMail = () => {
    api.post("/api/function/user_profile/profile/checkIsModalShown").then((res) => {
      if(res.status){
        toast.show(t("login_success"), { type: "success" });
        dispatch({type:SET_MAIL_MODAL_SHOWN,payload:false})
      }else{
        dispatch({type:SET_MAIL_MODAL_SHOWN,payload:true})
      }
      navigation.goBack()
    }).catch((err) => {
      captureException(err, {
        tags: {
          functionName: "checkMail",
        },
      });
      toast.show(t("error"), { type: "error" });
      navigation.goBack()
    })
  }

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_OSM_CLIENT_ID,
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
        `/oauth-api/openstreetmap/authenticate?token=${accessToken}&client_id=${process.env.EXPO_PUBLIC_AUTH_CLIENT_ID}&client_secret=${process.env.EXPO_PUBLIC_AUTH_CLIENT_SECRET}&is_mobile=true`
      )
      .then((res) => {
        dispatch({
          type: SET_CREDENTIAL,
          payload: { ...response, type: "openstreetmap" },
        });
        dispatch({ type: GET_TOKEN_SUCCESS, payload: res });
        dispatch(getUserInformation());
        setLoading(false)
        checkMail();
      })
      .catch(() => {
        setLoading(false);
        toast.show(t("error"), { type: "error" });
      });
  };

  useEffect(() => {
    if (response?.type === "success") {
      const { code } = response.params;


      const getAccessToken = new AccessTokenRequest({
        code: code,
        redirectUri: redirectUri,
        clientId: process.env.EXPO_PUBLIC_OSM_CLIENT_ID,
        clientSecret:  process.env.EXPO_PUBLIC_OSM_CLIENT_SECRET,
        scopes: ["read_prefs"],
        extraParams: {
          code_verifier: request.codeVerifier
        },
      });


      getAccessToken.performAsync(discovery).then(({accessToken}) => {
        setLoading(true);
        loginToMapilio(accessToken);
      }).catch(() => {
        toast.show(t("error"), { type: "error" });
      });
    }
    

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response, request?.codeVerifier, t]);

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
