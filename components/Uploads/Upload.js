import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import * as FileSystem from "expo-file-system";
import {zip} from "react-native-zip-archive";
import RNFetchBlob from "rn-fetch-blob";
import axios from "axios";
import {Modal, TouchableOpacity, View} from "react-native";
import database from "../../db";
import {store} from "../../store/store";
import {PROGRESS, UPLOAD_DATA} from "../../store/actionsName";
import {UploadIcon} from "../../assets/svg/illustrations";
import {CustomText} from "../../highordercomponents";
import {Colors, ProgressBar} from "react-native-paper";
import {Routes} from "../../navigator/Routes";
import {userUploadModalStyles} from "../../styles/userUploadStyle";

const Upload = ({sequence_uuid, navigation}) => {
	const dispatch = useDispatch();
	const {progress} = useSelector((status) => status.uploadReducer);
	const {auth} = useSelector((status) => status.getTokenReducer);
	const [mbytes, setMbytes] = useState(0);
	const [mbps, setMbps] = useState(0);
	const [status, setStatus] = useState('');
	const [modalVisible, setModalVisible] = useState(false);
	const db = database.getConnection();
	let percent = 0;

	const getUploadData = () => {
		db.transaction((txn) => {
			txn.executeSql("SELECT *, COUNT(*) as count FROM captures GROUP BY sequence_uuid", [], (_, result) => {
				dispatch({type: UPLOAD_DATA, payload: result.rows._array});
			}, (_, error) => {
				console.log(error)
			});
		});
	}
	const deleteUpload = (auth, sequence_uuid) => {
		db.transaction((txn) => {
			txn.executeSql(`DELETE
                      FROM captures
                      where sequence_uuid = '${sequence_uuid}'`, [], (_, result) => {
				FileSystem.deleteAsync(FileSystem.documentDirectory + `${auth.id}/${sequence_uuid}`).then(async () => {
					await FileSystem.readDirectoryAsync(FileSystem.documentDirectory + `${auth.id}`)
				});
				getUploadData();
			}, (_, error) => {
				console.log(error)
			})
		})
	}

	const sendFile = async () => {
		setModalVisible(true)
		setStatus('Files Are Checked...')
		const files = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory + `${auth.id}`);
		const filteredFiles = sequence_uuid ? files.filter(el => el === String(sequence_uuid)) : files;

		filteredFiles.map(async (value, index) => {

			setStatus('Compressing Files...')
			const path = await zip(FileSystem.documentDirectory + `${auth.id}/${value}`, FileSystem.documentDirectory + `${value}.zip`)
			const file = await RNFetchBlob.fs.stat(`file://${path}`);
			const data = new FormData();
			await data.append('chunk', {
				uri: `file://${path}`, type: 'application/zip', name: file.filename
			}, `${file.filename}`)

			const getInfo = await axios.get(`https://image.mapilio.com/upload?fileName=${file.filename}`)

			const totalChunk = (await getInfo).data.totalChunkUploaded;

			let lastNow = new Date().getTime();
			let lastKBytes = 0;

			setStatus('Uploading...')
			await axios.post('https://image.mapilio.com/upload', data, {
				headers: {
					'Authorization': `Bearer ${store.getState().getTokenReducer.auth.token}`,
					'Content-Range': `bytes=${totalChunk}-${file.size}/${file.size}`,
					'Connection': `keep-alive`,
					'X-File-Id': `${file.filename}`,
					'Content-Length': String(file.size - totalChunk),
				}, onUploadProgress: progressEvent => {
					let now = new Date().getTime();
					let bytes = progressEvent.loaded;
					let total = progressEvent.total;
					let completed = (bytes / total);
					percent = completed * 100;
					let kbytes = bytes / 1024;
					setMbytes(kbytes / 1024)
					let uploadedkBytes = kbytes - lastKBytes;
					let elapsed = (now - lastNow) / 1000;
					setMbps(elapsed ? (uploadedkBytes / elapsed) / 1000 : 0);
					dispatch({type: PROGRESS, payload: completed});
				}
			}).then(async () => {
				setStatus('Cleaning Up Files...')
				if (index >= filteredFiles.length - 1) {
					setModalVisible(false)
					deleteUpload(auth, value)
					dispatch({type: PROGRESS, payload: 0});
					await navigation.navigate(Routes.upload)
				}
			});
		})

	}

	return (
		<View>
			<TouchableOpacity onPress={async () => {
				sendFile();
			}}>
				<UploadIcon/>
			</TouchableOpacity>

			<Modal
				animationType="slide"
				transparent={false}
				visible={modalVisible}
			>
				<View style={userUploadModalStyles.container}>
					<View style={{alignItems: 'center'}}>
						<CustomText style={userUploadModalStyles.text}>{status}</CustomText>
						<CustomText style={userUploadModalStyles.text}>
							{mbytes.toFixed(2) + "MB (" + (progress * 100).toFixed(2) + "%) " + mbps.toFixed(2) + " Mbps"}
						</CustomText>
						<ProgressBar progress={progress} color={Colors.white} style={userUploadModalStyles.progressBar}/>
					</View>
				</View>
			</Modal>
		</View>
	)
};

export default Upload;