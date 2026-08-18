import * as SQLite from 'expo-sqlite';
import * as RNFS from './util/fs';

const db = SQLite.openDatabaseSync('mapilio.db');

const ALLOWED_UPDATE_COLUMNS = [
  'exif',
  'location',
  'project_key',
  'organization_name',
  'organization_key',
  'sequence_uuid',
  'path',
  'hash',
  'uploaded',
  'filename',
  'group_id',
  'address',
  'capture_id',
  'default_storage_path',
  'capture_timestamp',
];

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
                                )`
    );
  }

  getConnection() {
    return db;
  }

  /**
   * Check if a column exists in the captures table.
   */
  isColumnExist(columnName) {
    return db.getAllAsync(
      `SELECT count(*) as count FROM pragma_table_info('captures') WHERE name = ?`,
      [columnName]
    );
  }

  /**
   * Add a column to the table if it doesn't exist yet.
   *
   * @param columnName {string} - name of the column to add
   * @param columnType {string} - default: 'TEXT DEFAULT NULL'
   * @param table {string} - default: 'captures'
   */
  async addColumnIfNotExist(columnName, columnType = 'TEXT DEFAULT NULL', table = 'captures') {
    const result = await this.isColumnExist(columnName);
    if (result[0]?.count === 0) {
      db.execAsync(`ALTER TABLE ${table} ADD COLUMN ${columnName} ${columnType}`).catch((error) =>
        console.error(`Error adding column ${columnName} to ${table}:`, error)
      );
    }
  }

  insertToDB({
    exif,
    location,
    projectKey,
    organizationName,
    organizationKey,
    uuid,
    path,
    filename,
    groupId,
    captureID,
    defaultStoragePath,
    captureTimestamp,
  }) {
    return db.runAsync(
      'INSERT INTO captures (exif, location, project_key, organization_name, organization_key, sequence_uuid, path, filename, group_id, capture_id, default_storage_path, capture_timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        exif,
        location,
        projectKey,
        organizationName,
        organizationKey,
        uuid,
        path,
        filename,
        groupId,
        captureID,
        defaultStoragePath,
        captureTimestamp ?? Date.now(),
      ]
    );
  }

  async queryAsync(query) {
    return db.execAsync(query);
  }

  runAsync(sql, params = []) {
    return db.runAsync(sql, params);
  }

  getCapturesBySequenceIdAsync(sequence_uuid, orderBY = 'id ASC', group_id = null) {
    const allowedOrders = ['id ASC', 'id DESC', 'capture_id ASC', 'capture_id DESC'];
    const safeOrder = allowedOrders.includes(orderBY) ? orderBY : 'id ASC';
    const groupFilter = group_id === null || group_id === undefined ? '' : ' AND group_id = ?';
    const params = groupFilter ? [sequence_uuid, group_id] : [sequence_uuid];
    return db.getAllAsync(
      `SELECT * FROM captures WHERE sequence_uuid = ?${groupFilter} ORDER BY ${safeOrder}`,
      params
    );
  }

  async isCaptureIdNull(sequence_uuid) {
    const result = await db.getAllAsync(
      `SELECT * FROM captures WHERE sequence_uuid = ? AND capture_id IS NULL`,
      [sequence_uuid]
    );
    return result.length > 0;
  }

  getGroupByWithSequenceUUID() {
    return db.getAllAsync(
      `SELECT *, COUNT(*) as count FROM captures GROUP BY sequence_uuid ORDER BY id DESC`
    );
  }

  async getGroupByWithGroupID() {
    const results = await db.getAllAsync(
      `SELECT *, COUNT(*) as count FROM captures GROUP BY group_id ORDER BY id DESC`
    );
    const groups = [];
    for (const item of results) {
      if (item.count >= 5) {
        groups.push(item);
      } else {
        let path = RNFS.DocumentDirectoryPath;
        if (item.default_storage_path === 'external') {
          path = await RNFS.getRemovableExternalFilesDir();
          if (!path) continue;
        }
        const groupPath = `${path}/${item.group_id}`;
        try {
          if (await RNFS.exists(groupPath)) await RNFS.unlink(groupPath);
          await this.deleteByGroupID(item.group_id);
        } catch {
          continue;
        }
      }
    }
    return groups;
  }

  /**
   * Delete all captures by group_id
   *
   * @param group_id {string}
   * @param callback {function}
   * @param errorCallback {function}
   */
  deleteByGroupID(group_id, callback, errorCallback) {
    return db
      .runAsync(`DELETE FROM captures WHERE group_id = ?`, [group_id])
      .then(callback)
      .catch(errorCallback);
  }

  deleteById(id) {
    return db.runAsync(`DELETE FROM captures WHERE id = ?`, [id]);
  }

  /**
   * @param uuid {null | string} If uuid is null, get all captures from database
   * @returns {Promise}
   */
  getCaptures(uuid = null) {
    const query = uuid
      ? `SELECT * FROM captures WHERE group_id = ? ORDER BY id ASC`
      : `SELECT * FROM captures`;
    const params = uuid ? [uuid] : [];

    return new Promise((resolve, reject) => {
      db.getAllAsync(query, params)
        .then(async (results) => {
          if (results.length < 5 && results.length > 0) {
            let path = RNFS.DocumentDirectoryPath;
            if (results[0].default_storage_path === 'external') {
              path = await RNFS.getRemovableExternalFilesDir();
              if (!path) return reject('Group has less than 5 images');
            }
            const groupPath = `${path}/${results[0].group_id}`;
            try {
              if (await RNFS.exists(groupPath)) await RNFS.unlink(groupPath);
              await this.deleteByGroupID(results[0].group_id);
            } catch {
              return reject('Group has less than 5 images');
            }
            return reject('Group has less than 5 images');
          }
          resolve(results);
        })
        .catch(reject);
    });
  }

  getCapturesByGroupID(groupId) {
    return db.getAllAsync(`SELECT * FROM captures WHERE group_id = ?`, [groupId]);
  }

  /**
   * Get first capture by group id
   * @param groupId {string}
   * @returns {Promise}
   */
  getFirstWithGroupID(groupId) {
    return db.getFirstAsync(`SELECT * FROM captures WHERE group_id = ? ORDER BY id ASC`, [groupId]);
  }

  /**
   * Get last capture by group id
   * @param groupId
   * @returns {Promise}
   */
  getLastWithGroupID(groupId) {
    return db.getFirstAsync(`SELECT * FROM captures WHERE group_id = ? ORDER BY id DESC`, [
      groupId,
    ]);
  }

  /**
   * Update capture by id
   *
   * @param id {string} Capture id
   * @param data {Object} Data object with whitelisted column keys (e.g. {hash: 'abc123'})
   * @returns {Promise}
   */
  updateById(id, data) {
    const keys = Object.keys(data).filter((key) => ALLOWED_UPDATE_COLUMNS.includes(key));
    if (keys.length === 0) return Promise.reject(new Error('No valid columns to update'));
    const values = keys.map((key) => data[key]);
    const setClause = keys.map((key) => `${key} = ?`).join(', ');
    return db.runAsync(`UPDATE captures SET ${setClause} WHERE id = ?`, [...values, id]);
  }

  /**
   * Delete captures by ids with fileSystem (delete files) and database (delete rows)
   * @param images {Array<{id: string, path: string, default_storage_path?: string}>}
   * @returns {Promise}
   */
  async deleteCapturesByIds(images) {
    const hasExternalFiles = images.some((item) => item.default_storage_path === 'external');
    const externalRoot = hasExternalFiles ? await RNFS.getRemovableExternalFilesDir() : null;
    if (hasExternalFiles && !externalRoot) return;

    for (const item of images) {
      const storageRoot =
        item.default_storage_path === 'external' ? externalRoot : RNFS.DocumentDirectoryPath;
      const filePath = `${storageRoot}/${item.path.replace(/^\//, '')}`;
      if (await RNFS.exists(filePath)) await RNFS.unlink(filePath);
      await this.deleteById(item.id);
    }
  }

  /**
   * Getting total image count
   * @param group_uuid {string|undefined}
   * @returns {Promise<number>}
   */
  getTotalImageCount = async (group_uuid) => {
    const query = group_uuid
      ? `SELECT COUNT(*) as total FROM captures WHERE group_id = ?`
      : `SELECT COUNT(*) as total FROM captures`;
    const params = group_uuid ? [group_uuid] : [];
    const result = await db.getFirstAsync(query, params);
    return result?.total ?? 0;
  };

  /**
   * Getting grouped sequences for upload
   *
   * @param group_uuid {string|undefined}
   * @returns {Promise<{sequences: Array, total: number}>}
   */
  getSequencesForUpload(group_uuid) {
    const query = group_uuid
      ? `SELECT sequence_uuid FROM captures WHERE group_id = ? GROUP BY sequence_uuid ORDER BY id ASC`
      : `SELECT sequence_uuid FROM captures GROUP BY sequence_uuid ORDER BY id ASC`;
    const params = group_uuid ? [group_uuid] : [];

    return new Promise((resolve, reject) => {
      db.getAllAsync(query, params)
        .then(async (results) => {
          const total = await this.getTotalImageCount(group_uuid);
          resolve({ sequences: results, total });
        })
        .catch(reject);
    });
  }
}

const database = new Database();

export default database;
