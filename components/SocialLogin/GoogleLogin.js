import React, {useState} from "react";
import {View, TouchableOpacity, Alert, ActivityIndicator} from "react-native";
import {CustomText} from "../../highordercomponents";
import GoogleIcon from "../../assets/svg/illustrations/GoogleIcon";
import * as Google from 'expo-google-app-auth';
import {toastGenerator} from "../../helper/helper";
import {successAlertStyles, warningAlertStyles} from "../../styles/alertStyles";


const GoogleLogin = () => {

  const [loading, setLoading] = useState(false);

  const login = async () => {
    try {
      Google.logInAsync({
        iosClientId: process.env.GOOGLE_IOS_CLIENT_ID,
        androidClientId: process.env.GOOGLE_ANDROID_CLIENT_ID,
        scopes: ['profile', 'email']
      }).then((result) => {
        if (result.type === 'success') {
          toastGenerator(
            `Login Success ${result.accessToken}`,
            require("../../assets/images/Success.png"),
            successAlertStyles.alertContainer,
            successAlertStyles.alertTitle,
            successAlertStyles.alertImage,
            3000
          );
        } else {
          toastGenerator(
            `${result.type}`,
            require("../../assets/images/Warning.png"),
            warningAlertStyles.alertContainer,
            warningAlertStyles.alertTitle,
            warningAlertStyles.alertImage,
            3000
          );
        }
        setLoading(false)
      }).catch((error) => {
        Alert.alert(`Login Error: ${error}`);
        setLoading(false)
      })
    } catch ({ message }){
      alert(`Google Login Error: ${message}`);
      setLoading(false);
    }
  }

  return (
    <View style={{
      backgroundColor: '#FFF',
      flex: 1,
      padding: 10,
      borderRadius: 20,
      marginLeft: 6,
      justifyContent: "center"
    }}>

      {loading ?
        (
          <View>
            <ActivityIndicator size="small" color="#000"/>
          </View>
        ) : (
          <TouchableOpacity onPress={() => {
            setLoading(true)
            login()
          }}>
            <View style={{position: "absolute", left: 10}}>
              <GoogleIcon/>
            </View>
            <CustomText style={{textAlign: 'center'}}>Google</CustomText>
          </TouchableOpacity>
        )
      }
    </View>
  );
};

export default GoogleLogin;