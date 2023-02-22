import React, { useEffect, useState } from "react";
import * as AppleAuthentication from "expo-apple-authentication";
import {GET_TOKEN_SUCCESS, SET_CREDENTIAL} from "../../store/actionsName";
import { useDispatch } from "react-redux";
import { getUserInformation } from "../../store/reducers/loginReducer/getUserInformation";
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
    let params = {token: credential.user, state: stateKey};
    let url = `${Config.SERVICE_URL}/oauth-api/w-token`;

    if (credential.email) {
      url = `${Config.SERVICE_URL}/oauth-api/callback`;
      params.email = credential.email;
      params.name = credential.fullName.givenName + credential.fullName.familyName;
    }

    fetchHandler({url, method: "POST", data: params}).then((res) => {
      dispatch({type: GET_TOKEN_SUCCESS, payload: res});
      dispatch({type: SET_CREDENTIAL, payload: {...credential, type: 'apple'}});
      dispatch(getUserInformation(res));
      navigation.goBack();
    }).catch(({response}) => toast.show(response.data.message, {type: 'error'}));
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
      }).catch(({response}) => {
        toast.show(`${response.data.message || "An error occurred, try again later."}`, {type: 'error'})
      });
    })
  }

  if (available) {
    return (
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE_OUTLINE}
        cornerRadius={50}
        style={socialLoginStyles.appleButton}
        onPress={loginHandler}
      />
    );
  } else {
    return null;
  }
};

export default AppleLogin;
