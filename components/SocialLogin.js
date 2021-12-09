import React from "react";
import {View} from "react-native";
import {CustomText} from "../highordercomponents";
import {socialLoginStyles} from "../styles/loginStyles";
import Facebook from "../assets/svg/illustrations/Facebook";
import Google from "../assets/svg/illustrations/Google";

const SocialLogin = () => {
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
          <View style={{position:"absolute", left: 20}}>
            <Google />
          </View>
          <CustomText style={{textAlign: 'center'}}>Google</CustomText>
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