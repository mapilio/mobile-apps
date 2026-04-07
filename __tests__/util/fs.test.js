// Mock expo-file-system before importing the adapter
jest.mock('expo-file-system', () => ({
  documentDirectory: 'file:///data/user/0/com.mapilio/files/',
  getInfoAsync: jest.fn(),
  deleteAsync: jest.fn(),
  makeDirectoryAsync: jest.fn(),
  moveAsync: jest.fn(),
  getFreeDiskStorageAsync: jest.fn(),
  getTotalDiskCapacityAsync: jest.fn(),
}));

// Mock react-native-fs (used only for getAllExternalFilesDirs)
jest.mock('react-native-fs', () => ({
  getAllExternalFilesDirs: jest.fn(),
}));

import * as FileSystem from 'expo-file-system';
import * as RNFS from 'react-native-fs';
import * as fs from '../../util/fs';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('DocumentDirectoryPath', () => {
  it('strips the file:// prefix', () => {
    expect(fs.DocumentDirectoryPath).not.toMatch(/^file:\/\//);
  });

  it('strips the trailing slash', () => {
    expect(fs.DocumentDirectoryPath).not.toMatch(/\/$/);
  });

  it('returns a non-empty string', () => {
    expect(fs.DocumentDirectoryPath.length).toBeGreaterThan(0);
  });
});

describe('exists', () => {
  it('returns true when file exists', async () => {
    FileSystem.getInfoAsync.mockResolvedValue({ exists: true });
    await expect(fs.exists('/some/path')).resolves.toBe(true);
  });

  it('returns false when file does not exist', async () => {
    FileSystem.getInfoAsync.mockResolvedValue({ exists: false });
    await expect(fs.exists('/missing/path')).resolves.toBe(false);
  });

  it('passes a file:// URI to FileSystem', async () => {
    FileSystem.getInfoAsync.mockResolvedValue({ exists: true });
    await fs.exists('/plain/path');
    expect(FileSystem.getInfoAsync).toHaveBeenCalledWith('file:///plain/path');
  });

  it('does not double-prefix file:// URIs', async () => {
    FileSystem.getInfoAsync.mockResolvedValue({ exists: true });
    await fs.exists('file:///already/uri');
    expect(FileSystem.getInfoAsync).toHaveBeenCalledWith('file:///already/uri');
  });
});

describe('unlink', () => {
  it('calls deleteAsync with idempotent: true', async () => {
    FileSystem.deleteAsync.mockResolvedValue(undefined);
    await fs.unlink('/some/file.jpg');
    expect(FileSystem.deleteAsync).toHaveBeenCalledWith(
      'file:///some/file.jpg',
      { idempotent: true },
    );
  });
});

describe('mkdir', () => {
  it('calls makeDirectoryAsync with intermediates: true', async () => {
    FileSystem.makeDirectoryAsync.mockResolvedValue(undefined);
    await fs.mkdir('/new/dir');
    expect(FileSystem.makeDirectoryAsync).toHaveBeenCalledWith(
      'file:///new/dir',
      { intermediates: true },
    );
  });
});

describe('moveFile', () => {
  it('calls moveAsync with from/to URIs', async () => {
    FileSystem.moveAsync.mockResolvedValue(undefined);
    await fs.moveFile('/src/file.jpg', '/dest/file.jpg');
    expect(FileSystem.moveAsync).toHaveBeenCalledWith({
      from: 'file:///src/file.jpg',
      to: 'file:///dest/file.jpg',
    });
  });

  it('handles file:// URIs as source (from ImageManipulator)', async () => {
    FileSystem.moveAsync.mockResolvedValue(undefined);
    await fs.moveFile('file:///uri/from/manipulator.jpg', '/dest/file.jpg');
    expect(FileSystem.moveAsync).toHaveBeenCalledWith({
      from: 'file:///uri/from/manipulator.jpg',
      to: 'file:///dest/file.jpg',
    });
  });
});

describe('stat', () => {
  it('returns size, path, and type helpers', async () => {
    FileSystem.getInfoAsync.mockResolvedValue({
      exists: true,
      size: 2048,
      isDirectory: false,
      uri: 'file:///some/file.jpg',
      modificationTime: 1700000000,
    });
    const info = await fs.stat('/some/file.jpg');
    expect(info.size).toBe(2048);
    expect(info.isFile()).toBe(true);
    expect(info.isDirectory()).toBe(false);
    expect(info.mtime).toBeInstanceOf(Date);
  });

  it('returns size 0 when not present in result', async () => {
    FileSystem.getInfoAsync.mockResolvedValue({ exists: true, uri: 'file:///x' });
    const info = await fs.stat('/x');
    expect(info.size).toBe(0);
  });
});

describe('getFSInfo', () => {
  it('returns freeSpace and totalSpace', async () => {
    FileSystem.getFreeDiskStorageAsync.mockResolvedValue(1_000_000_000);
    FileSystem.getTotalDiskCapacityAsync.mockResolvedValue(64_000_000_000);
    const info = await fs.getFSInfo();
    expect(info.freeSpace).toBe(1_000_000_000);
    expect(info.totalSpace).toBe(64_000_000_000);
  });
});

describe('getAllExternalFilesDirs', () => {
  it('delegates to react-native-fs', async () => {
    RNFS.getAllExternalFilesDirs.mockResolvedValue(['/ext/0', '/ext/1']);
    const dirs = await fs.getAllExternalFilesDirs();
    expect(dirs).toEqual(['/ext/0', '/ext/1']);
    expect(RNFS.getAllExternalFilesDirs).toHaveBeenCalledTimes(1);
  });
});
