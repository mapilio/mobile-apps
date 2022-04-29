import * as SQLite from "expo-sqlite";
import { store } from "./store/store";
import * as FileSystem from "expo-file-system";
import {errorToastMessage} from "./helper/alerts";

const id = store.getState().generalReducer.id;

let db = SQLite.openDatabase(`mapilio-test-${id}.db`);

class Database {
  async startDB() {
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
        () => null,
        (_, error) => {
          console.log(error);
          errorToastMessage("An error occurred while shooting, please try again.")
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
        () => {},
        (_, error) => {
          errorToastMessage("An error occurred while shooting, please try again.")
          console.log(error);

          if (userID) {
            this.startDB(userID);
          }
        }
      );
    });
  }

  async query(query, callback, args = []) {
    db.transaction((txn) => {
      txn.executeSql(query, args, callback, () => {
        errorToastMessage("Something went wrong.")
      });
    });
  }

  deleteRow(sequenceUUID) {
    db.transaction((txn) => {
      txn.executeSql(
        `DELETE FROM captures WHERE sequence_uuid = '${sequenceUUID}'`,
        async () => {
          await FileSystem.deleteAsync(
            FileSystem.documentDirectory + `${id}/${sequenceUUID}`
          );
        }
      );
    });
  }

  getGroupByWithColumn(callback) {
    db.transaction((txn) => {
      txn.executeSql(
        `SELECT *, COUNT(*) as count FROM captures GROUP BY sequence_uuid ORDER BY id DESC`,
        [],
        callback
      )
    })
  }

  deleteBySequenceId(sequence_uuid, callback) {
    db.transaction((txn) => {
      txn.executeSql(
        `DELETE FROM captures where sequence_uuid = '${sequence_uuid}'`,
        [],
        callback
      )
    })
  }
}

const database = new Database();

export default database;
