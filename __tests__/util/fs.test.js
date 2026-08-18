// Mock the modern expo-file-system object API before importing the adapter.
jest.mock('expo-file-system', () => {
  class MockFile {
    constructor(uri) {
      this.uri = uri;
    }

    info() {
      return MockFile.info(this.uri);
    }

    delete() {
      return MockFile.delete(this.uri);
    }

    move(destination) {
      return MockFile.move(this.uri, destination.uri);
    }
  }

  class MockDirectory {
    constructor(uri) {
      this.uri = uri;
    }

    info() {
      return MockDirectory.info(this.uri);
    }

    create(options) {
      return MockDirectory.create(this.uri, options);
    }

    delete() {
      return MockDirectory.delete(this.uri);
    }
  }

  MockFile.info = jest.fn();
  MockFile.delete = jest.fn();
  MockFile.move = jest.fn();
  MockDirectory.info = jest.fn();
  MockDirectory.create = jest.fn();
  MockDirectory.delete = jest.fn();

  return {
    File: MockFile,
    Directory: MockDirectory,
    Paths: {
      document: { uri: 'file:///data/user/0/com.mapilio/files/' },
      info: jest.fn(),
      availableDiskSpace: 0,
      totalDiskSpace: 0,
    },
  };
});

// Mock react-native-fs (used only for getAllExternalFilesDirs)
jest.mock('react-native-fs', () => ({
  getAllExternalFilesDirs: jest.fn(),
}));

import { Directory, File, Paths } from 'expo-file-system';
import * as RNFS from 'react-native-fs';
import * as fs from '../../util/fs';

beforeEach(() => {
  jest.clearAllMocks();
  Paths.info.mockReturnValue({ exists: true, isDirectory: false });
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
    Paths.info.mockReturnValue({ exists: true, isDirectory: false });
    await expect(fs.exists('/some/path')).resolves.toBe(true);
  });

  it('returns false when file does not exist', async () => {
    Paths.info.mockReturnValue({ exists: false, isDirectory: null });
    await expect(fs.exists('/missing/path')).resolves.toBe(false);
  });

  it('passes a file:// URI to FileSystem', async () => {
    Paths.info.mockReturnValue({ exists: true, isDirectory: false });
    await fs.exists('/plain/path');
    expect(Paths.info).toHaveBeenCalledWith('file:///plain/path');
  });

  it('does not double-prefix file:// URIs', async () => {
    Paths.info.mockReturnValue({ exists: true, isDirectory: false });
    await fs.exists('file:///already/uri');
    expect(Paths.info).toHaveBeenCalledWith('file:///already/uri');
  });
});

describe('unlink', () => {
  it('deletes an existing file', async () => {
    Paths.info.mockReturnValue({ exists: true, isDirectory: false });
    File.delete.mockReturnValue(undefined);
    await fs.unlink('/some/file.jpg');
    expect(File.delete).toHaveBeenCalledWith('file:///some/file.jpg');
  });

  it('deletes an existing directory', async () => {
    Paths.info.mockReturnValue({ exists: true, isDirectory: true });
    Directory.delete.mockReturnValue(undefined);
    await fs.unlink('/some/directory');
    expect(Directory.delete).toHaveBeenCalledWith('file:///some/directory');
  });

  it('does nothing when the path is missing', async () => {
    Paths.info.mockReturnValue({ exists: false, isDirectory: null });
    await fs.unlink('/missing');
    expect(File.delete).not.toHaveBeenCalled();
  });
});

describe('mkdir', () => {
  it('creates directories with intermediates', async () => {
    Directory.create.mockReturnValue(undefined);
    await fs.mkdir('/new/dir');
    expect(Directory.create).toHaveBeenCalledWith('file:///new/dir', {
      intermediates: true,
      idempotent: true,
    });
  });
});

describe('moveFile', () => {
  it('moves a file from source to destination URIs', async () => {
    File.move.mockReturnValue(undefined);
    await fs.moveFile('/src/file.jpg', '/dest/file.jpg');
    expect(File.move).toHaveBeenCalledWith('file:///src/file.jpg', 'file:///dest/file.jpg');
  });

  it('handles file:// URIs as source (from ImageManipulator)', async () => {
    File.move.mockReturnValue(undefined);
    await fs.moveFile('file:///uri/from/manipulator.jpg', '/dest/file.jpg');
    expect(File.move).toHaveBeenCalledWith(
      'file:///uri/from/manipulator.jpg',
      'file:///dest/file.jpg'
    );
  });
});

describe('stat', () => {
  it('returns size, path, and type helpers', async () => {
    Paths.info.mockReturnValue({ exists: true, isDirectory: false });
    File.info.mockReturnValue({
      size: 2048,
      uri: 'file:///some/file.jpg',
      modificationTime: 1700000000000,
    });
    const info = await fs.stat('/some/file.jpg');
    expect(info.size).toBe(2048);
    expect(info.isFile()).toBe(true);
    expect(info.isDirectory()).toBe(false);
    expect(info.mtime).toEqual(new Date(1700000000000));
  });

  it('returns directory metadata and type helpers', async () => {
    Paths.info.mockReturnValue({ exists: true, isDirectory: true });
    Directory.info.mockReturnValue({ size: 4096, uri: 'file:///some/directory' });
    const info = await fs.stat('/some/directory');
    expect(info.size).toBe(4096);
    expect(info.isFile()).toBe(false);
    expect(info.isDirectory()).toBe(true);
  });

  it('returns size 0 when not present in result', async () => {
    Paths.info.mockReturnValue({ exists: true, isDirectory: false });
    File.info.mockReturnValue({ uri: 'file:///x' });
    const info = await fs.stat('/x');
    expect(info.size).toBe(0);
  });
});

describe('getFSInfo', () => {
  it('returns freeSpace and totalSpace', async () => {
    Object.defineProperty(Paths, 'availableDiskSpace', { value: 1_000_000_000 });
    Object.defineProperty(Paths, 'totalDiskSpace', { value: 64_000_000_000 });
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
