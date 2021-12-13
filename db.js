import * as SQLite from "expo-sqlite";
import { toastGenerator } from "./helper/helper";
import { UPDATE_CURRENT_DB } from "./store/actionsName";
import { store } from "./store/store";
import { errorAlertStyles } from "./styles/alertStyles";
const id = store.getState().generalReducer.id;

let db = SQLite.openDatabase(`mapilio-test-${id}.db`);

class Database {
  async startDB(id) {
    store.dispatch({ type: UPDATE_CURRENT_DB, payload: db });
    db.transaction((txn) => {
      txn.executeSql(
        "CREATE TABLE IF NOT EXISTS captures (id INTEGER PRIMARY KEY AUTOINCREMENT, exif TEXT NOT NULL, location TEXT NOT NULL, project_key TEXT, organization_name TEXT, sequence_uuid TEXT NOT NULL)",
        []
      );
    });
  }

  getConnection() {
    return db;
  }

  insertToDB(values) {
    db.transaction((txn) => {
      txn.executeSql(
        "INSERT INTO captures (exif, location, project_key, organization_name, sequence_uuid) VALUES (?, ?, ?, ?, ?)",
        [
          values.JSONExif,
          values.JSONLocation,
          values.projectKey,
          values.organizationName,
          values.uuid,
        ],
        (txn, rs) => null,
        (_, error) => {
          toastGenerator(
            "An error occurred while shooting, please try again.",
            require("./assets/images/Info.png"),
            errorAlertStyles.alertContainer,
            errorAlertStyles.alertTitle,
            errorAlertStyles.alertImage
          );
          this.startDB(values.userID);
        }
      );
    });
  }

  getDB(userID) {
    return db.transaction((txn) => {
      txn.executeSql(
        "SELECT * FROM captures",
        [],
        (_, result) => {
          // TODO Muammer
        },
        (_, error) => {
          toastGenerator(
            "An error occurred while shooting, please try again.",
            require("./assets/images/Info.png"),
            errorAlertStyles.alertContainer,
            errorAlertStyles.alertTitle,
            errorAlertStyles.alertImage
          );
          this.startDB(userID);
        }
      );
    });
  }
}

const database = new Database();

export default database;
