import React, {useState} from "react";
import {View, TouchableOpacity, Alert, ActivityIndicator} from "react-native";
import {CustomText} from "../highordercomponents";
import {socialLoginStyles} from "../styles/loginStyles";
import Facebook from "../assets/svg/illustrations/Facebook";
import GoogleIcon from "../assets/svg/illustrations/GoogleIcon";
import * as Google from 'expo-google-app-auth';
import {toastGenerator} from "../helper/helper";
import {successAlertStyles} from "../styles/alertStyles";

const signInWithGoogleAsync = async () => {
  Google.logInAsync({
    iosClientId: process.env.GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.GOOGLE_ANDROID_CLIENT_ID,
    scopes: ['profile', 'email']
  }).then((result) => {
    toastGenerator(
      `Login Success ${result.accessToken}`,
      require("../assets/images/Success.png"),
      successAlertStyles.alertContainer,
      successAlertStyles.alertTitle,
      successAlertStyles.alertImage,
      3000
    );
  }).catch((error) => {
    Alert.alert(`Login Error: ${error}`);
  })

}


const SocialLogin = () => {
  const [clickedButton, setClickedButton] = useState('');

  return (
    <View style={socialLoginStyles.container}>
      <View style={{flexDirection: "row", marginBottom: 20}}>
        <View style={{backgroundColor: '#3B5998', flex: 1, padding: 10, borderRadius: 20, marginRight: 6, justifyContent: "center"}}>
          <View style={{position:"absolute", left: 20}}>
            <Facebook />
          </View>
          <CustomText style={{textAlign: 'center', color: '#FFF'}}>Facebook</CustomText>
        </View>
        <View style={{backgroundColor: '#FFF', flex: 1, padding: 10, borderRadius: 20, marginLeft: 6, justifyContent: "center"}}>

          {clickedButton === 'google' ?
            (
              <View>
                <ActivityIndicator size="small" color="#000"  />
              </View>
            ) : (
              <TouchableOpacity onPress={() => {
                setClickedButton('google')
                signInWithGoogleAsync()
              }}>
                <View style={{position: "absolute", left: 10}}>
                  <GoogleIcon/>
                </View>
                <CustomText style={{textAlign: 'center'}}>Google</CustomText>
              </TouchableOpacity>
            )
          }
        </View>
      </View>
      <View style={{flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
        <View style={{backgroundColor: '#CBD1D9', height: 1, flex: 1}}/>
        <CustomText style={{paddingHorizontal: 15, color: '#B9C0CF'}}>or</CustomText>
        <View style={{backgroundColor: '#CBD1D9', height: 1, flex: 1}}/>
      </View>
    </View>
  );
};

export default SocialLogin;