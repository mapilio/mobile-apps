import React, { useEffect, useState } from "react";
import * as AppleAuthentication from "expo-apple-authentication";
import { GET_TOKEN_SUCCESS } from "../../store/actionsName";
import { useDispatch } from "react-redux";
import { getUserInformation } from "../../store/reducers/loginReducer/getUserInformation";
import Database from "../../db";
import { Routes } from "../../navigator/Routes";
import { fetchHandler } from "../../helper/helper";
import Config from "react-native-config";
import {socialLoginStyles} from "../../styles/loginStyles";

const AppleLogin = ({ navigation }) => {
  const dispatch = useDispatch();
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    AppleAuthentication.isAvailableAsync().then(status => setAvailable(status))
  }, []);

  const signInToApple = (credential, stateKey) => {
    if (credential.email) {
      fetchHandler({
        url: `${Config.SERVICE_URL}/oauth-api/callback`,
        method: "POST",
        data: {
          email: credential.email,
          name: credential.fullName.givenName + credential.fullName.familyName,
          state: stateKey,
          token: credential.user,
        },
      }).then((res) => {
        dispatch({type: GET_TOKEN_SUCCESS, payload: res});
        dispatch(getUserInformation(res));
        Database.startDB(res.id);
        navigation.navigate(Routes.tabHome);
      }).catch(({response}) => toast.show(response.data.message, {type: 'error'}));
      toast.show(`Login Success ${credential.fullName.familyName}`, {type: 'success'})
    } else {
      let params = {token: credential.user, state: stateKey};

      fetchHandler({url: `${Config.SERVICE_URL}/oauth-api/w-token`, params: params}).then((res) => {
        dispatch({type: GET_TOKEN_SUCCESS, payload: res});
        dispatch(getUserInformation(res));
        Database.startDB(res.id);
        navigation.navigate(Routes.tabHome);
      }).catch(({response}) => toast.show(response.data.message, {type: 'error'}));
    }
  };

  const loginHandler = () => {
    const options = {
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ]
    }

    AppleAuthentication.signInAsync(options).then((credential) => {
      fetchHandler({ url: `${Config.SERVICE_URL}/oauth-api/generate-state` }).then(({data}) => {
        signInToApple(credential, data.state)
      }).catch(({response}) => toast.show(`${response.data.message}`, {type: 'error'}));
    })
  }

  if (available) {
    return (
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE}
        cornerRadius={1000}
        style={socialLoginStyles.appleButton}
        onPress={loginHandler}
      />
    );
  } else {
    return null;
  }
};

export default AppleLogin;
