import * as SQLite from "expo-sqlite";
import {toastGenerator} from "./helper/helper";
import {store} from "./store/store";
import {errorAlertStyles} from "./styles/alertStyles";

const id = store.getState().generalReducer.id;

let db = SQLite.openDatabase(`mapilio-test-${id}.db`);

class Database {
    async startDB(id) {
        db.transaction((txn) => {
            txn.executeSql(
                "CREATE TABLE IF NOT EXISTS captures (id INTEGER PRIMARY KEY AUTOINCREMENT, exif TEXT NOT NULL, location TEXT NOT NULL, project_key TEXT, organization_name TEXT, sequence_uuid TEXT NOT NULL, path TEXT NOT NULL)",
                []
            );
            txn.executeSql(
              `CREATE TABLE IF NOT EXISTS uploads (
                               id INTEGER PRIMARY KEY AUTOINCREMENT,
                               filepath TEXT NOT NULL,
                               filesize INTEGER NOT NULL,
                               filename INTEGER NOT NULL,
                               file_resolution TEXT NOT NULL,
                               sequence_uuid TEXT NOT NULL,
                               latitude TEXT NOT NULL,
                               longitude TEXT NOT NULL,
                               altitude TEXT NOT NULL,
                               heading TEXT NOT NULL,
                               orientation TEXT NOT NULL,
                               make TEXT NOT NULL,
                               model TEXT NOT NULL,
                               photo_uuid TEXT NOT NULL,
                               capture_time DATETIME NOT NULL,
                               hash TEXT NOT NULL,
                               fov TEXT NOT NULL);`
            )
        });
    }

    getConnection() {
        return db;
    }

    insertToDB(values) {
        db.transaction((txn) => {
            txn.executeSql(
                "INSERT INTO captures (exif, location, project_key, organization_name, sequence_uuid, path) VALUES (?, ?, ?, ?, ?, ?)",
                [
                    values.JSONExif,
                    values.JSONLocation,
                    values.projectKey,
                    values.organizationName,
                    values.uuid,
                    values.path
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
                    console.log(error)

                    if (userID) {
                        this.startDB(userID);
                    }
                }
            );
        });
    }

    async query(query, callback, args = []) {
        await db.transaction((txn) => {
            txn.executeSql(query, args, callback, (_, error) => {
                toastGenerator(
                  "Something went wrong.",
                  require("./assets/images/Info.png"),
                  errorAlertStyles.alertContainer,
                  errorAlertStyles.alertTitle,
                  errorAlertStyles.alertImage
                );
                console.log(error)
            });
        });

        await this.startDB(id)
    }
}

const database = new Database();

export default database;
