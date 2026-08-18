/**
 * Filesystem abstraction - wraps expo-file-system (New Architecture ready).
 *
 * All 15 files that previously imported 'react-native-fs' now import this module,
 * providing the same API surface. This isolates the react-native-fs dependency:
 * when it is eventually replaced for full New Architecture support, only this file
 * needs to change.
 *
 * NOTE: getAllExternalFilesDirs() still delegates to react-native-fs because
 * expo-file-system does not expose Android external storage paths. This is
 * kept as a New Architecture interop exception until a future Expo Module
 * can replace it.
 */
import { Directory, File, Paths } from 'expo-file-system';
import * as RNFS from 'react-native-fs'; // used only for getAllExternalFilesDirs()

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
 * [0] = primary external, [1] = removable SD card (if present).
 * @returns {Promise<string[]>}
 */
export const getAllExternalFilesDirs = () => RNFS.getAllExternalFilesDirs();

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
