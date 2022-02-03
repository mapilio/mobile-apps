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
	const upload_url = `${process.env.SERVICE_URL}/api/function/mapilio/imagery/upload`
	const cancelToken = axios.CancelToken.source();
	const { connection } = useSelector((state) => state.generalReducer);

	const hFov = (horizontal_pixel, pixel_pitch, focal_length) => {
		return 360 / Math.PI * Math.atan(horizontal_pixel / 2 * pixel_pitch / 1e3 / focal_length)
	}

	const hFovCalculate = (horizontal_pixel, vertical_pixel, focal_length) => {
		const pixel_pitch = (Math.sqrt(horizontal_pixel * horizontal_pixel + vertical_pixel * vertical_pixel) / 10) *
			(25.4 / Math.sqrt(horizontal_pixel * horizontal_pixel + vertical_pixel * vertical_pixel))

		return Math.round(10 * hFov(horizontal_pixel, pixel_pitch, focal_length)) / 10;
	}

	const getHash = () => {
		FileSystem.readDirectoryAsync(FileSystem.documentDirectory + `${auth.id}`).then((files) => {
			const sequences = sequence_uuid ? files.filter(el => el === String(sequence_uuid)) : files;
			sequences.map(async (sequence) => {
				setModalVisible(true)
				const sequencePath = FileSystem.documentDirectory + `${auth.id}/${sequence}`
				const sequenceFiles = await FileSystem.readDirectoryAsync(sequencePath);
				if (sequenceFiles.length) {
					let uploadedFile = 0;
					sequenceFiles.map((file, i) => {
						RNFS.stat(sequencePath + '/' + file).then((fileInfo) => {
							const filePath = Platform.OS === 'ios' ? fileInfo.path.replace('file://', '') : fileInfo.path

							const data = new FormData();
							data.append('file', {uri: filePath, name: file, type: 'image/jpeg'});
							data.append('email', userInformation.email);
							data.append('project_organization_key', '');
							data.append('project_key', '');

							axios.post(`${process.env.CDN_URL}/api/upload/mobile`, data, {
								onUploadProgress: ({loaded, total}) => {
									// TODO Progressbar Calculate
									console.log(loaded)
								}
							}).then((response) => {
								db.query(`SELECT * FROM captures WHERE path = "${filePath}" AND sequence_uuid="${sequence}"`, async (_, result) => {
									const data = await result.rows._array[0];
									const exif = await JSON.parse(data.exif)
									const location = await JSON.parse(data.location)
									const fov = await hFovCalculate(exif.ImageWidth, exif.ImageLength, exif.FocalLength)
									await db.query(`INSERT INTO uploads (
																		filepath,
																		filesize,
																		filename,
																		file_resolution,
																		sequence_uuid,
																		latitude,
																		longitude,
																		altitude,
																		heading,
																		orientation,
																		make,
																		model,
																		photo_uuid,
																		capture_time,
																		hash,
																		fov) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, (_, result) => {
										uploadedFile++
										if (sequenceFiles.length === uploadedFile) {
											sendFile(sequence)
										}
									}, [
										filePath,
										fileInfo.size,
										file,
										`${exif.ImageWidth}x${exif.ImageLength}`,
										sequence,
										location.coords.latitude,
										location.coords.longitude,
										location.coords.altitude,
										location.coords.heading,
										exif.Orientation,
										exif.Make,
										exif.Model,
										md5(userInformation.email + exif.DateTime),
										exif.DateTime,
										response.data.files[0].hash,
										fov
									])
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
						})
					})
				}
			})
		});
	}

	const sendFile = async (sequence) => {
		let files = {
			"options": {
				"parameters": {
					"hash": {},
					"organization_key": "",
					"project_key": "",
					"json_data": [],
					"summary": {
						"Information": {
							"total_images": 1,
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
		let filesize = 0

		await db.query(`SELECT * FROM uploads WHERE sequence_uuid="${sequence}"`, (_, result) => {
			result.rows._array.map((file) => {
				files.options.parameters.hash = {
					[sequence]: file.hash
				}
				files.options.parameters.json_data.push({
					"Latitude": file.latitude,
					"Longitude": file.longitude,
					"CaptureTime": file.capture_time,
					"Altitude": file.altitude,
					"Heading": file.heading,
					"SequenceUUID": file.sequence_uuid,
					"Orientation": file.orientation,
					"DeviceMake": file.make,
					"ImageSize": "1920x1080",
					"FoV": file.fov,
					"DeviceModel": file.model,
					"PhotoUUID": file.photo_uuid,
					"filename": file.filename,
					"anomaly": 0
				})
				files.options.parameters.summary.Information.total_images = result.rows._array.length
				files.options.parameters.summary.Information.size = {
					[sequence]: {
						count: result.rows._array.length,
						size: ((filesize += file.filesize) / 1024 / 1024),
					}
				}
			})
			fetchHandler({
				url: upload_url,
				method: 'POST',
				data: files
			}).then((res) => {
				if (res.status === true) {
					FileSystem.deleteAsync(FileSystem.documentDirectory + `${auth.id}/${sequence}`).then(() => {
						db.query(`DELETE FROM captures where sequence_uuid = '${sequence_uuid}'`, () => {
							db.query('SELECT *, COUNT(*) as count FROM captures GROUP BY sequence_uuid', (_, result) => {
								dispatch({type: UPLOAD_DATA, payload: result.rows._array});
								navigation.navigate(Routes.upload)
								setModalVisible(false)
							})
						})
					})
				}
			}).catch((err) => {
				setModalVisible(false)
				toastGenerator(
					err,
					require("../../assets/images/Warning.png"),
					errorAlertStyles.alertContainer,
					errorAlertStyles.alertTitle,
					errorAlertStyles.alertImage,
					5000
				);
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