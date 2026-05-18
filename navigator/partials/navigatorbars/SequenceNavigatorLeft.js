import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { sequenceLeft } from '../../../styles/navigatorBarStyles';
import { ArrowLeft } from '../../../assets/svg/illustrations';
import { CustomText } from '../../../highordercomponents';
import { Routes } from '../../Routes';
import { useTranslation } from 'react-i18next';

const SequenceNavigatorLeft = (props) => {
  const { t } = useTranslation('navigation');
  const route = useRoute();
  const { userInformation } = useSelector((state) => state.getTokenReducer);
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      {...props}
      activeOpacity={0.7}
      style={sequenceLeft.container}
      onPress={() => {
        if (!route?.params?.base) {
          navigation.navigate(props.backRoute);
        } else {
          navigation.navigate(Routes.profileSequence, {
            id: route.params.points[0]?.sequence_uuid,
            user_id: userInformation.user_id,
          });
        }
      }}>
      <ArrowLeft />
      <CustomText style={sequenceLeft.backTitle}>{t('back')}</CustomText>
    </TouchableOpacity>
  );
};

export default SequenceNavigatorLeft;
