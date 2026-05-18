import { CustomText } from '../../highordercomponents';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Routes } from '../../navigator/Routes';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

const SignUpButton = () => {
  const navigation = useNavigation();
  const { t } = useTranslation('navigation');

  return (
    <TouchableOpacity onPress={() => navigation.popTo(Routes.login)}>
      <CustomText style={styles.text}>{t('sign_in')}</CustomText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  text: {
    color: '#808080',
    marginRight: RFValue(28),
    fontSize: RFValue(14.5),
    marginTop: RFValue(10),
  },
});

export default SignUpButton;
