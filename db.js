import * as SQLite from "expo-sqlite";
import * as RNFS from 'react-native-fs';

const db = SQLite.openDatabaseSync("mapilio.db");

class Database {
  startDB() {
    return db.execAsync(
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
                                filename TEXT NOT NULL,
                                group_id TEXT DEFAULT NULL,
                                address TEXT DEFAULT NULL,
                                capture_id INTEGER DEFAULT NULL,
                                default_storage_path TEXT DEFAULT NULL
                                )`,
    );
  }

  getConnection() {
    return db;
  }

  /**
   * if the column doesn't exist, add it to the table
   */
  isColumnExist(columnName) {
    return new Promise((resolve, reject) => {
        db.getAllAsync(`SELECT count(*) as count FROM pragma_table_info('captures') where name='${columnName}'`)
          .then((result) => resolve(result))
          .catch((error) => reject(error))
    })
  }

  /**
   * add column to the table if it doesn't exist yet
   *
   * @param columnName {string} - name of the column to add to the table
   * @param columnType {string} - default: 'TEXT' - type of the column
   * @param table {string} - default: 'captures' table name (optional) - if you want to add column to another table
   *
   * @example
   * addColumnIfNotExist('hash', 'TEXT', 'captures')
   */
  async addColumnIfNotExist(columnName, columnType = 'TEXT DEFAULT NULL', table = 'captures') {
    const isExist = await this.isColumnExist(columnName);

    if (!isExist) {
      db.execAsync(`ALTER TABLE ${table} ADD COLUMN ${columnName} ${columnType}`)
        .then(() => console.log(`Column ${columnName} added to the table ${table}`))
        .catch((error) => console.log(`Error while adding column ${columnName} to the table ${table}: ${error}`))
    }
  }

  insertToDB({exif, location, projectKey, organizationName, organizationKey, uuid, path, filename, groupId, captureID, defaultStoragePath}) {
    return db.runAsync(
      'INSERT INTO captures (exif, location, project_key, organization_name, organization_key, sequence_uuid, path, filename, group_id, capture_id, default_storage_path) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [exif, location, projectKey, organizationName, organizationKey, uuid, path, filename, groupId, captureID, defaultStoragePath],
    );
  }

  async queryAsync(query) {
    return new Promise((resolve, reject) => {
        db.execAsync(query)
          .then((result) => resolve(result))
          .catch((error) => reject(error))
      });
  }

  // async query(query, callback, args = [], errorCallback = (_, error) => toast.show(`${error}`, {type: "error"})) {
  //   db.transaction((txn) => {
  //     txn.executeSql(query, args, callback, errorCallback)
  //   });
  // }


  getCapturesBySequenceIdAsync(sequence_uuid, orderBY = 'id ASC') {
    return new Promise((resolve, reject) => {
      db.getAllAsync(`SELECT * FROM captures WHERE sequence_uuid="${sequence_uuid}" ORDER BY ${orderBY}`)
        .then((result) => {
          resolve(result)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  //check if the capture_id of the sequence_uuid is null for all rows
  async isCaptureIdNull(sequence_uuid) {
    const result = await db.getAllAsync(`SELECT * FROM captures WHERE sequence_uuid="${sequence_uuid}" AND capture_id IS NULL`)
    return result.length > 0
  }

  getGroupByWithSequenceUUID() {
    return new Promise((resolve, reject) => {
        db.getAllAsync(`SELECT *, COUNT(*) as count FROM captures GROUP BY sequence_uuid ORDER BY id DESC`)
          .then((result) => resolve(result))
          .catch((error) => reject(error))
      })
  }

  getGroupByWithGroupID() {
    return new Promise((resolve, reject) => {
      db.getAllAsync(`SELECT *, COUNT(*) as count FROM captures GROUP BY group_id ORDER BY id DESC`)
        .then((results) => {
          const groups = results.filter((item) => {
            if (item.count >= 5) {
              return item
            }

            // Delete group if it has less than 5 images
            this.deleteByGroupID(item.group_id)
            let path =  RNFS.DocumentDirectoryPath
            if (item.default_storage_path === 'external') {
              RNFS.getAllExternalFilesDirs().then((dirs) => {
                path = dirs[1]
              })
            }
            RNFS.unlink(path + `/${item.group_id}`)
          })
          resolve(groups)
        })
        .catch((error) => reject(error))
    })
  }

  /**
   * Delete all captures by group_id
   *
   * @param group_id {string}
   * @param callback {function}
   * @param errorCallback {function}
   */
  deleteByGroupID(group_id, callback, errorCallback = (_, error) => toast.show(`${error}`, {type: 'error'})) {
    db.runAsync(`DELETE FROM captures where group_id = '${group_id}'`)
      .then(callback)
      .catch(errorCallback)
  }

  deleteById(id) {
    return new Promise((resolve, reject) => {
      db.runAsync(`DELETE FROM captures where id='${id}'`)
        .then(resolve)
        .catch(reject)
    })
  }

  /**
   * @param uuid {null | string} If uuid is null, get all captures from database
   * @returns {Promise}
   */
  getCaptures(uuid = null) {
    const query = uuid ? `SELECT * FROM captures WHERE group_id='${uuid}' ORDER BY id ASC` : `SELECT * FROM captures`;

    return new Promise((resolve, reject) => {
      db.getAllAsync(query)
        .then((results) => {
          if (results.length < 5 && results.length > 0) {
            this.deleteByGroupID(results[0].group_id, async () => {
              let path = `${RNFS.DocumentDirectoryPath}`
              if (results[0].default_storage_path === 'external') {
                const externalPath = await RNFS.getAllExternalFilesDirs()
                path = externalPath[1]
              }
              await RNFS.unlink(path + `${results[0].group_id}`)
            })
            reject('Group has less than 5 images')
          }
          resolve(results)
        })
        .catch((error) => reject(error))
    })
  }

  getCapturesByGroupID(groupId) {
    return db.getAllAsync(`SELECT * FROM captures WHERE group_id='${groupId}'`)
  }

  /**
   * Get first capture by group id
   * @param groupId {string}
   * @returns {Promise<unknown>}
   */
  getFirstWithGroupID(groupId) {
    return new Promise((resolve, reject) => {
      db.getFirstAsync(`SELECT * FROM captures WHERE group_id='${groupId}' ORDER BY id ASC`)
        .then((result) => resolve(result))
        .catch((error) => reject(error));
    });
  }

  /**
   * Get last capture by group id
   * @param groupId
   * @returns {Promise<unknown>}
   */
  getLastWithGroupID(groupId) {
    return new Promise((resolve, reject) => {
      db.getFirstAsync(`SELECT * FROM captures WHERE group_id='${groupId}' ORDER BY id DESC`)
        .then((result) => resolve(result))
        .catch((error) => reject(error));
    });
  }

  /**
   * Update capture by id
   *
   * @param id {string} Capture id
   * @param data {Object} Data object (key-value) (e.g. {name: 'test'})
   * @returns {Promise} Promise with updated capture data (array) or error (object)
   *
   */
  updateById(id, data) {
    return new Promise((resolve, reject) => {
      db.runAsync(`UPDATE captures SET ${Object.keys(data).map(key => `${key}='${data[key]}'`).join(',')} WHERE id='${id}'`)
        .then(() => resolve())
        .catch((error) => reject(error));
    });
  }

  /**
   * Delete captures by ids with fileSystem (delete files) and database (delete rows) (async) (promise)
   * @param images {Array<{id: string, path: string}>} Array of images (id and path) to delete (e.g. [{id: '1', path: 'test.jpg'}]) (path is relative to documentDirectory)
   * @returns {Promise} Promise with deleted rows (array) or error (object)
   */
  deleteCapturesByIds(images) {
    return new Promise((resolve, reject) => {
      db.runAsync(`DELETE FROM captures WHERE id IN (${images.map(({id}) => `'${id}'`).join(',')})`)
        .then(() => {
          images.forEach((item) => {
            let path = `${RNFS.DocumentDirectoryPath}}`;
            if (item.default_storage_path === 'external') {
              RNFS.getAllExternalFilesDirs().then((dirs) => {
                path = dirs[1];
              });
            }
            RNFS.unlink(path + item.path);
          });
        })
        .catch((error) => reject(error));
    });
  }

  /**
   * Getting total image count
   * @param group_uuid {string} Group uuid (optional)
   * @returns {Promise<Promise<Array|Object> | Promise>} Promise with total image count (number) or error (object)
   */
  getTotalImageCount = async (group_uuid) => {
    return new Promise((resolve, reject) => {
      db.getAllAsync(`SELECT COUNT(*) FROM captures ${group_uuid ? 'WHERE group_id="' + group_uuid + '"' : ''}`)
        .then((results) => {
          resolve(results[0]['COUNT(*)']);
        })
        .catch((error) => reject(error));
    });
  }

  /**
   * Getting grouped sequences for upload (promise) (async)
   *
   * @param group_uuid {string|null} Group uuid to get sequences for upload (optional)
   * @returns {Promise<Array|Object> | Promise} Promise with sequences for upload (array) or error (object)
   */
  getSequencesForUpload(group_uuid) {
    return new Promise((resolve, reject) => {
        db.getAllAsync(`SELECT sequence_uuid FROM captures ${group_uuid ? 'WHERE group_id="' + group_uuid + '"' : ''} GROUP BY sequence_uuid ORDER BY id ASC`)
          .then(async (results) => {
            const total = await this.getTotalImageCount(group_uuid)
            resolve({sequences: results, total})
          })
          .catch((error) => reject(error))
      });
  }
}

const database = new Database();

export default database;
