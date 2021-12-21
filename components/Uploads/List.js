import React, {useEffect} from "react";
import {View, TouchableOpacity, Alert} from "react-native";
import {userUploadStyles} from "../../styles/userUploadStyle";
import {UserFeed} from "../index";
import {Trash} from "../../assets/svg/illustrations";
import {CustomText} from "../../highordercomponents";
import {SwipeListView} from "react-native-swipe-list-view";
import database from "../../db";
import {useDispatch, useSelector} from "react-redux";
import {UPLOAD_DATA} from "../../store/actionsName";
import * as FileSystem from "expo-file-system";

const List = ({navigation}) => {

	const {uploadData} = useSelector((status) => status.uploadReducer);
	const {auth} = useSelector((status) => status.getTokenReducer);
	const db = database.getConnection();
	const dispatch = useDispatch();

	const getData = () => {
		db.transaction((txn) => {
			txn.executeSql("SELECT *, COUNT(*) as count FROM captures GROUP BY sequence_uuid",[], (_, result) => {
					dispatch({ type: UPLOAD_DATA, payload: result.rows._array });
				},
				(_, error) => {
					console.log(error)
				}
			);
		});
	}
	useEffect(() => {
		getData()
	}, []);

	const deleteRow = (rowMap, sequence_uuid) => {
		Alert.alert(
			"Are you sure?",
			"Are you sure you want to delete this project",
			[
				{
					text: "Yes",
					onPress: () => {
						db.transaction((txn) => {
							txn.executeSql(
								`DELETE FROM captures where sequence_uuid = '${sequence_uuid}'`,
								[],
								(_, result) => {
									FileSystem.deleteAsync(FileSystem.documentDirectory + `${auth.id}/${sequence_uuid}`).then(async () => {
										await FileSystem.readDirectoryAsync(FileSystem.documentDirectory + `${auth.id}`)
									});
									getData();
								},
								(_, error) => {
									console.log(error)
								}
							)
						})
					}
				},
				{
					text: "No",
				}
			]
		)
	};

  const renderItem = data => (
    <View style={userUploadStyles.listItem}>
      <UserFeed key={data.index} data={data.item} navigation={navigation} />
    </View>
  );

  const renderHiddenItem = (data, rowMap) => (
    <View style={userUploadStyles.listItem}>
      <TouchableOpacity
        style={[userUploadStyles.backRightBtn]}
        onPress={() => deleteRow(rowMap, data.item.sequence_uuid)}
      >
        <Trash />
        <CustomText style={userUploadStyles.textWhite}>Delete</CustomText>
      </TouchableOpacity>
    </View>
  );

	return (
		<SwipeListView
			data={uploadData}
			renderItem={renderItem}
			renderHiddenItem={renderHiddenItem}
			rightOpenValue={-75}
			previewRowKey={'0'}
			previewOpenValue={-40}
			previewOpenDelay={3000}
		/>
	);
};

export default List;
