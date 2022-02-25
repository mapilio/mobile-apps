import * as SQLite from "expo-sqlite";
import { toastGenerator } from "./helper/helper";
import { store } from "./store/store";
import { errorAlertStyles } from "./styles/alertStyles";
import * as FileSystem from "expo-file-system";

const id = store.getState().generalReducer.id;

let db = SQLite.openDatabase(`mapilio-test-${id}.db`);

class Database {
  async startDB(id) {
    db.transaction((txn) => {
      txn.executeSql(
        `CREATE TABLE IF NOT EXISTS captures (
                                id INTEGER PRIMARY KEY AUTOINCREMENT, 
                                exif TEXT NOT NULL, 
                                location TEXT NOT NULL, 
                                project_key TEXT, 
                                organization_name TEXT, 
                                organization_key TEXT,
                                sequence_uuid TEXT NOT NULL, 
                                path TEXT NOT NULL, 
                                hash TEXT DEFAULT NULL,
                                uploaded BOOLEAN DEFAULT 0
                                )`,
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
        "INSERT INTO captures (exif, location, project_key, organization_name, organization_key, sequence_uuid, path) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          values.JSONExif,
          values.JSONLocation,
          values.projectKey,
          values.organizationName,
          values.organizationKey,
          values.uuid,
          values.path,
        ],
        (txn, rs) => null,
        (_, error) => {
          console.log(error);
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
          return;
        },
        (_, error) => {
          toastGenerator(
            "An error occurred while shooting, please try again.",
            require("./assets/images/Info.png"),
            errorAlertStyles.alertContainer,
            errorAlertStyles.alertTitle,
            errorAlertStyles.alertImage
          );
          console.log(error);

          if (userID) {
            this.startDB(userID);
          }
        }
      );
    });
  }

  async query(query, callback, args = []) {
    this.startDB(id);
    db.transaction((txn) => {
      txn.executeSql(query, args, callback, (_, error) => {
        toastGenerator(
          "Something went wrong.",
          require("./assets/images/Info.png"),
          errorAlertStyles.alertContainer,
          errorAlertStyles.alertTitle,
          errorAlertStyles.alertImage
        );
        console.log(error);
      });
    });
  }

  deleteRow(sequenceUUID) {
    console.log("HAHA");
    db.transaction((txn) => {
      txn.executeSql(
        `DELETE FROM captures WHERE sequence_uuid = '${sequenceUUID}'`,
        () => {
          FileSystem.deleteAsync(
            FileSystem.documentDirectory + `${id}/${sequenceUUID}`
          );
        }
      );
    });
  }
}

const database = new Database();

export default database;
