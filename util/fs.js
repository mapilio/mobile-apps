/**
 * Filesystem abstraction - wraps expo-file-system (New Architecture ready).
 *
 * Android removable-storage access is provided by the local MapilioStorage Expo module.
 */
import { Directory, File, Paths } from 'expo-file-system';
import { Platform } from 'react-native';
import MapilioStorageModule from '../modules/mapilio-storage/src/MapilioStorageModule';

/** Convert a plain path to a file:// URI (idempotent). */
const toUri = (path) =>
  typeof path === 'string' && path.startsWith('file://') ? path : `file://${path}`;

/**
 * Internal document directory — equivalent to RNFS.DocumentDirectoryPath.
 * Plain path without "file://" prefix and without trailing slash.
 */
export const DocumentDirectoryPath = Paths.document?.uri
  ? Paths.document.uri.replace('file://', '').replace(/\/$/, '')
  : '';

/**
 * Android-only: returns external files directory paths.
 * The native module preserves Android's Context.getExternalFilesDirs order.
 * @returns {Promise<string[]>}
 */
export const getAllExternalFilesDirs = async () => {
  if (Platform.OS !== 'android' || !MapilioStorageModule) return [];
  return MapilioStorageModule.getAllExternalFilesDirs();
};

/**
 * Return the removable SD-card directory, or null when it is unavailable.
 * Native failures are contained so background file operations cannot use a wrong path.
 */
export const getRemovableExternalFilesDir = async () => {
  if (Platform.OS !== 'android' || !MapilioStorageModule?.getRemovableExternalFilesDir) {
    return null;
  }
  try {
    return (await MapilioStorageModule.getRemovableExternalFilesDir()) ?? null;
  } catch {
    return null;
  }
};

/**
 * Get file or directory metadata.
 * @param {string} path - plain path or file:// URI
 * @returns {Promise<{size: number, path: string, isFile: () => boolean, isDirectory: () => boolean, mtime: Date|null}>}
 */
export const stat = async (path) => {
  const uri = toUri(path);
  const pathInfo = Paths.info(uri);
  const resource = pathInfo.isDirectory ? new Directory(uri) : new File(uri);
  const info = resource.info();
  return {
    size: info.size ?? 0,
    path: info.uri ?? resource.uri,
    isFile: () => !pathInfo.isDirectory,
    isDirectory: () => Boolean(pathInfo.isDirectory),
    mtime: info.modificationTime ? new Date(info.modificationTime) : null,
  };
};

/**
 * Check whether a file or directory exists.
 * @param {string} path
 * @returns {Promise<boolean>}
 */
export const exists = async (path) => Paths.info(toUri(path)).exists;

/**
 * Delete a file or directory (no-op if it does not exist).
 * @param {string} path
 * @returns {Promise<void>}
 */
export const unlink = async (path) => {
  const uri = toUri(path);
  const pathInfo = Paths.info(uri);
  if (!pathInfo.exists) return;

  const resource = pathInfo.isDirectory ? new Directory(uri) : new File(uri);
  resource.delete();
};

/**
 * Create a directory, including any missing intermediate directories.
 * @param {string} path
 * @returns {Promise<void>}
 */
export const mkdir = async (path) => {
  new Directory(toUri(path)).create({ intermediates: true, idempotent: true });
};

/**
 * Move a file from src to dest.
 * @param {string} src
 * @param {string} dest
 * @returns {Promise<void>}
 */
export const moveFile = async (src, dest) => {
  new File(toUri(src)).move(new File(toUri(dest)));
};

/**
 * Get free and total disk space.
 * @returns {Promise<{freeSpace: number, totalSpace: number}>}
 */
export const getFSInfo = async () => {
  return {
    freeSpace: Paths.availableDiskSpace,
    totalSpace: Paths.totalDiskSpace,
  };
};
