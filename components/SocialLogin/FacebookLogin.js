import React, { useEffect, useState } from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import { CustomText } from "../../highordercomponents";
import FacebookIcon from "../../assets/svg/illustrations/FacebookIcon";
import * as Facebook from "expo-facebook";
import { fetchHandler, toastGenerator } from "../../helper/helper";
import { errorAlertStyles, successAlertStyles } from "../../styles/alertStyles";
import { socialLoginStyles } from "../../styles/loginStyles";
import { getUserInformation } from "../../store/reducers/loginReducer/getUserInformation";
import { Routes } from "../../navigator/Routes";
import { useDispatch } from "react-redux";
import { GET_TOKEN_SUCCESS } from "../../store/actionsName";

const FacebookLogin = ({ navigation }) => {
  const [loading, setLoading] = useState("");
  const [stateKey, setStateKey] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async (e) => {
      fetchHandler({ url: `${process.env.SERVICE_URL}/oauth-api/generate-state` })
        .then((response) => setStateKey(response.data.state))
        .catch((err) => console.error(err));
    });
    return () => unsubscribe();
  }, [navigation]);

  const login = async () => {
    try {
      await Facebook.initializeAsync({
        appId: `254795350007625`,
      });
      const { type, token, expirationDate, permissions, declinedPermissions } =
        await Facebook.logInWithReadPermissionsAsync({
          permissions: ["public_profile", "email"],
        });
      if (type === "success") {
        const response = await fetch(
          `https://graph.facebook.com/me?fields=id,name,email&access_token=${token}`
        );
        const json = await response.json();
        if (!json.email) {
          toastGenerator(
            "You are not a member because I cannot access your e-mail address. Please give mail permission or register another way.",
            require("../../assets/images/Info.png"),
            errorAlertStyles.alertContainer,
            errorAlertStyles.alertTitle,
            errorAlertStyles.alertImage
          );
        } else {
          fetchHandler({
            url: `${process.env.SERVICE_URL}/oauth-api/callback`,
            method: "POST",
            data: {
              email: json.email,
              name: json.name,
              state: stateKey,
            },
          })
            .then((res) => {
              console.log(res)
              dispatch({ type: GET_TOKEN_SUCCESS, payload: res });
              dispatch(getUserInformation(res));
              navigation.navigate(Routes.tabHome);
            })
            .catch((err) => console.error(err));
          toastGenerator(
            `Login Success ${(await json).name}`,
            require("../../assets/images/Success.png"),
            successAlertStyles.alertContainer,
            successAlertStyles.alertTitle,
            successAlertStyles.alertImage,
            3000
          );
        }
      }
      setLoading("");
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
      setLoading("");
    }
  };

  return (
    <View style={socialLoginStyles.facebookButton}>
      {loading === "facebook" ? (
        <View>
          <ActivityIndicator size="small" color="#fff" />
        </View>
      ) : (
        <TouchableOpacity
          onPress={() => {
            setLoading("facebook");
            login();
          }}
          style={{
            justifyContent: "center",
          }}
        >
          <View style={{ position: "absolute", left: 10 }}>
            <FacebookIcon />
          </View>
          <CustomText style={{ textAlign: "center", color: "#FFF" }}>
            Facebook
          </CustomText>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default FacebookLogin;
