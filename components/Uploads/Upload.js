import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import * as FileSystem from "expo-file-system";
import {Alert, Modal, Platform, TouchableOpacity, View} from "react-native";
import db from "../../db";
import {UPLOAD_DATA} from "../../store/actionsName";
import {CloseIcon, UploadIcon} from "../../assets/svg/illustrations";
import {CustomText} from "../../highordercomponents";
import {userUploadModalStyles} from "../../styles/userUploadStyle";
import {fetchHandler, toastGenerator} from "../../helper/helper";
import {Routes} from "../../navigator/Routes";
import * as Progress from 'react-native-progress';
import {errorAlertStyles} from "../../styles/alertStyles";
import axios from "axios";
import {SERVICE_URL,IMAGE_API} from '@env'
import RNFetchBlob from "rn-fetch-blob";
const md5 = require('md5');
const RNFS = require('react-native-fs');

const Upload = ({sequence_uuid, navigation}) => {

	const dispatch = useDispatch();
	const {uploadData} = useSelector((status) => status.uploadReducer);
	const {progress} = useSelector((status) => status.uploadReducer);
	const {auth, userInformation} = useSelector((status) => status.getTokenReducer);
	const [mbytes, setMbytes] = useState(0);
	const [mbps, setMbps] = useState(0);
	const [status, setStatus] = useState('');
	const [modalVisible, setModalVisible] = useState(false);
	const cancelToken = axios.CancelToken.source();
	const { connection } = useSelector((state) => state.generalReducer);

	const hFov = (horizontal_pixel, pixel_pitch, focal_length) => {
		return 360 / Math.PI * Math.atan(horizontal_pixel / 2 * pixel_pitch / 1e3 / focal_length)
	}

	const authPath = FileSystem.documentDirectory + (auth.id)
	const newPath = authPath + sequence_uuid;
	console.log(newPath)


	const hFovCalculate = (horizontal_pixel, vertical_pixel, focal_length) => {
		const pixel_pitch = (Math.sqrt(horizontal_pixel * horizontal_pixel + vertical_pixel * vertical_pixel) / 10) *
			(25.4 / Math.sqrt(horizontal_pixel * horizontal_pixel + vertical_pixel * vertical_pixel))

		return Math.round(10 * hFov(horizontal_pixel, pixel_pitch, focal_length)) / 10;
	}

	const getHash = () => {
		const sequences = sequence_uuid ? uploadData.filter((data) => data.sequence_uuid === sequence_uuid) : uploadData
		sequences.map((sequence) => {
			setModalVisible(true)
			db.query(`SELECT * FROM captures WHERE sequence_uuid="${sequence.sequence_uuid}"`, (_, results) => {
				results.rows._array.map(async (data, i) => {
					let file = await RNFetchBlob.fs.stat(data.path)
					file.path = Platform.OS === 'android' ? 'file://' + file.path : file.path
					RNFS.exists(file.path).then(async (fileExist) => {
						if (fileExist) {
							const data = new FormData();
							data.append('file', {uri: file.path, name: file.filename, type: 'image/jpeg'});
							data.append('email', userInformation.email);
							data.append('project_organization_key', '');
							data.append('project_key', '');
							await axios.post(`${IMAGE_API}/api/upload/mobile`, data).then((response) => {
								db.query(`UPDATE captures SET uploaded=1, hash="${response.data.files[0].hash}" WHERE path="${file.path}" AND sequence_uuid="${sequence.sequence_uuid}"`, () => {
									if (i === results.rows._array.length - 1) {
										sendFile(sequence.sequence_uuid)
									}
								})
							}).catch((err) => {
								toastGenerator(
									err,
									require("../../assets/images/Warning.png"),
									errorAlertStyles.alertContainer,
									errorAlertStyles.alertTitle,
									errorAlertStyles.alertImage,
									5000
								);
							})
						}
					})
				})
			})
		})
	}

	const sendFile = (sequence) => {
		let files = {
			"options": {
				"parameters": {
					"hash": {},
					"organization_key": "",
					"project_key": "",
					"json_data": [],
					"summary": {
						"Information": {
							"total_images": 0,
							"processed_images": 0,
							"failed_images": 0,
							"duplicated_images": 0,
							"size": {},
							"fails_sequence": []
						}
					}
				}
			}
		}
		let filesize = 0;
		db.query(`SELECT * FROM captures WHERE sequence_uuid="${sequence}" AND uploaded=1 AND hash IS NOT NULL`, (_, results) => {
			results.rows._array.map(async (file, i) => {
				const location = await JSON.parse(file.location)
				const exif = await JSON.parse(file.exif)
				const fileInfo = await RNFetchBlob.fs.stat(file.path)
				const fov = await hFovCalculate(exif.ImageWidth || exif.PixelXDimension, exif.ImageLength || exif.PixelYDimension, exif.FocalLength)

				files.options.parameters.hash = {
					[sequence]: file.hash
				}
				files.options.parameters.json_data.push({
					"Latitude": location.coords.latitude,
					"Longitude": location.coords.longitude,
					"Altitude": location.coords.altitude,
					"Heading": location.coords.heading,
					"CaptureTime": exif.DateTime || exif.DateTimeOriginal,
					"Orientation": exif.Orientation,
					"DeviceMake": exif.Make || exif.LensMake,
					"DeviceModel": exif.Model || exif.LensModel,
					"ImageSize": `${exif.ImageWidth || exif.PixelXDimension}x${exif.ImageLength || exif.PixelYDimension}`,
					"filename": fileInfo.filename,
					"SequenceUUID": file.sequence_uuid,
					"FoV": fov,
					"PhotoUUID": md5(userInformation.email + exif.DateTime || exif.DateTimeOriginal),
					"anomaly": 0
				})
				files.options.parameters.summary.Information.total_images = results.rows._array.length
				files.options.parameters.summary.Information.size = {
					[sequence]: {
						count: results.rows._array.length,
						size: ((filesize += fileInfo.size) / 1024 / 1024),
					}
				}

				if (i === results.rows._array.length - 1) {
					fetchHandler({
						url: `${SERVICE_URL}/api/function/mapilio/imagery/upload`,
						method: 'POST',
						data: files
					}).then((res)=> {
						if (res.status === true) {
							deleteSequence(sequence)
						}
					}).catch((err) => {
						console.log(err)
					})
				}
			})
		})
	}

	const deleteSequence = (sequence) => {
		FileSystem.deleteAsync(FileSystem.documentDirectory + `${auth.id}/${sequence}`).then(() => {
			db.query(`DELETE FROM captures where sequence_uuid = '${sequence}'`, () => {
				db.query('SELECT *, COUNT(*) as count FROM captures GROUP BY sequence_uuid', (_, result) => {
					dispatch({type: UPLOAD_DATA, payload: result.rows._array});
					navigation.navigate(Routes.upload)
					setModalVisible(false)
				})
			})
		})
	}

	return (
		<View>
			<TouchableOpacity onPress={async () => {
				if (uploadData.length) {
					if (connection.connectionType === "wifi") {
						await getHash()
					} else {
						Alert.alert(
							"Are you sure?",
							"Are you sure you want to send via cellular data?",
							[
								{ text: "Yes", onPress: () => getHash() },
								{ text: "No" }
							]
						)
					}
				}
			}}>
				<UploadIcon/>
			</TouchableOpacity>
			<Modal
				animationType="slide"
				transparent={false}
				visible={modalVisible}
			>
				<View style={userUploadModalStyles.container}>
					<TouchableOpacity style={userUploadModalStyles.close} onPress={() => {
						cancelToken.cancel('Operation canceled by the user.')
						setModalVisible(false)
					}}>
						<CloseIcon />
					</TouchableOpacity>
					<View style={{alignItems: 'center'}}>
						<CustomText style={userUploadModalStyles.text}>{status}</CustomText>
						<CustomText style={userUploadModalStyles.text}>
							{mbytes.toFixed(2) + "MB (" + (progress * 100).toFixed(2) + "%) " + mbps.toFixed(2) + " Mbps"}
						</CustomText>
						<Progress.Bar progress={progress} width={200} indeterminate={true}/>
					</View>
				</View>
			</Modal>
		</View>
	)
};

export default Upload;