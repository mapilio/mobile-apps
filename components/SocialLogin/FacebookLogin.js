import React, { useState } from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import FacebookLogo from "../../assets/svg/logos/FacebookLogo";
import * as Facebook from "expo-facebook";
import { fetchHandler } from "../../helper/helper";
import { socialLoginStyles } from "../../styles/loginStyles";
import { getUserInformation } from "../../store/reducers/loginReducer/getUserInformation";
import { Routes } from "../../navigator/Routes";
import { useDispatch } from "react-redux";
import { GET_TOKEN_SUCCESS } from "../../store/actionsName";
import Database from "../../db";
import Config from "react-native-config";

const FacebookLogin = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleLogin = () => {
    setLoading(true)
    fetchHandler({url: `${Config.SERVICE_URL}/oauth-api/generate-state`}).then(({data}) => {
      facebookAccess(data.state);
    }).catch((err) => console.error(err));
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
            fetchHandler({
              url: `${Config.SERVICE_URL}/oauth-api/callback`,
              method: "POST",
              data: {
                email: json.email,
                name: json.name,
                state: stateKey,
              },
            }).then((res) => {
              dispatch({type: GET_TOKEN_SUCCESS, payload: res});
              dispatch(getUserInformation(res));
              Database.startDB(res.id);
              navigation.navigate("MapTab", {screen: Routes.map});
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
