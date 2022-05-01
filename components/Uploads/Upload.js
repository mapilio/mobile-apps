import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as FileSystem from "expo-file-system";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  TouchableOpacity,
  View,
} from "react-native";
import db from "../../db";
import { IS_UPLOADED, UPLOAD_DATA } from "../../store/actionsName";
import { CloseIcon, UploadIcon } from "../../assets/svg/illustrations";
import { CustomText } from "../../highordercomponents";
import { userUploadModalStyles } from "../../styles/userUploadStyle";
import { fetchHandler } from "../../helper/helper";
import { Routes } from "../../navigator/Routes";
import * as Progress from "react-native-progress";
import axios from "axios";
import { SERVICE_URL } from "@env";
import { RFValue } from "react-native-responsive-fontsize";
import {toastMessage} from "../../helper/alerts";
import {fovCalculate} from "../../helper/fov";
const md5 = require("md5");

const Upload = ({ sequence_uuid, navigation }) => {
  const dispatch = useDispatch();
  const { uploadData } = useSelector((status) => status.uploadReducer);
  const [summerCount, setSummerCount] = useState(0);
  const [sentCount, setSentCount] = useState(0);
  const [statusUpload, setStatusUpload] = useState(false);
	const {auth, userInformation} = useSelector((status) => status.getTokenReducer);
  const [modalVisible, setModalVisible] = useState(false);
  const cancelToken = axios.CancelToken.source();
	const {connection} = useSelector((state) => state.generalReducer);
  const [deletedRows, setDeletedRows] = useState(0);

  const getSequences = () =>
    sequence_uuid
      ? uploadData.filter((data) => data.sequence_uuid === sequence_uuid)
      : uploadData;

  const summerImages = () => {
    const sequences = getSequences();
    let summer = sequences.reduce((partialSum, a) => partialSum + a.count, 0);
    setSummerCount(summer);
  };

  const getHash = () => {
    summerImages();
    const sequences = getSequences();
    sequences.map((sequence) => {
      setModalVisible(true);
      db.query(
        `SELECT * FROM captures WHERE sequence_uuid="${sequence.sequence_uuid}"`,
        (_, results) => {
          results.rows._array.map(async (data, i) => {
            const filePath = Platform.OS === "ios" ? data.path.replace("file://", "") : data.path;
            const fileName = filePath.split("/").pop();

						FileSystem.getInfoAsync(filePath).then(async (fileInfo) => {
              if (fileInfo.exists) {
                const formData = new FormData();
                formData.append("file", {
                  uri: filePath,
                  name: fileName,
                  type: "image/jpeg",
                });
                formData.append("email", userInformation.email);
                if (data.project_key && data.organization_key) {
                  formData.append(
                    "project_organization_key",
                    data.organization_key
                  );
                  formData.append("project_key", data.project_key);
                }
                await axios
                  .post(`${process.env.CDN_URL}/api/upload/mobile`, formData)
                  .then((response) => {
                    setSentCount((state) => state + 1);
                    db.query(
                      `UPDATE captures SET uploaded=1, hash="${response.data.files[0].hash}" WHERE path="${data.path}" AND sequence_uuid="${sequence.sequence_uuid}"`,
                      () => {
                        if (i === results.rows._array.length - 1) {
                          try {
                            sendFile(sequence.sequence_uuid);
                          } catch (error) {
														toastMessage.error("An error occurred while uploading.")
                          }
                        }
                      }
                    );
                  })
                  .catch((err) => {
										toastMessage.error(err)
                  });
              }
            });
          });
        }
      );
    });
  };

  const sendFile = (sequence) => {
    let files = {
      options: {
        parameters: {
          organization_key: "",
          project_key: "",
          json_data: [],
          summary: {
            Information: {
              total_images: 0,
              count: 0,
              anomaly_sequences: [],
              sequence_uuid: "",
              size: {},
              hash: "",
            },
          },
        },
      },
    };
    let filesize = 0;

    db.query(
      `SELECT * FROM captures WHERE sequence_uuid="${sequence}"`,
      (_, results) => {
        results.rows._array.map(async (file, i) => {
          const location = await JSON.parse(file.location);
          const exif = await JSON.parse(file.exif);

					FileSystem.getInfoAsync(Platform.OS === "ios" ? file.path.replace("file://", "") : file.path).then( async (fileInfo) => {
						const fileName = file.path.split("/").pop();
						const horizontal = exif.ImageWidth || exif.PixelXDimension;
						const vertical = exif.ImageLength || exif.PixelYDimension;
						const fov = fovCalculate(
							horizontal > vertical ? horizontal : vertical,
							horizontal < vertical ? horizontal : vertical,
							exif.FocalLength,
							"horizontal"
						);

						if (file.project_key && file.organization_key) {
							files.options.parameters.summary.Information.organization_key =
								file.organization_key;
							files.options.parameters.summary.Information.project_key =
								file.project_key;
						}

						files.options.parameters.json_data.push({
							Latitude: location.coords.latitude,
							Longitude: location.coords.longitude,
							Altitude: location.coords.altitude,
							Heading: location.coords.heading,
							CaptureTime: exif.DateTime || exif.DateTimeOriginal,
							Orientation: exif.Orientation,
							DeviceMake: exif.Make || exif.LensMake,
							DeviceModel: exif.Model || exif.LensModel,
							ImageSize: `${exif.ImageWidth || exif.PixelXDimension}x${
								exif.ImageLength || exif.PixelYDimension
							}`,
							filename: fileName,
							SequenceUUID: file.sequence_uuid,
							FoV: fov,
							PhotoUUID: md5(
								userInformation.email + (exif.DateTime || exif.DateTimeOriginal)
							),
							anomaly: 0,
						});
						files.options.parameters.summary.Information.total_images =
							results.rows._array.length;
						files.options.parameters.summary.Information.sequence_uuid = sequence;
						files.options.parameters.summary.Information.count =
							results.rows._array.length;
						files.options.parameters.summary.Information.size =
							(filesize += fileInfo.size) / 1024 / 1024;
						files.options.parameters.summary.Information.hash = file.hash;

						if (i === results.rows._array.length - 1) {
							fetchHandler({
								url: `${SERVICE_URL}/api/function/mapilio/imagery/upload`,
								method: "POST",
								data: files,
							})
								.then((res) => {
									if (res.status === true) {
										try {
											deleteSequence(sequence);
										} catch (error) {
											toastMessage.error("An error occurred while uploading.")
										}
									}
								})
								.catch(() => {
									toastMessage.error("An error occurred while uploading.")
								});
						}
					});
        });
      }
    );
  };

  const percentage = (partialValue, totalValue) => {
    let number = (100 * partialValue) / totalValue;
    return number / 100;
  };

  const deleteSequence = (sequence) => {
    FileSystem.deleteAsync(
      FileSystem.documentDirectory + `${auth.id}/${sequence}`
    ).then(() => {
      db.query(
        `DELETE FROM captures where sequence_uuid = '${sequence}'`,
        () => {
          db.query(
            "SELECT *, COUNT(*) as count FROM captures GROUP BY sequence_uuid ORDER BY id DESC",
            (_, result) => {
              setDeletedRows((state) => state + 1);
              dispatch({ type: UPLOAD_DATA, payload: result.rows._array });
              navigation.navigate(Routes.upload);
							toastMessage.success("Upload success")
              if (deletedRows === getSequences().length - 1) {
                dispatch({ type: IS_UPLOADED, payload: true });
                setModalVisible(false);
                setSentCount(0);
                setStatusUpload(false);
              }
            }
          );
        }
      );
    });
  };

  const checkInternet = async () => {
    if (uploadData.length) {
      if (connection.connectionType === "wifi") {
        await getHash();
      } else {
        Alert.alert(
          "Are you sure?",
          "Are you sure you want to send via cellular data?",
          [{ text: "Yes", onPress: () => getHash() }, { text: "No" }]
        );
      }
    }
  };

  useEffect(() => {
    if (sentCount !== 0 && summerCount === sentCount) {
      setStatusUpload(true);
    }
  }, [sentCount, summerCount]);

  return (
    <View>
      <TouchableOpacity onPress={checkInternet}>
        <UploadIcon />
      </TouchableOpacity>
      <Modal animationType="slide" transparent={false} visible={modalVisible}>
        <View style={userUploadModalStyles.container}>
          <TouchableOpacity
            style={userUploadModalStyles.close}
            onPress={() => {
              cancelToken.cancel("Operation canceled by the user.");
              setModalVisible(false);
            }}
          >
            <CloseIcon />
          </TouchableOpacity>
          <View style={{ alignItems: "center" }}>
            {!statusUpload && (
              <CustomText style={userUploadModalStyles.text}>
                {sentCount + "/" + summerCount}
              </CustomText>
            )}
            {statusUpload && (
              <View style={{ marginBottom: RFValue(20) }}>
                <ActivityIndicator color={"#FFFFFF"} />
                <CustomText
                  style={{
                    color: "#FFFFFF",
                    marginTop: RFValue(8),
                    textAlign: "center",
                    width: RFValue(300),
                  }}
                  lineCount={2}
                >
                  Your uploads sending. This process take a moment.
                </CustomText>
              </View>
            )}
            <Progress.Bar
              progress={percentage(sentCount, summerCount)}
              width={200}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Upload;
