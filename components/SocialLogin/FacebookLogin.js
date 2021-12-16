import React, {useState} from "react";
import {ActivityIndicator, Alert, TouchableOpacity, View} from "react-native";
import {CustomText} from "../../highordercomponents";
import FacebookIcon from "../../assets/svg/illustrations/FacebookIcon";
import * as Facebook from 'expo-facebook';
import {toastGenerator} from "../../helper/helper";
import {successAlertStyles} from "../../styles/alertStyles";
import {socialLoginStyles} from "../../styles/loginStyles";


const FacebookLogin = () => {
  const [loading, setLoading] = useState('');

  async function login() {
    try {
      await Facebook.initializeAsync({
        appId: `${process.env.FACEBOOK_APP_ID}`,
      });
      const { type, token, expirationDate, permissions, declinedPermissions } =
        await Facebook.logInWithReadPermissionsAsync({
          permissions: ['public_profile', 'email']
        });
      if (type === 'success') {
        const response = await fetch(`https://graph.facebook.com/me?fields=id,name,email&access_token=${token}`);
        toastGenerator(
          `Login Success ${(await response.json()).name}`,
          require("../../assets/images/Success.png"),
          successAlertStyles.alertContainer,
          successAlertStyles.alertTitle,
          successAlertStyles.alertImage,
          3000
        );
      }
      setLoading('');
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
      setLoading('');
    }
  }

  return (
    <View style={socialLoginStyles.facebookButton}>
      {loading === 'facebook' ?
        (
          <View>
            <ActivityIndicator size="small" color="#fff"/>
          </View>
        ) : (
          <TouchableOpacity onPress={() => {
            setLoading('facebook');
            login();
          }}
          style={{
            justifyContent:"center"
          }}
          >
            <View style={{position: "absolute", left: 10}}>
              <FacebookIcon />
            </View>
            <CustomText style={{textAlign: 'center', color: '#FFF'}}>Facebook</CustomText>
          </TouchableOpacity>
        )
      }
    </View>
  );
};

export default FacebookLogin;