import {store} from "../store/store";
import {Alert} from "react-native";
import db from "../db";
import {dateConvert} from "./helper";
import {calculate} from "./calculator";
import i18n from "i18next";
import {api, cdn} from "../util/helpers/api";
import axios from "axios";
import {captureException} from "@sentry/react-native";
import * as RNFS from '../util/fs';

let apiController;
let cdnController;

const translate = (key, ns = "upload") => i18n.t(key, {ns: ns})

export const isWifi = () => {
  return new Promise((resolve) => {
    const {connection} = store.getState().generalReducer

    if (connection.connectionType === 'wifi') {
      resolve({status: 'success'})
    } else {
      Alert.alert(translate('are_you_sure'), translate('is_cellular_data'), [
        {text: translate('yes'), onPress: () => resolve({status: 'success'})},
        {text: translate('no')}
      ])
    }
  })
}

export const getHash = async (image) => {
  const CancelToken = axios.CancelToken;
  cdnController = CancelToken.source();

  const {userInformation} = store.getState().getTokenReducer

  if (image.hash) {
    return {status: 'success', hash: image.hash}
  }

  const fileName = image.path.split("/").pop();

  try {
    let path = `${RNFS.DocumentDirectoryPath}`;
    if (image.default_storage_path === 'external') {
      const externalPath = await RNFS.getAllExternalFilesDirs()
      path = externalPath[1]
    }
    const file = await RNFS.stat(`file://${path}/${image.path}`)

    const formData = new FormData();
    formData.append("file", {uri: file.path, name: fileName, type: "image/jpeg"});
    formData.append("email", userInformation.email)

    if (image.project_key && image.organization_key) {
      formData.append("project_organization_key", image.organization_key);
      formData.append("project_key", image.project_key);
    }

    const response = await cdn.post('/api/upload/mobile', formData, {
      cancelToken: cdnController?.token,
      headers: {'Content-Type': 'multipart/form-data'}
    })

    const hash = response?.files?.[0]?.hash
    if (!hash) {
      return {status: 'error', message: translate('upload_failed')}
    }
    await db.runAsync('UPDATE captures SET uploaded=1, hash=? WHERE id=?', [hash, image.id])
    return {status: 'success', hash}
  } catch (error) {
    captureException(error, {
      tags: {
        functionName: 'getHash'
      }
    })
    return {status: 'error', message: throwMessage(error)}
  }
}

export const imageryUpload = async (images, sequence_uuid) => {
  const {userInformation} = store.getState().getTokenReducer
  const CancelToken = axios.CancelToken;
  apiController = CancelToken.source();

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

  if (images.length < 5) {
    await deleteSequence(sequence_uuid)
    return {status: 'success', message: translate('sequence_deleted')}
  }

  for (let image of images) {
    const {latitude, longitude, altitude, heading, speed, accuracy: accuracy_level} = JSON.parse(image.location)
    const exif = JSON.parse(image.exif);
    const fileName = image.path.split("/").pop();
    const {
      Orientation,
      Make,
      Model,
      DateTime,
      PixelXDimension,
      PixelYDimension,
      LensMake,
      LensModel,
      DateTimeOriginal,
      ImageWidth,
      ImageLength,
      gyroscope,
      accelerometer,
      exifPitch,
      exifRoll,
      captureWidth,
      captureHeight,
      focalLength,
      focalLength35,
    } = exif;

    try {
      let path = `${RNFS.DocumentDirectoryPath}`;
      if (image.default_storage_path === 'external') {
        const externalPath = await RNFS.getAllExternalFilesDirs()
        path = externalPath[1]
      }
      const fileInfo = await RNFS.stat(`file://${path}/${image.path}`)

      //for back compatibility sometimes PixelXDimension and PixelYDimension are not available but ImageWidth and ImageLength (Height) are
      const horizontal = captureWidth || ImageWidth || PixelXDimension;
      const vertical = captureHeight || ImageLength || PixelYDimension;

      const horizontal_pixel = horizontal > vertical ? horizontal : vertical;
      const vertical_pixel = horizontal < vertical ? horizontal : vertical;

      const horizontal_fov = calculate.fov(horizontal_pixel, vertical_pixel, exif.FocalLength, "horizontal");
      const vertical_fov = calculate.fov(horizontal_pixel, vertical_pixel, exif.FocalLength, "vertical");

      if (image.project_key && image.organization_key) {
        files.options.parameters.summary.Information.organization_key = image.organization_key;
        files.options.parameters.summary.Information.project_key = image.project_key;
      }

      files.options.parameters.json_data.push({
        latitude,
        longitude,
        altitude,
        heading,
        gyroscope,
        accelerometer,
        accuracy_level,
        focalLength,
        focalLength35,
        pitch: exifPitch || calculate.pitch(accelerometer),
        roll: exifRoll || calculate.roll(accelerometer),
        captureTime: dateConvert((DateTime || DateTimeOriginal), 'YYYY-MM-D HH:mm:ss'),
        orientation: Orientation,
        deviceMake: Make || LensMake,
        deviceModel: Model || LensModel,
        imageSize: `${horizontal}x${vertical}`,
        fov: horizontal_fov,
        vfov: vertical_fov,
        sequenceUuid: sequence_uuid,
        filename: fileName,
        yaw: calculate.yaw(accelerometer),
        car_speed: speed * 3.6,
        anomaly: 0,
        capture_address: image.address || null,
      });

      files.options.parameters.summary.Information.total_images = images.length;
      files.options.parameters.summary.Information.sequence_uuid = sequence_uuid;
      files.options.parameters.summary.Information.count = images.length;
      files.options.parameters.summary.Information.size = (filesize += fileInfo.size) / 1024 / 1024;
      files.options.parameters.summary.Information.hash = image.hash;
      files.options.parameters.summary.Information.group_key = image.group_id;

    } catch (e) {
      captureException(e, {
        tags: {
          functionName: 'jsonUpload'
        }
      })
      return {status: 'error', message: throwMessage(e)}
    }
  }

  try {
    const response = await api.post('/api/function/mapilio/imagery/upload', files, {cancelToken: apiController?.token})

    if (response.status) {
      return {status: 'success', message: translate('upload_completed')}
    }

    return {status: 'warning', message: translate('upload_failed') + ' ' + response.message}

  } catch (e) {
    captureException(e,{
      tags: {
        functionName: 'imageryUpload'
      }
    })
    return {status: 'error', message: throwMessage(e)}
  }
}

export const deleteSequence = async (sequence) => {
  const files = await db.getCapturesBySequenceIdAsync(sequence);

  for (const element of files) {
    await db.deleteById(element.id)

    let filePath = `${RNFS.DocumentDirectoryPath}`;
    if (element.default_storage_path === 'external') {
      const externalPath = await RNFS.getAllExternalFilesDirs()
      filePath = externalPath[1]
    }
    const exists = await RNFS.exists(`${filePath}/${element.path}`);
    exists && await RNFS.unlink(`${filePath}/${element.path}`)
  }
}

export const percentage = (partialValue, totalValue) => {
  let number = (100 * partialValue) / totalValue;

  return (number) ? number : 0;
};

export const closeRequest = () => {
  apiController?.cancel()
  cdnController?.cancel()
}

const throwMessage = (error) => {
  if (error.message === "CanceledError: canceled") {
    return translate("you_cancelled_upload")
  }

  if (error.message === "AxiosError: timeout of 10000ms exceeded" || error?.code === 'ECONNABORTED') {
    return translate("timeout", "errors")
  }

  return error?.response?.data?.message || error.message
}
