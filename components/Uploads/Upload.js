import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import * as FileSystem from "expo-file-system";
import {Modal, Platform, TouchableOpacity, View} from "react-native";
import database from "../../db";
import db from "../../db";
import {PROGRESS, UPLOAD_DATA} from "../../store/actionsName";
import {UploadIcon} from "../../assets/svg/illustrations";
import {CustomText} from "../../highordercomponents";
import {userUploadModalStyles} from "../../styles/userUploadStyle";
import RNFetchBlob from "rn-fetch-blob";
import {fetchHandler} from "../../helper/helper";
import {Routes} from "../../navigator/Routes";
import * as Progress from 'react-native-progress';
const md5 = require('md5');
const RNFS = require('react-native-fs');

const Upload = ({sequence_uuid, navigation}) => {

	const dispatch = useDispatch();
	const {progress} = useSelector((status) => status.uploadReducer);
	const {auth, userInformation} = useSelector((status) => status.getTokenReducer);
	const [mbytes, setMbytes] = useState(0);
	const [mbps, setMbps] = useState(0);
	const [status, setStatus] = useState('');
	const [modalVisible, setModalVisible] = useState(false);
	const [totalFile, setTotalFile] = useState(0);
	const [uploadedFile, setUploadedFile] = useState(0);
	let percent = 0;
	const upload_url = `${process.env.API_URL}/api/function/mapilio/imagery/upload`

	const hFov = (horizontal_pixel, pixel_pitch, focal_length) => {
		return 360 / Math.PI * Math.atan(horizontal_pixel / 2 * pixel_pitch / 1e3 / focal_length)
	}

	const hFovCalculate = (horizontal_pixel, vertical_pixel, focal_length) => {
		const pixel_pitch = (Math.sqrt(horizontal_pixel * horizontal_pixel + vertical_pixel * vertical_pixel) / 10) *
			(25.4 / Math.sqrt(horizontal_pixel * horizontal_pixel + vertical_pixel * vertical_pixel))

		return Math.round(10 * hFov(horizontal_pixel, pixel_pitch, focal_length)) / 10;
	}

	const getHash = async () => {
		let lastNow = new Date().getTime();
		let lastKBytes = 0;

		await setModalVisible(true)
		const files = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory + `${auth.id}`);
		const sequences = sequence_uuid ? files.filter(el => el === String(sequence_uuid)) : files;
		sequences.map(async (value, index) => {
			const path = FileSystem.documentDirectory + `${auth.id}/${value}`;
			await FileSystem.readDirectoryAsync(path).then((images) => {
				images.map(async (image) => {
					const fileInfo = await RNFS.stat(path + '/' + image);
					const filePath = await Platform.OS === 'ios' ? fileInfo.path.replace('file://', '') : fileInfo.path
					RNFetchBlob.fetch('POST', `${process.env.CDN_URL}/api/upload/mobile`, {}, [
						{name: 'email', data: userInformation.email},
						{name: 'project_organization_key', data: ''},
						{name: 'project_key', data: ''},
						{name: 'file', filename: image, data: RNFetchBlob.wrap(filePath)}
					]).uploadProgress((written, total) => {
						let now = new Date().getTime();
						let completed = (written / total);
						percent = completed * 100;
						let kbytes = written / 1024;
						setMbytes(kbytes / 1024)
						let uploadedkBytes = kbytes - lastKBytes;
						let elapsed = (now - lastNow) / 1000;
						setMbps(elapsed ? (uploadedkBytes / elapsed) / 1000 : 0);
						dispatch({type: PROGRESS, payload: completed});
					}).then(async (response) => {
						await db.query(`SELECT * FROM captures WHERE path = "${filePath}" AND sequence_uuid="${value}"`, (_, result) => {
							const data = result.rows._array[0];
							const exif = JSON.parse(data.exif)
							const location = JSON.parse(data.location)
							const fov = hFovCalculate(exif.ImageWidth, exif.ImageLength, exif.FocalLength)
							db.query(`INSERT INTO uploads (
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
									fov) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, async (_, result) => {
								await db.query(`DELETE FROM captures WHERE id=${data.id}`)
								await database.query('SELECT *, COUNT(*) as count FROM captures GROUP BY sequence_uuid', (_, result) => {
									dispatch({type: UPLOAD_DATA, payload: result.rows._array});
								})
								await FileSystem.deleteAsync(FileSystem.documentDirectory + `${auth.id}/${value}`)
							}, [
								filePath,
								fileInfo.size,
								image,
								`${exif.ImageWidth}x${exif.ImageLength}`,
								value,
								location.coords.latitude,
								location.coords.longitude,
								location.coords.altitude,
								location.coords.heading,
								exif.Orientation,
								exif.Make,
								exif.Model,
								md5(userInformation.email + exif.DateTime),
								exif.DateTime,
								JSON.parse(response.data).files[0].hash,
								fov
							])
						})
						return JSON.parse(response.data).files[0].hash;
					}).catch((err) => console.log(err))
				})
			})
		})
		await sendFile(sequences)
	}

	const sendFile = async (sequences) => {
		sequences.map(async (sequence, i) => {
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
				result.rows._array.map(async (file) => {
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
							size: (filesize += file.filesize),
						}
					}
				})

				fetchHandler({
					url: upload_url,
					method: "POST",
					data: files,
				}).then(async (res) => {
					console.log(res, sequence)
				}).catch((err) => {
					console.log(err)
				})
			})
		})
		setModalVisible(false)
		navigation.navigate(Routes.upload)
	}

	return (
		<View>
			<TouchableOpacity onPress={async () => {
				await getHash()
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
						<Progress.Bar progress={progress} width={200} indeterminate={true} />
					</View>
				</View>
			</Modal>
		</View>
	)
};

export default Upload;