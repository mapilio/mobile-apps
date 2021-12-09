import * as Font from "expo-font";
import { store } from "../store/store";
import { Notifier, NotifierComponents } from "react-native-notifier";
import axios from "axios";
import * as FileSystem from "expo-file-system";
import { Platform, StatusBar } from "react-native";
import { UPDATE_CURRENT_DB } from "../store/actionsName";
import Database from "../db";

const useFonts = async () =>
  await Font.loadAsync({
    Poppins: require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
  });

const convertHexToRGBA = (hexCode, opacity) => {
  let hex = hexCode.replace("#", "");

  if (hex.length === 3) {
    hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
  }

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return `rgba(${r},${g},${b},${opacity / 100})`;
};

const fetchHandler = ({ ...args } = {}) => {
  const auth = store.getState().getTokenReducer.auth;
  auth &&
    (axios.defaults.headers.common["Authorization"] = `Bearer ${auth.token}`);

  return axios(args).then((response) => response.data);
};

const toastGenerator = (
  title,
  image,
  containerStyle,
  titleStyle,
  imageStyle,
  duration = 0
) =>
  Notifier.showNotification({
    title: title,
    Component: NotifierComponents.Notification,
    swipeEnabled: true,
    duration: duration,
    translucentStatusBar: StatusBar.currentHeight,
    componentProps: {
      //Todo xd export alert images with low quality.
      imageSource: image,
      imageStyle: imageStyle,
      titleStyle: titleStyle,
      containerStyle: containerStyle,
    },
  });

const maxCharacterHandler = (text, maxLength) => {
  if (text.length > maxLength) text = text.substring(0, maxLength) + "...";
  return text;
};

const startDB = async (id) => {
  const db = Database.getConnection();
  console.log("RUN");

  const sqliteDirectory = `${FileSystem.documentDirectory}SQLite/mapilio-test-${id}.db`;
  const { exists, isDirectory } = await FileSystem.getInfoAsync(
    sqliteDirectory
  );

  store.dispatch({ type: UPDATE_CURRENT_DB, payload: db });
  db.transaction((txn) => {
    txn.executeSql(
      "CREATE TABLE IF NOT EXISTS captures (id INTEGER PRIMARY KEY AUTOINCREMENT, exif TEXT NOT NULL, location TEXT NOT NULL, project_key TEXT, organization_name TEXT, sequence_uuid TEXT NOT NULL)",
      [],
      (txn, rs) => {
        // Todo something
      },
      (_, error) => {
        console.log(error, 33);
      }
    );
  });
};

export {
  useFonts,
  convertHexToRGBA,
  fetchHandler,
  toastGenerator,
  maxCharacterHandler,
  startDB,
};
