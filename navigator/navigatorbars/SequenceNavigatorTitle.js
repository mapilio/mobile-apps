import React, {useEffect, useState} from "react";
import {View} from "react-native";
import {CustomTextMedium} from "../../highordercomponents";
import {sequenceTitle} from "../../styles/navigatorBarStyles";
import {useSelector} from "react-redux";
import db from "../../db";
import {dateConvert} from "../../helper/helper";

const SequenceNavigatorTitle = () => {
	const {activeSequence} = useSelector((state) => state.uploadReducer)
	const [date, setDate] = useState();


	useEffect(() => {
		db.query(`SELECT * FROM captures WHERE sequence_uuid='${activeSequence}' ORDER BY id DESC LIMIT 1`, (_, result) => {
			const exif = JSON.parse(result.rows._array[0].exif)
			setDate(dateConvert(exif.DateTime || exif.DateTimeOriginal))
		})
	}, [activeSequence]);

	return (
		<View>
			<CustomTextMedium style={sequenceTitle.title}>
				{date}
			</CustomTextMedium>
		</View>
	);
};

export default SequenceNavigatorTitle;