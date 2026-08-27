import React from 'react';
import { View, Image, ScrollView } from 'react-native';
import { CustomText, CustomTextBold, CustomTextMedium } from '../../highordercomponents';
import { RFValue } from 'react-native-responsive-fontsize';
import { globalStyles } from '../../styles/globalStyles';
import { marketplaceDetailStyles } from '../../styles/marketplaceStyles';
import { Routes } from '../../navigator/Routes';
import Moment from 'moment';
import { api } from '../../util/helpers/api';
import { ActionCamera } from '../../assets/svg/illustrations';

const MarketplaceDetail = ({ navigation, route }) => {
  const applyProject = () => {
    api
      .post('/api/function/projects/job/createJob', {
        options: {
          parameters: {
            id: route.params.data.id,
          },
        },
      })
      .then(() => {
        navigation.navigate(Routes.marketplaceReady, {
          data: route.params.data,
        });
      })
      .catch((err) => {
        toast.show(`${err.response.data.message}`, { type: 'error' });
      });
  };

  return (
    <View style={marketplaceDetailStyles.container}>
      <ScrollView>
        <View style={globalStyles.container}>
          <View style={{ flexDirection: 'row' }}>
            <CustomText style={marketplaceDetailStyles.secondaryTextColor}>Employer </CustomText>
            <CustomText style={marketplaceDetailStyles.blueTextColor}>
              {route.params.data.owner}
            </CustomText>
          </View>
          <CustomTextBold style={marketplaceDetailStyles.title}>
            {route.params.data.marketplace_name}
          </CustomTextBold>
          <CustomText
            style={{
              ...marketplaceDetailStyles.secondaryTextColor,
              ...marketplaceDetailStyles.smallText,
            }}>
            {Moment(route.params.data.created_at).format('d MMM. H:M')}
          </CustomText>
          <View style={marketplaceDetailStyles.imageArea}>
            <Image
              source={require('../../assets/images/capture_zone.png')}
              resizeMode={'contain'}
              style={marketplaceDetailStyles.image}
            />
            <ActionCamera width={RFValue(120)} height={RFValue(87)} />
          </View>
          <CustomTextMedium
            style={{
              ...marketplaceDetailStyles.primaryText,
              ...marketplaceDetailStyles.captureZoneText,
            }}>
            This is the capture zone. You need to hit the road with{' '}
            {route.params.data.project_camera_type}
          </CustomTextMedium>
          <CustomText
            style={{
              ...marketplaceDetailStyles.primaryText,
              fontSize: RFValue(14),
            }}>
            {route.params.data.marketplace_description}
          </CustomText>
        </View>
      </ScrollView>
      <View style={marketplaceDetailStyles.bottomSection}>
        <CustomText style={marketplaceDetailStyles.button} onPress={applyProject}>
          Apply to this project
        </CustomText>
      </View>
    </View>
  );
};

export default MarketplaceDetail;
