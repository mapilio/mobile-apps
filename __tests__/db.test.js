jest.mock('expo-sqlite', () => ({
  openDatabaseSync: jest.fn(() => ({
    execAsync: jest.fn(),
    getAllAsync: jest.fn(),
    getFirstAsync: jest.fn(),
    runAsync: jest.fn(),
  })),
}));

jest.mock('../util/fs', () => ({
  DocumentDirectoryPath: '/internal',
  getRemovableExternalFilesDir: jest.fn(),
  exists: jest.fn(),
  unlink: jest.fn(),
}));

import database from '../db';
import * as RNFS from '../util/fs';

const sqliteDatabase = database.getConnection();

describe('deleteCapturesByIds', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sqliteDatabase.runAsync.mockResolvedValue(undefined);
    RNFS.getRemovableExternalFilesDir.mockResolvedValue('/removable');
    RNFS.exists.mockResolvedValue(true);
  });

  it('deletes only metadata paired with successful file cleanup', async () => {
    RNFS.unlink
      .mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce(new Error('second delete failed'));

    await expect(
      database.deleteCapturesByIds([
        { id: 1, path: 'group/first.jpg', default_storage_path: 'external' },
        { id: 2, path: 'group/second.jpg', default_storage_path: 'external' },
      ])
    ).rejects.toThrow('second delete failed');

    expect(RNFS.getRemovableExternalFilesDir).toHaveBeenCalledTimes(1);
    expect(RNFS.unlink).toHaveBeenNthCalledWith(1, '/removable/group/first.jpg');
    expect(RNFS.unlink).toHaveBeenNthCalledWith(2, '/removable/group/second.jpg');
    expect(sqliteDatabase.runAsync).toHaveBeenCalledTimes(1);
    expect(sqliteDatabase.runAsync).toHaveBeenCalledWith('DELETE FROM captures WHERE id = ?', [1]);
    expect(RNFS.getRemovableExternalFilesDir.mock.invocationCallOrder[0]).toBeLessThan(
      RNFS.unlink.mock.invocationCallOrder[0]
    );
  });
});
