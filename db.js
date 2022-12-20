import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system";

let db = SQLite.openDatabase(`mapilio.db`);

class Database {
  startDB() {
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
                                uploaded BOOLEAN DEFAULT 0,
                                filename TEXT NOT NULL
                                )`,
        []
      );
    });
  }

  getConnection() {
    return db;
  }

  insertToDB({exif, location, projectKey, organizationName, organizationKey, uuid, path, filename}) {
    db.transaction((txn) => {
      txn.executeSql(
        "INSERT INTO captures (exif, location, project_key, organization_name, organization_key, sequence_uuid, path, filename) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [exif, location, projectKey, organizationName, organizationKey, uuid, path, filename],
        () => null,
        (_, error) => {
          console.log(error);
          toast.show(`An error occurred while shooting, please try again.`, {type: "error"})
        }
      );
    });
  }

  async queryAsync(query) {
    return new Promise((resolve, reject) => {
      db.transaction((txn) => {
        txn.executeSql(
          query,
          [],
          (_, results) => {
            resolve(results.rows._array)
          },
          (error) => {
            reject(error)
          })
      });
    })
  }

  async query(query, callback, args = [], errorCallback = (_, error) => toast.show(`${error}`, {type: "error"})) {
    db.transaction((txn) => {
      txn.executeSql(query, args, callback, errorCallback)
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

  /**
   * getCapturesBySequenceId() is deprecated. You can change getCaptures()
   *
   * @param sequence_uuid
   * @param callback
   * @param errorCallback
   */
  getCapturesBySequenceId(sequence_uuid, callback, errorCallback = (_, error) => toast.show(`${error}`, {type: 'error'})) {
    console.warn('getCapturesBySequenceId() is deprecated. You can change getCaptures()')

    db.transaction((txn) => {
      txn.executeSql(
        `SELECT * FROM captures WHERE sequence_uuid="${sequence_uuid}"`,
        [],
        callback,
        errorCallback
      )
    })
  }

  getGroupByWithColumn(callback) {
    console.warn('getGroupByWithColumn() is deprecated. You can use getGroupByWithSequenceUUID()')

    db.transaction((txn) => {
      txn.executeSql(
        `SELECT *, COUNT(*) as count FROM captures GROUP BY sequence_uuid ORDER BY id DESC`,
        [],
        callback
      )
    })
  }

  getGroupByWithSequenceUUID() {
    return new Promise((resolve, reject) => {
      db.transaction((txn) => {
        txn.executeSql(
          `SELECT *, COUNT(*) as count FROM captures GROUP BY sequence_uuid ORDER BY id DESC`,
          [],
          (_, result) => {
            resolve(result.rows._array)
          },
          (_transaction, error) => {
            reject(error)
          }
        )
      })
    })
  }

  deleteBySequenceId(sequence_uuid, callback, errorCallback = (_, error) => toast.show(`${error}`, {type: 'error'})) {
    db.transaction((txn) => {
      txn.executeSql(
        `DELETE FROM captures where sequence_uuid = '${sequence_uuid}'`,
        [],
        callback,
        errorCallback
      )
    })
  }

  deleteById(id) {
    return new Promise((resolve, reject) => {
      db.transaction(txn => {
        txn.executeSql(`DELETE FROM captures where id='${id}'`, [], (_, results) => {
          resolve(results.rows._array)
        }, (error) => {
          reject(error)
        })
      })
    })
  }

  /**
   * @param uuid {null | string}
   * @returns {Promise}
   */
  getCaptures(uuid = null) {
    const query = uuid ? `SELECT * FROM captures WHERE sequence_uuid='${uuid}'` : `SELECT * FROM captures`;

    return new Promise((resolve, reject) => {
      db.transaction((txn) => {
        txn.executeSql(
          query, [], (_, results) => {
            resolve(results.rows._array)
          },
          (error) => {
            reject(error)
          })
      });
    })
  }
}

const database = new Database();

export default database;
