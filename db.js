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
                                filename TEXT NOT NULL,
                                group_id TEXT DEFAULT NULL,
                                address TEXT DEFAULT NULL
                                )`,
        []
      );
    });
  }

  getConnection() {
    return db;
  }

  /**
   * if the column doesn't exist, add it to the table
   */
  isColumnExist(columnName) {
    return new Promise((resolve, reject) => {
      db.transaction((txn) => {
        txn.executeSql(`SELECT count(*) as count FROM pragma_table_info('captures') where name='${columnName}'`,
          [],
          (_, results) => {
            resolve(!!results.rows._array[0].count)
          },
          (error) => {
            reject(error)
          }
        );
      });
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
  addColumnIfNotExist(columnName, columnType = 'TEXT DEFAULT NULL', table = 'captures') {
    db.transaction((txn) => {
      this.isColumnExist(columnName).then((isExist) => {
        !isExist && txn.executeSql(`ALTER TABLE ${table} ADD COLUMN ${columnName} ${columnType}`, [])
      });
    });
  }

  insertToDB({exif, location, projectKey, organizationName, organizationKey, uuid, path, filename, groupId, address}) {
    db.transaction((txn) => {
      txn.executeSql(
        "INSERT INTO captures (exif, location, project_key, organization_name, organization_key, sequence_uuid, path, filename, group_id, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [exif, location, projectKey, organizationName, organizationKey, uuid, path, filename, groupId, address],
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
   * @deprecated Use getCapturesBySequenceIdAsync() instead
   *
   * @param sequence_uuid {string} - sequence_uuid
   * @param callback {function}
   * @param errorCallback {function}
   */
  getCapturesBySequenceId(sequence_uuid, callback, errorCallback = (_, error) => toast.show(`${error}`, {type: 'error'})) {
    db.transaction((txn) => {
      txn.executeSql(
        `SELECT * FROM captures WHERE sequence_uuid="${sequence_uuid}"`,
        [],
        callback,
        errorCallback
      )
    })
  }

  getCapturesBySequenceIdAsync(sequence_uuid) {
    return new Promise((resolve, reject) => {
      db.transaction((txn) => {
        txn.executeSql(
          `SELECT * FROM captures WHERE sequence_uuid="${sequence_uuid}"`,
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

  getGroupByWithGroupID() {
    return new Promise((resolve, reject) => {
      db.transaction((txn) => {
        txn.executeSql(
          `SELECT *, COUNT(*) as count FROM captures GROUP BY group_id ORDER BY id DESC`,
          [],
          (_, result) => {
            const groups = result.rows._array.filter((item) => {
              if (item.count >= 5) {
                return item
              }

              // Delete group if it has less than 5 images
              this.deleteByGroupID(item.group_id)
              FileSystem.deleteAsync(FileSystem.documentDirectory + `${item.group_id}`)
            })

            resolve(groups)
          },
          (_transaction, error) => {
            reject(error)
          }
        )
      })
    })
  }

  /**
   * @deprecated Use deleteBySequenceIdAsync() instead
   *
   * @param sequence_uuid {string}
   * @param callback {function}
   * @param errorCallback {function}
   */
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

  /**
   * Delete all captures by sequence_uuid
   *
   * @param sequence_uuid {string} (unique id)
   * @returns {Promise<unknown>}
   */
  deleteBySequenceIdAsync(sequence_uuid) {
    return new Promise((resolve, reject) => {
      db.transaction((txn) => {
        txn.executeSql(
          `DELETE FROM captures where sequence_uuid = '${sequence_uuid}'`,
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

  /**
   * Delete all captures by group_id
   *
   * @param group_id {string}
   * @param callback {function}
   * @param errorCallback {function}
   */
  deleteByGroupID(group_id, callback, errorCallback = (_, error) => toast.show(`${error}`, {type: 'error'})) {
    db.transaction((txn) => {
      txn.executeSql(
        `DELETE FROM captures where group_id = '${group_id}'`,
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
   * @param uuid {null | string} If uuid is null, get all captures from database
   * @returns {Promise}
   */
  getCaptures(uuid = null) {
    const query = uuid ? `SELECT * FROM captures WHERE group_id='${uuid}' ORDER BY id ASC` : `SELECT * FROM captures`;

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

  /**
   * Get captures by group id
   *
   * @param groupId {string}
   * @returns {Promise<Array>}
   */
  getCapturesByGroupID(groupId) {
    return new Promise((resolve, reject) => {
      db.transaction((txn) => {
        txn.executeSql(
          `SELECT * FROM captures WHERE group_id='${groupId}'`, [], (_, results) => {
            resolve(results.rows._array)
          },
          (error) => {
            reject(error)
          })
      });
    })
  }

  /**
   * Get first capture by group id
   * @param groupId {string}
   * @returns {Promise<unknown>}
   */
  getFirstWithGroupID(groupId) {
    return new Promise((resolve, reject) => {
      db.transaction((txn) => {
        txn.executeSql(
          `SELECT * FROM captures WHERE group_id='${groupId}' ORDER BY id ASC LIMIT 1`, [], (_, results) => {
            resolve(results.rows._array[0])
          },
          (error) => {
            reject(error)
          })
      });
    })
  }

  /**
   * Get last capture by group id
   * @param groupId
   * @returns {Promise<unknown>}
   */
  getLastWithGroupID(groupId) {
    return new Promise((resolve, reject) => {
      db.transaction((txn) => {
        txn.executeSql(
          `SELECT * FROM captures WHERE group_id='${groupId}' ORDER BY id DESC LIMIT 1`, [], (_, results) => {
            resolve(results.rows._array[0])
          },
          (error) => {
            reject(error)
          })
      });
    })
  }

  /**
   * Get captures by group ids (array)
   * @param ids {Array<string>}
   */
  getCapturesWithIDs(ids) {
    return new Promise((resolve, reject) => {
      db.transaction((txn) => {
        txn.executeSql(
          `SELECT * FROM captures WHERE group_id IN (${ids.map(id => `'${id}'`).join(',')})`, [], (_, results) => {
            resolve(results.rows._array)
          },
          (error) => {
            reject(error)
          })
      });
    })
  }

  getSequencesWithGroups(groupIDs) {
    return new Promise((resolve, reject) => {
      db.transaction((txn) => {
        txn.executeSql(
          `SELECT sequence_uuid FROM captures WHERE group_id IN (${groupIDs.map(id => `'${id}'`).join(',')}) GROUP BY sequence_uuid`, [], (_, results) => {
            resolve(results.rows._array.map(row => row.sequence_uuid))
          },
          (error) => {
            reject(error)
          })
      });
    })
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
      db.transaction(txn => {
        txn.executeSql(`UPDATE captures SET ${Object.keys(data).map(key => `${key}='${data[key]}'`).join(',')} WHERE id='${id}'`, [], (_, results) => {
          resolve(results.rows._array)
        }, (error) => {
          reject(error)
        })
      })
    })
  }

  /**
   * Delete captures by ids with fileSystem (delete files) and database (delete rows) (async) (promise)
   * @param images {Array<string>} Array of image ids (uuid) (e.g. ['uuid1', 'uuid2'])
   * @returns {Promise<unknown>}
   */
  deleteCapturesByIds(images) {
    return new Promise((resolve, reject) => {
      db.transaction(txn => {
        txn.executeSql(`DELETE FROM captures WHERE id IN (${images.map(({id}) => `'${id}'`).join(',')})`, [], (_, results) => {
          images.forEach(({path}) => FileSystem.deleteAsync(FileSystem.documentDirectory + path))
          resolve(results.rows._array)
        }, (error) => {
          reject(error)
        })
      })
    })
  }
}

const database = new Database();

export default database;
