import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { CustomText, CustomTextMedium, CustomTextBold } from '../../highordercomponents';
import { marketplaceReceivedStyles } from '../../styles/marketplaceStyles';
import { Routes } from '../../navigator/Routes';
import { UPDATE_SELECTED_PROJECT } from '../../store/actionsName';
import { useDispatch } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';
import { FocusAwareStatusBar } from '../../components';
import { ReadyIcon } from '../../assets/svg/illustrations';

const MarketplaceReady = ({ navigation, route }) => {
  const { t } = useTranslation('marketplace');
  const dispatch = useDispatch();

  const goToMarketPlace = () => (
    <CustomTextBold
      style={marketplaceReceivedStyles.link}
      onPress={() => navigation.navigate(Routes.marketplace)}
    />
  );

  return (
    <View style={marketplaceReceivedStyles.container}>
      <FocusAwareStatusBar barStyle={'dark-content'} backgroundColor={'#fff'} translucent />
      <ReadyIcon />
      <CustomTextMedium style={marketplaceReceivedStyles.title}>
        {t('mission_ready')}
      </CustomTextMedium>
      <CustomText style={marketplaceReceivedStyles.description}>{t('mission_detail')}</CustomText>
      <TouchableOpacity
        style={marketplaceReceivedStyles.button}
        onPress={() => {
          dispatch({
            type: UPDATE_SELECTED_PROJECT,
            payload: {
              type: 'project',
              projectName: route.params.data.marketplace_name,
              projectKey: route.params.data.project_key,
              organizationKey: route.params.data.organization_key,
              id: route.params.data.id,
            },
          });
          navigation.navigate(Routes.cameraTab);
        }}>
        <CustomText style={marketplaceReceivedStyles.startCapture}>{t('start_capture')}</CustomText>
      </TouchableOpacity>
      <CustomTextBold style={marketplaceReceivedStyles.or}>{t('or')}</CustomTextBold>
      <CustomTextMedium style={marketplaceReceivedStyles.backToMarket}>
        <Trans t={t} i18nKey={'back_to_the'} components={[goToMarketPlace()]} />
      </CustomTextMedium>
    </View>
  );
};

export default MarketplaceReady;
