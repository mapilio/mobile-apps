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
import { SERVICE_URL, FACEBOOK_APP_ID, FACEBOOK_REQUEST_URL } from "@env";
import OneSignal from "react-native-onesignal";
import { toastMessage } from "../../helper/alerts";

const FacebookLogin = ({ navigation }) => {
  const [loading, setLoading] = useState("");
  const dispatch = useDispatch();

  const login = async () => {
    fetchHandler({ url: `${SERVICE_URL}/oauth-api/generate-state` })
      .then((response) => {
        facebookAccess(response.data.state);
      })
      .catch((err) => console.error(err));
  };

  const facebookAccess = async (stateKey) => {
    try {
      await Facebook.initializeAsync({
        appId: FACEBOOK_APP_ID,
      });
      const { type, token, expirationDate, permissions, declinedPermissions } =
        await Facebook.logInWithReadPermissionsAsync({
          permissions: ["public_profile", "email"],
        });
      if (type === "success") {
        const response = await fetch(`${FACEBOOK_REQUEST_URL}${token}`);
        const json = await response.json();
        if (!json.email) {
          toastMessage.error(
            "You are not a member because I cannot access your e-mail address. Please give mail permission or register another way."
          );
        } else {
          fetchHandler({
            url: `${SERVICE_URL}/oauth-api/callback`,
            method: "POST",
            data: {
              email: json.email,
              name: json.name,
              state: stateKey,
            },
          })
            .then((res) => {
              dispatch({ type: GET_TOKEN_SUCCESS, payload: res });
              dispatch(getUserInformation(res));
              Database.startDB(res.id);
              OneSignal.setExternalUserId(res.id.toLocaleString(), () => {});
              navigation.navigate(Routes.tabHome);
            })
            .catch((err) => console.error(err));
          toastMessage.success(`Login Success ${(await json).name}`);
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
          <ActivityIndicator size="small" color="#000" />
        </View>
      ) : (
        <TouchableOpacity
          onPress={() => {
            setLoading("facebook");
            login();
          }}
          style={{
            justifyContent: "center",
            top: -3,
          }}
        >
          <View>
            <FacebookLogo />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default FacebookLogin;

// Object {
//   "authorizationCode": "cd0800e3c074a400fbbc13297c0e7a93d.0.rrquq.HUhoIKLq2qhegiDu30XoHw",
//   "email": "5gmwfhb8hp@privaterelay.appleid.com",
//   "fullName": Object {
//     "familyName": "durak",
//     "givenName": "ozcan",
//     "middleName": null,
//     "namePrefix": null,
//     "nameSuffix": null,
//     "nickname": null,
//   },
//   "identityToken": "***REMOVED***",
//   "realUserStatus": 2,
//   "state": null,
//   "user": "001040.8b74c33410d1491d8f3b09b0ee1bff87.1441",
// }
