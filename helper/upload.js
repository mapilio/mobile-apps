import {store} from "../store/store";
import {Alert} from "react-native";
import db from "../db";
import * as FileSystem from "expo-file-system";
import {dateConvert} from "./helper";
import {calculate} from "./calculator";
import md5 from "md5";
import i18n from "i18next";
import {api, cdn} from "../util/helpers/api";
let apiController = {};
let cdnController = {};

const translate = (key) => i18n.t(key, {ns: "upload"})

export const isWifi = () => {
  return new Promise((resolve, reject) => {
    const {connection} = store.getState().generalReducer

    if (connection.connectionType === 'wifi') {
      resolve({status: 'success'})
    } else {
      Alert.alert(
        translate('are_you_sure'),
        translate('is_cellular_data'),
        [
          {text: translate('yes'), onPress: () => resolve({status: 'success'})},
          {text: translate('no'), onPress: () => reject({status: 'canceled'})}
        ]
      )
    }
  })
}

export const filesFilter = async (group_id = null) => {
  try {
    const sequences = await db.getGroupByWithSequenceUUID();

    if (group_id) {
      return sequences.filter((item) => item.group_id === group_id)
    }

    return sequences;

  } catch (e) {
    throw new Error(e);
  }
}

export const getImagesBySequence = async (sequence) => {
  return await db.getCapturesBySequenceIdAsync(sequence);
}

export const getHash = async (image) => {
  cdnController = new AbortController();
  const {userInformation} = store.getState().getTokenReducer

  if (image.hash) {
    return {status: 'success', hash: image.hash}
  }

  const fileName = image.path.split("/").pop();

  try {
    const file = await FileSystem.getInfoAsync(FileSystem.documentDirectory + image.path)

    const formData = new FormData();
    formData.append("file", {uri: file.uri, name: fileName, type: "image/jpeg"});
    formData.append("email", userInformation.email)

    if (image.project_key && image.organization_key) {
      formData.append("project_organization_key", image.organization_key);
      formData.append("project_key", image.project_key);
    }

    const response = await cdn.post('/api/upload/mobile', formData, {signal: cdnController?.signal})

    await db.queryAsync(`UPDATE captures SET uploaded=1, hash='${response.files[0].hash}' WHERE id=${image.id}`)
    return {status: 'success', hash: response.files[0].hash}


  } catch (e) {
    if (e.name === 'CanceledError') {
      return {status: 'warning', message: translate('you_cancelled_upload')}
    }

    throw new Error(e?.response?.data?.message || e.message);
  }
}

export const imageryUpload = async (index, pictures) => {
  const {userInformation} = store.getState().getTokenReducer

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

  for (let i = 0; i < pictures[index].length; i++) {

    const picture = pictures[index][i];

    if (pictures[index].length < 5) {
      await deleteSequence(picture.sequence_uuid)
      return {status: 'success', message: translate('sequence_deleted')}
    }

    const {latitude, longitude, altitude, heading, speed, accuracy: accuracy_level} = JSON.parse(picture.location)
    const exif = JSON.parse(picture.exif);
    const fileName = picture.path.split("/").pop();
    const {
      Orientation,
      ['{TIFF}']: {Make, Model, DateTime},
      ['{Exif}']: {PixelXDimension, PixelYDimension},
      LensMake,
      LensModel,
      DateTimeOriginal,
      ImageWidth,
      ImageLength,
      gyroscope,
      accelerometer,
    } = exif;

    try {
      const fileInfo = await FileSystem.getInfoAsync(FileSystem.documentDirectory + picture.path)

      const horizontal = ImageWidth || PixelXDimension;
      const vertical = ImageLength || PixelYDimension;

      const fov = calculate.fov(
        horizontal > vertical ? horizontal : vertical,
        horizontal < vertical ? horizontal : vertical,
        exif.FocalLength,
        "horizontal"
      );

      if (picture.project_key && picture.organization_key) {
        files.options.parameters.summary.Information.organization_key = picture.organization_key;
        files.options.parameters.summary.Information.project_key = picture.project_key;
      }

      files.options.parameters.json_data.push({
        latitude,
        longitude,
        altitude,
        heading,
        gyroscope,
        accelerometer,
        accuracy_level,
        captureTime: dateConvert((DateTime || DateTimeOriginal), 'YYYY-MM-D HH:mm:ss'),
        orientation: Orientation,
        deviceMake: Make || LensMake,
        deviceModel: Model || LensModel,
        imageSize: `${ImageWidth || PixelXDimension}x${ImageLength || PixelYDimension}`,
        fov: fov,
        sequenceUuid: picture.sequence_uuid,
        photoUuid: md5(userInformation.email + (DateTime || DateTimeOriginal)),
        filename: fileName,
        roll: calculate.roll(accelerometer),
        yaw: calculate.yaw(accelerometer),
        pitch: calculate.pitch(accelerometer),
        car_speed: speed * 3.6,
        anomaly: 0,
        capture_address: picture.address || null,
      });

      files.options.parameters.summary.Information.total_images = pictures[index].length;
      files.options.parameters.summary.Information.sequence_uuid = picture.sequence_uuid;
      files.options.parameters.summary.Information.count = pictures[index].length;
      files.options.parameters.summary.Information.size = (filesize += fileInfo.size) / 1024 / 1024;
      files.options.parameters.summary.Information.hash = pictures.hash;
      files.options.parameters.summary.Information.group_key = picture.group_id;

      if (pictures[index].length - 1 === i) {
        apiController = new AbortController();
        const response = await api.post('/api/function/mapilio/imagery/upload', files, {signal: apiController?.signal,})

        if (response.status) {
          await deleteSequence(picture.sequence_uuid)
          return {status: 'success', message: translate('upload_completed')}
        }

        return {status: 'warning', message: translate('upload_failed') + ' ' + response.message}
      }

    } catch (e) {
      throw new Error(e?.response?.data?.message || e.message);
    }
  }
}

const deleteSequence = async (sequence) => {
  const files = await db.getCapturesBySequenceIdAsync(sequence);

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    await db.deleteById(file.id)
    const info = await FileSystem.getInfoAsync(FileSystem.documentDirectory + file.path)
    info.exists && await FileSystem.deleteAsync(FileSystem.documentDirectory + file.path)
  }
}

export const percentage = (partialValue, totalValue) => {
  let number = (100 * partialValue) / totalValue;

  return (number) ? number : 0;
};

export const closeRequest = () => {
  apiController?.abort()
  cdnController?.abort()
}
