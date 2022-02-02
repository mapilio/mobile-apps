import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, TouchableOpacity, View } from "react-native";
import { CustomText } from "../../highordercomponents";
import GoogleIcon from "../../assets/svg/illustrations/GoogleIcon";
import * as Google from "expo-auth-session/providers/google";
import { fetchHandler, toastGenerator } from "../../helper/helper";
import { Routes } from "../../navigator/Routes";
import {
  successAlertStyles,
  warningAlertStyles,
} from "../../styles/alertStyles";
import { socialLoginStyles } from "../../styles/loginStyles";
import axios from "axios";
import { useDispatch } from "react-redux";
import { GET_TOKEN_SUCCESS } from "../../store/actionsName";
import { getUserInformation } from "../../store/reducers/loginReducer/getUserInformation";

const GoogleLogin = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [stateKey, setStateKey] = useState("");
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId:
      "563319300844-3m356468nbkj40ke4ct2offeufm1k3u4.apps.googleusercontent.com",
    androidClientId:
      "563319300844-27h266rqlr510tte0tbhfqu3c0l3cbjp.apps.googleusercontent.com",
    expoClientId:
      "563319300844-27h266rqlr510tte0tbhfqu3c0l3cbjp.apps.googleusercontent.com",
    scopes: ["profile", "email"],
    permissions: ["public_profile", "email"],
  });

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async (e) => {
      fetchHandler({ url: `${process.env.API_URL}/oauth-api/generate-state` })
        .then((response) => setStateKey(response.data.state))
        .catch((err) => console.error(err));
    });
    return () => unsubscribe();
  }, [navigation]);

  const login = async () => {
    await promptAsync();
  };

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      axios
        .get(
          "https://www.googleapis.com/oauth2/v3/userinfo?access_token=" +
            authentication.accessToken
        )
        .then((res) => {
          loginToMapilio(res.data);
        });
    }
  }, [response]);

  const loginToMapilio = (response) => {
    fetchHandler({
      url: `${process.env.API_URL}/oauth-api/callback`,
      method: "POST",
      data: {
        email: response.email,
        name: response.name,
        state: stateKey,
      },
    })
      .then((res) => {
        dispatch({ type: GET_TOKEN_SUCCESS, payload: res });
        dispatch(getUserInformation(res));
        toastGenerator(
          `Login Success ${response.name}`,
          require("../../assets/images/Success.png"),
          successAlertStyles.alertContainer,
          successAlertStyles.alertTitle,
          successAlertStyles.alertImage,
          3000
        );
        navigation.navigate(Routes.tabHome);
      })
      .catch((err) => console.error(err));
  };

  return (
    <View style={socialLoginStyles.googleButton}>
      {loading ? (
        <View>
          <ActivityIndicator size="small" color="#000" />
        </View>
      ) : (
        <TouchableOpacity
          onPress={() => {
            setLoading(true);
            login();
          }}
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View style={{ position: "absolute", left: 10 }}>
            <GoogleIcon />
          </View>
          <CustomText style={{ textAlign: "center" }}>Google</CustomText>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default GoogleLogin;
