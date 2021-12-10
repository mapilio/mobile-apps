import React from "react";
import {View} from "react-native";
import {CustomText} from "../../highordercomponents";
import {socialLoginStyles} from "../../styles/loginStyles";
import GoogleLogin from "./GoogleLogin";
import FacebookLogin from "./FacebookLogin";


const SocialLogin = () => {

  return (
    <View style={socialLoginStyles.container}>
      <View style={socialLoginStyles.topContainer}>
        <FacebookLogin />
        <GoogleLogin />
      </View>
      <View style={socialLoginStyles.bottomContainer}>
        <View style={socialLoginStyles.line}/>
        <CustomText style={socialLoginStyles.bottomText}>or</CustomText>
        <View style={socialLoginStyles.line}/>
      </View>
    </View>
  );
};

export default SocialLogin;