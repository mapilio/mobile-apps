import React from "react";
import {View} from "react-native";
import {CustomText} from "../../highordercomponents";
import {socialLoginStyles} from "../../styles/loginStyles";
import GoogleLogin from "./GoogleLogin";
import FacebookLogin from "./FacebookLogin";


const SocialLogin = () => {

  return (
    <View style={socialLoginStyles.container}>
      <View style={{flexDirection: "row", marginBottom: 20}}>
        <FacebookLogin />
        <GoogleLogin />
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