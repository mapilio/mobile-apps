import React from "react";
import {View} from "react-native";
import {useSelector} from "react-redux";
import {CustomText} from "../../../highordercomponents";
import {sequenceDetailTitle} from "../../../styles/navigatorBarStyles";


const SequenceDetailTitle = () => {
	const {rank} = useSelector((state) => state.uploadReducer)

	return (
		<View style={sequenceDetailTitle.container}>
			<CustomText style={sequenceDetailTitle.rank}>
				<CustomText style={sequenceDetailTitle.active}>
					{rank.active}
				</CustomText>
				/
				{rank.total}</CustomText>
		</View>
	)
};

export default SequenceDetailTitle;
