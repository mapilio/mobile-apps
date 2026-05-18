import React from 'react';
import { View, Image } from 'react-native';
import { CustomText, CustomTextMedium } from '../../highordercomponents';
import { marketplaceReceivedStyles } from '../../styles/marketplaceStyles';
import { Routes } from '../../navigator/Routes';
import { RFValue } from 'react-native-responsive-fontsize';

const MarketplaceReceived = ({ navigation }) => {
  return (
    <View style={marketplaceReceivedStyles.container}>
      <Image
        source={require('../../assets/images/received.png')}
        resizeMode={'contain'}
        style={marketplaceReceivedStyles.image}
      />
      <CustomTextMedium style={marketplaceReceivedStyles.title}>
        We received your request
      </CustomTextMedium>
      <CustomText style={marketplaceReceivedStyles.description}>
        Subscriptions let you use the current imagery and map data in your shapes.
      </CustomText>
      <CustomText style={{ marginBottom: RFValue(30) }}>
        Go to{' '}
        <CustomText
          style={marketplaceReceivedStyles.link}
          onPress={() => navigation.navigate(Routes.marketplace)}>
          Marketplace.
        </CustomText>
      </CustomText>
      {/* <View>
        <CustomText>
          <Info width={RFValue(12)} height={RFValue(12)}/>
          {" "}
          What do you need to do?
        </CustomText>
      </View> */}
    </View>
  );
};

export default MarketplaceReceived;
