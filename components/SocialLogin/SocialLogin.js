import React from 'react';
import { View } from 'react-native';
import { CustomText } from '../../highordercomponents';
import { socialLoginStyles } from '../../styles/loginStyles';
import GoogleLogin from './GoogleLogin';
import FacebookLogin from './FacebookLogin';
import AppleLogin from './AppleLogin';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import OSMLogin from './OSMLogin';

const SocialLogin = ({ navigation }) => {
  const { t } = useTranslation('login');

  const {
    config: {
      socialLogin: { isFacebookEnabled, isGoogleEnabled, isAppleEnabled, isOSMEnabled },
    },
  } = useSelector((state) => state.generalReducer);

  return (
    <View style={socialLoginStyles.container}>
      <View style={socialLoginStyles.topContainer}>
        <View style={socialLoginStyles.line} />
        <CustomText style={socialLoginStyles.bottomText}>{t('or')}</CustomText>
        <View style={socialLoginStyles.line} />
      </View>

      <View style={socialLoginStyles.bottomContainer}>
        {isAppleEnabled && <AppleLogin navigation={navigation} />}
        {isFacebookEnabled && <FacebookLogin navigation={navigation} />}
        {isGoogleEnabled && <GoogleLogin navigation={navigation} />}
        {isOSMEnabled && <OSMLogin navigation={navigation} />}
      </View>
    </View>
  );
};

export default SocialLogin;
