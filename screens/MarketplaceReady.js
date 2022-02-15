import React from "react";
import {View, Image} from "react-native";
import {CustomText, CustomTextMedium} from "../highordercomponents";
import {marketplaceReceivedStyles} from "../styles/marketplaceStyles";
import Info from "../assets/svg/illustrations/Info";
import {Routes} from "../navigator/Routes";
import {RFValue} from "react-native-responsive-fontsize";

const MarketplaceReady = ({navigation}) => {
	return (
		<View style={marketplaceReceivedStyles.container}>
			<Image
				source={require("../assets/images/ready.png")}
				resizeMode={"contain"}
				style={marketplaceReceivedStyles.image}
			/>
			<CustomTextMedium style={marketplaceReceivedStyles.title}>Mission Ready</CustomTextMedium>
			<CustomText style={marketplaceReceivedStyles.description}>You can learn which path to follow while catching from
				the information section.</CustomText>
			<View>
				<CustomText>
					<Info width={RFValue(12)} height={RFValue(12)}/>
					{" "}
					What do you need to do?
				</CustomText>
			</View>
			<CustomText
				style={marketplaceReceivedStyles.button}
				onPress={() => navigation.navigate(Routes.camera)}
			>
				Start Capture
			</CustomText>
			<CustomText style={marketplaceReceivedStyles.or}>
				or
			</CustomText>
			<CustomText style={{marginBottom: RFValue(30)}}>
				back to the {" "}
				<CustomText style={marketplaceReceivedStyles.link} onPress={() => navigation.navigate(Routes.marketplace)}>
					Marketplace.
				</CustomText>
			</CustomText>
		</View>
	);
};

export default MarketplaceReady;
