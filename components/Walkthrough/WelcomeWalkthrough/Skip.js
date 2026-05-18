import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { CustomText, CustomTextLight } from '../../../highordercomponents';
import { RFValue } from 'react-native-responsive-fontsize';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { UPDATE_WELCOME_WALKTHROUGH_STATUS } from '../../../store/actionsName';
import { Routes } from '../../../navigator/Routes';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Skip = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { top } = useSafeAreaInsets();

  const { t } = useTranslation('welcome_walkthrough');

  const onPress = () => {
    dispatch({ type: UPDATE_WELCOME_WALKTHROUGH_STATUS, payload: true });
    navigation.navigate(Routes.tabNavigator, { screen: Routes.map });
  };

  return (
    <View style={{ ...styles.container, top }}>
      <TouchableOpacity onPress={onPress}>
        <CustomTextLight style={styles.text}>{t('skip')}</CustomTextLight>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '10%',
    width: '100%',
    position: 'absolute',
    zIndex: 2,
    right: RFValue(35),
  },
  text: {
    textAlign: 'right',
    fontSize: RFValue(18),
    color: '#808080',
  },
});

export default Skip;
