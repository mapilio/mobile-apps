import React from "react";
import {View} from "react-native";
import {uploadRight} from "../../styles/navigatorBarStyles";
import {Upload} from "../../components/Uploads";

const UploadNavigatorRight = () => {
	return (
		<View style={uploadRight.container}>
			<Upload />
		</View>
	)
};

export default UploadNavigatorRight;
