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
import {dateConvert, fetchHandler} from "../../helper/helper";
import { Routes } from "../../navigator/Routes";
import * as Progress from "react-native-progress";
import axios from "axios";
import { RFValue } from "react-native-responsive-fontsize";
import {toastMessage} from "../../helper/alerts";
import {fovCalculate} from "../../helper/fov";
import {activateKeepAwake, deactivateKeepAwake} from "expo-keep-awake";
import Config from "react-native-config";

const md5 = require("md5");

const Upload = ({sequence_uuid, navigation}) => {
    const dispatch = useDispatch();
    const {uploadData} = useSelector((status) => status.uploadReducer);
    const [summerCount, setSummerCount] = useState(0);
    const [sentCount, setSentCount] = useState(0);
    const [statusUpload, setStatusUpload] = useState(false);
    const {auth, userInformation} = useSelector((status) => status.getTokenReducer);
    const [modalVisible, setModalVisible] = useState(false);
    const cancelToken = axios.CancelToken.source();
    const {connection} = useSelector((state) => state.generalReducer);
    let images = [];

    const _uploadBroken = (error) => {
        setModalVisible(false);
        setSentCount(0);
        setStatusUpload(false);
        toastMessage.error(`${error}`)
        dispatch({type: IS_UPLOADED, payload: true});
        deactivateKeepAwake();
    }

    const sequenceFilter = () => {
        return new Promise((resolve) => {
            const sequences = sequence_uuid ?
                uploadData.filter((data) => data.sequence_uuid === sequence_uuid).map((data) => data.sequence_uuid) :
                uploadData.map((data) => data.sequence_uuid)

            calcImageCount(sequences).then((count) => {
                setSummerCount(count)
                resolve(sequences)
            })
        })
    }

    const calcImageCount = (sequences) => {
        return new Promise((resolve) => {
            db.queryAsync(`SELECT COUNT(*) as count FROM captures WHERE sequence_uuid IN ('${sequences.join("', '")}')`).then((data) => {
                resolve(data[0].count);
            })
        })
    }

    const getSequences = (sequences, index = 0) => {
        activateKeepAwake();
        setModalVisible(true);

        if (sequences[index]) {
            setImages(sequences[index]).then(() => {
                getSequences(sequences, ++index)
            })
        } else {
            sendImages(0, 0)
        }
    };

    const setImages = (sequence) => {
        return new Promise(async (resolve) => {
            images.push(await db.queryAsync(`SELECT * FROM captures WHERE sequence_uuid='${sequence}'`))
            resolve()
        })
    }

    const sendImages = (i = 0, j = 0) => {
        if (images[i]) {
            if (images[i][j]) {
                getHash(images[i][j]).then(() => {
                    sendImages(i, ++j)
                }).catch((err) => {
                    _uploadBroken(err)
                })
            }
            else {
                imageryUpload(i).then(() => {
                    sendImages(++i)
                }).catch((err) => {
                    _uploadBroken(err)
                })
            }
        } else {
            toastMessage.success("Upload success")
            dispatch({type: IS_UPLOADED, payload: true});
            setModalVisible(false);
            setSentCount(0);
            setStatusUpload(false);
            deactivateKeepAwake();
        }
    }

    const getHash = (image) => {
        return new Promise(async (resolve, reject) => {
            const filePath = Platform.OS === "ios" ? image.path.replace("file://", "") : image.path
            const fileName = filePath.split("/").pop();

            FileSystem.getInfoAsync(filePath).then(fileInfo => {
                if (fileInfo.exists) {
                    const formData = new FormData();
                    formData.append("file", {uri: filePath, name: fileName, type: "image/jpeg"});
                    formData.append("email", userInformation.email)

                    if (image.project_key && image.organization_key) {
                        formData.append("project_organization_key", image.organization_key);
                        formData.append("project_key", image.project_key);
                    }

                    fetchHandler({
                        url: `${Config.CDN_URL}/api/upload/mobile`,
                        method: 'POST',
                        data: formData
                    }).then(async (response) => {
                        images.hash = response.files[0].hash
                        await db.queryAsync(`UPDATE captures SET uploaded=1, hash='${response.files[0].hash}' WHERE path='${image.path}' AND sequence_uuid='${image.sequence_uuid}'`)
                        setSentCount((state) => state + 1)
                        resolve(response.files[0].hash)
                    }).catch(err => reject(err))
                } else {
                    db.deleteById(image.id)

                    db.query(
                      "SELECT *, COUNT(*) as count FROM captures GROUP BY sequence_uuid ORDER BY id DESC",
                      (_, result) => {
                          dispatch({type: UPLOAD_DATA, payload: result.rows._array});
                          navigation.navigate(Routes.upload);
                      }
                    );

                    reject(`Oops! I can't read the ${fileName}. Deleting!`)
                }
            }).catch(() => {
                db.deleteById(image.id)

                db.query(
                  "SELECT *, COUNT(*) as count FROM captures GROUP BY sequence_uuid ORDER BY id DESC",
                  (_, result) => {
                      dispatch({type: UPLOAD_DATA, payload: result.rows._array,});
                      navigation.navigate(Routes.upload);
                  }
                );

                reject(`Oops! I can't read the ${fileName}. Deleting!`)
            })
        })
    }

    const imageryUpload = (index) => {
        return new Promise((resolve, reject) => {
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
                        }
                    }
                }
            };
            let filesize = 0;

            images[index].forEach(async (image, i) => {
                const location = await JSON.parse(image.location);
                const exif = await JSON.parse(image.exif);

                FileSystem.getInfoAsync(Platform.OS === "ios" ? image.path.replace("file://", "") : image.path).then(async (fileInfo) => {
                    const fileName = image.path.split("/").pop()
                    const horizontal = exif.ImageWidth || exif.PixelXDimension;
                    const vertical = exif.ImageLength || exif.PixelYDimension;

                    const fov = fovCalculate(
                        horizontal > vertical ? horizontal : vertical,
                        horizontal < vertical ? horizontal : vertical,
                        exif.FocalLength,
                        "horizontal"
                    );

                    if (image.project_key && image.organization_key) {
                        files.options.parameters.summary.Information.organization_key =
                            image.organization_key;
                        files.options.parameters.summary.Information.project_key =
                            image.project_key;
                    }

                    files.options.parameters.json_data.push({
                        Latitude: location.coords.latitude,
                        Longitude: location.coords.longitude,
                        Altitude: location.coords.altitude,
                        Heading: location.coords.heading,
                        CaptureTime: dateConvert((exif.DateTime || exif.DateTimeOriginal), 'YYYY-MM-D HH:mm'),
                        Orientation: exif.Orientation,
                        DeviceMake: exif.Make || exif.LensMake,
                        DeviceModel: exif.Model || exif.LensModel,
                        ImageSize: `${exif.ImageWidth || exif.PixelXDimension}x${
                            exif.ImageLength || exif.PixelYDimension
                        }`,
                        filename: fileName,
                        SequenceUUID: image.sequence_uuid,
                        FoV: fov,
                        PhotoUUID: md5(userInformation.email + (exif.DateTime || exif.DateTimeOriginal)),
                        anomaly: 0,
                    });
                    files.options.parameters.summary.Information.total_images =
                        images[index].length;
                    files.options.parameters.summary.Information.sequence_uuid = image.sequence_uuid;
                    files.options.parameters.summary.Information.count =
                        images[index].length;
                    files.options.parameters.summary.Information.size =
                        (filesize += fileInfo.size) / 1024 / 1024;
                    files.options.parameters.summary.Information.hash = images.hash;

                    if(i === images[index].length - 1) {
                        fetchHandler({
                            url: `${Config.SERVICE_URL}/api/function/mapilio/imagery/upload`,
                            method: "POST",
                            data: files,
                        }).then((res) => {
                            if (res.status === true) {
                                deleteSequence(image.sequence_uuid).then(() => {
                                    resolve()
                                })
                            }
                        }).catch((err) => {
                            reject(err)
                        })
                    }
                })
            })
        })
    }

    const percentage = (partialValue, totalValue) => {
        let number = (100 * partialValue) / totalValue;

        return (number) ? number / 100 : 0;
    };

    const deleteSequence = (sequence) => {
        return new Promise(async(resolve) => {
            navigation.navigate(Routes.upload);
            await FileSystem.deleteAsync(FileSystem.documentDirectory + `${auth.id}/${sequence}`)
            await db.queryAsync(`DELETE FROM captures WHERE sequence_uuid='${sequence}'`)
            db.getGroupByWithColumn((_, result) => {
                dispatch({type: UPLOAD_DATA, payload: result.rows._array});
            })
            resolve()
        });
    };

    const checkInternet = () => {
        if (uploadData.length && connection.connectionType === "wifi") {
            sequenceFilter().then((sequences) => {
                getSequences(sequences)
            })
        } else {
            Alert.alert(
                "Are you sure?",
                "Are you sure you want to send via cellular data?",
                [{text: "Yes", onPress: () => sequenceFilter().then((sequences) => getSequences(sequences))}, {text: "No"}]
            );
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
                <UploadIcon/>
            </TouchableOpacity>
            <Modal animationType="slide" transparent={false} visible={modalVisible}>
                <View style={userUploadModalStyles.container}>
                    <TouchableOpacity
                        style={userUploadModalStyles.close}
                        onPress={() => {
                            cancelToken.cancel("Operation canceled by the user.");
                            setModalVisible(false);
                            setSentCount(0);
                            setStatusUpload(false);
                        }}
                    >
                        <CloseIcon/>
                    </TouchableOpacity>
                    <View style={{alignItems: "center"}}>
                        {!statusUpload && (
                            <CustomText style={userUploadModalStyles.text}>
                                {sentCount + "/" + summerCount}
                            </CustomText>
                        )}
                        {statusUpload && (
                            <View style={{marginBottom: RFValue(20)}}>
                                <ActivityIndicator color={"#FFFFFF"}/>
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
