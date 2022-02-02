import React from "react";
import {View} from "react-native";
import {uploadRight} from "../../styles/navigatorBarStyles";
import {Upload} from "../../components/Uploads";

const UploadNavigatorRight = ({navigation}) => {
	return (
		<View style={uploadRight.container}>
			<Upload navigation={navigation} />
		</View>
	)
};

export default UploadNavigatorRight;
