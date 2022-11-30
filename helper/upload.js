import {store} from "../store/store";
import {Alert} from "react-native";
import db from "../db";
import * as FileSystem from "expo-file-system";
import {dateConvert, fetchHandler} from "./helper";
import Config from "react-native-config";
import {calculate} from "./calculator";
import md5 from "md5";
let controller = {};

const isWifi = () => {
  const {connection} = store.getState().generalReducer
  const {uploadData} = store.getState().uploadReducer

  return new Promise((resolve, reject) => {
    if (uploadData.length && connection.connectionType === 'wifi') {
      resolve({status: 'success'})
    } else {
      Alert.alert(
        'Are you sure?',
        'Are you sure you want to send via cellular data?',
        [
          {text: 'Yes', onPress: () => resolve({status: 'success'})},
          {text: 'No', onPress: () => reject({status: 'canceled'})}
        ]
      )
    }
  })
}

const sequenceFilter = (sequence_uuid = null) => {
  const {uploadData} = store.getState().uploadReducer

  return new Promise((resolve, reject) => {
    let sequences = [];

    if (sequence_uuid) {
      try {
        sequences.push(uploadData.find(data => data.sequence_uuid === sequence_uuid).sequence_uuid)
        resolve({status: 'success', data: sequences})
      } catch (e) {
        reject({status: 'error', message: 'Sequence Not Found.'})
      }
    } else {
      sequences = uploadData.map(data => data.sequence_uuid)
      resolve({status: 'success', data: sequences})
    }
  })
}

const getImageCount = (sequences) => {
  return new Promise(resolve => {
    db.queryAsync(`SELECT COUNT(*) as count FROM captures WHERE sequence_uuid IN ('${sequences.join("', '")}')`).then(data => {
      resolve(data[0].count)
    })
  })
}

export const calculateToSequence = (sequence_uuid = null) => {
  return new Promise((resolve, reject) => {
    isWifi().then(() => {
      sequenceFilter(sequence_uuid).then(({data: sequences}) => {
        getImageCount(sequences).then((count) => {
          resolve({status: 'success', data: {count, sequences}})
        })
      })
    }).catch((e) => reject(e))
  });
}

export const getImagesBySequence = (sequence) => {
  return new Promise((resolve) => {
    db.queryAsync(`SELECT * FROM captures WHERE sequence_uuid='${sequence}'`).then((response) => {
      resolve(response)
    })
  })
}

export const getHash = (image) => {
  return new Promise((resolve, reject) => {
    controller = new AbortController();

    if (image.hash) {
      resolve({status: 'success', hash: image.hash})
    }

    const {userInformation} = store.getState().getTokenReducer

    const fileName = image.path.split("/").pop();
    const filePath = FileSystem.documentDirectory + `${userInformation.id}/${image.sequence_uuid}/${fileName}`;

    FileSystem.getInfoAsync(filePath).then(() => {
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
        data: formData,
        signal: controller.signal
      }).then(async (response) => {
        await db.queryAsync(`UPDATE captures SET uploaded=1, hash='${response.files[0].hash}' WHERE path='${image.path}' AND sequence_uuid='${image.sequence_uuid}'`)
        resolve({status: 'success', hash: response.files[0].hash})
      }).catch((err) => {
        reject(err)
      })
    }).catch((err) => reject(err))
  })
}

export const imageryUpload = (index, pictures) => {
  return new Promise((resolve, reject) => {
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

    pictures[index].forEach((picture, i) => {
      const location = JSON.parse(picture.location)
      const exif = JSON.parse(picture.exif);
      const fileName = picture.path.split("/").pop();
      const filePath = FileSystem.documentDirectory + `${userInformation.id}/${picture.sequence_uuid}/${fileName}`;

      FileSystem.getInfoAsync(filePath).then((fileInfo) => {
        const horizontal = exif.ImageWidth || exif.PixelXDimension;
        const vertical = exif.ImageLength || exif.PixelYDimension;

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
          latitude: location.latitude,
          longitude: location.longitude,
          captureTime: dateConvert((exif.DateTime || exif.DateTimeOriginal), 'YYYY-MM-D HH:mm'),
          altitude: location.altitude,
          heading: location.heading,
          orientation: exif.Orientation,
          deviceMake: exif.Make || exif.LensMake,
          deviceModel: exif.Model || exif.LensModel,
          imageSize: `${exif.ImageWidth || exif.PixelXDimension}x${exif.ImageLength || exif.PixelYDimension}`,
          fov: fov,
          sequenceUuid: picture.sequence_uuid,
          photoUuid: md5(userInformation.email + (exif.DateTime || exif.DateTimeOriginal)),
          filename: fileName,
          roll: calculate.roll(exif.accelerometer),
          yaw: calculate.yaw(exif.accelerometer),
          pitch: calculate.pitch(exif.accelerometer),
          car_speed: location.speed * 3.6,
          gyroscope: exif.gyroscope,
          acceleration: exif.accelerometer,
          anomaly: 0,
        });

        files.options.parameters.summary.Information.total_images = pictures[index].length;
        files.options.parameters.summary.Information.sequence_uuid = picture.sequence_uuid;
        files.options.parameters.summary.Information.count = pictures[index].length;
        files.options.parameters.summary.Information.size = (filesize += fileInfo.size) / 1024 / 1024;
        files.options.parameters.summary.Information.hash = pictures.hash;

        if(i === pictures[index].length - 1) {
          fetchHandler({
            url: `${Config.SERVICE_URL}/api/function/mapilio/imagery/upload`,
            method: "POST",
            data: files,
            signal: controller.signal
          }).then((res) => {
            if (res.status === true) {
              deleteSequence(picture.sequence_uuid).then(() => {
                resolve()
              })
            } else {
              reject()
            }
          }).catch((err) => {
            reject(err)
          })
        }
      })
    })
  })
}

const deleteSequence = (sequence) => {
  return new Promise(async(resolve) => {
    const {userInformation} = store.getState().getTokenReducer
    await FileSystem.deleteAsync(FileSystem.documentDirectory + `${userInformation.id}/${sequence}`)
    await db.queryAsync(`DELETE FROM captures WHERE sequence_uuid='${sequence}'`)
    resolve()
  });
};

export const percentage = (partialValue, totalValue) => {
  let number = (100 * partialValue) / totalValue;

  return (number) ? number / 100 : 0;
};

export const closeRequest = () => {
  controller.abort()
}
