import React from "react";
import { View } from "react-native";
import { CustomText } from "../../highordercomponents";
import { socialLoginStyles } from "../../styles/loginStyles";
import GoogleLogin from "./GoogleLogin";
import FacebookLogin from "./FacebookLogin";
import AppleLogin from "./AppleLogin";

const SocialLogin = ({ navigation }) => {
  return (
    <View style={socialLoginStyles.container}>
      <View style={socialLoginStyles.topContainer}>
        <View style={socialLoginStyles.line} />
        <CustomText style={socialLoginStyles.bottomText}>or</CustomText>
        <View style={socialLoginStyles.line} />
      </View>

      <View style={socialLoginStyles.bottomContainer}>
        <AppleLogin navigation={navigation} />
        <FacebookLogin navigation={navigation} />
        <GoogleLogin navigation={navigation} />
      </View>
    </View>
  );
};

export default SocialLogin;
