import React from "react";
import { View } from "react-native";
import { CustomText } from "../../highordercomponents";
import { socialLoginStyles } from "../../styles/loginStyles";
import GoogleLogin from "./GoogleLogin";
import FacebookLogin from "./FacebookLogin";
import AppleLogin from "./AppleLogin";
import { useTranslation } from "react-i18next";

const SocialLogin = ({ navigation }) => {
  const {t} = useTranslation("login");
  return (
    <View style={socialLoginStyles.container}>
      <View style={socialLoginStyles.topContainer}>
        <View style={socialLoginStyles.line} />
        <CustomText style={socialLoginStyles.bottomText}>{t("or")}</CustomText>
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
