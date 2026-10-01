import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { UPDATE_IMAGE_SIZE, UPDATE_PHOTO_AMOUNT } from '../../store/actionsName';

const mockDispatch = jest.fn();
const mockTakePicture = jest.fn();
const mockInsertToDB = jest.fn();
const mockNavigation = { addListener: jest.fn(() => jest.fn()) };
let mockState;

jest.mock('react-native', () => {
  const ReactNative = require('react');
  const component =
    (name) =>
    ({ children, ...props }) =>
      ReactNative.createElement(name, props, children);

  return {
    Platform: { OS: 'ios' },
    AppState: { currentState: 'active', addEventListener: jest.fn(() => ({ remove: jest.fn() })) },
    View: component('View'),
    Pressable: component('Pressable'),
    Text: component('Text'),
    NativeModules: {},
    TurboModuleRegistry: { get: jest.fn(), getEnforcing: jest.fn(() => ({})) },
  };
});
jest.mock('../../assets/svg/illustrations', () => ({
  PlayIcon: () => null,
  StopIcon: () => null,
}));
jest.mock('../../styles/cameraStyles', () => ({ cameraActionButtonStyles: {} }));
jest.mock('../../util/helpers', () => ({ vibrate: jest.fn() }));
jest.mock('react-native-uuid', () => ({ v4: () => 'capture-sequence' }));
jest.mock('../../db', () => ({
  __esModule: true,
  default: { insertToDB: (...args) => mockInsertToDB(...args) },
}));
jest.mock('@react-navigation/native', () => ({ useNavigation: () => mockNavigation }));
jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: (selector) => selector(mockState),
}));
jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key) => key }) }));
jest.mock('expo-sensors', () => {
  const sensor = () => ({
    setUpdateInterval: jest.fn(),
    addListener: jest.fn(() => ({ remove: jest.fn() })),
  });
  return { Accelerometer: sensor(), Gyroscope: sensor(), DeviceMotion: sensor() };
});
jest.mock('expo-image-manipulator', () => ({
  manipulateAsync: jest.fn(),
  SaveFormat: { JPEG: 'jpeg' },
}));
jest.mock('../../util/fs', () => ({
  DocumentDirectoryPath: '/documents',
  exists: jest.fn(),
  mkdir: jest.fn(),
  moveFile: jest.fn(),
  unlink: jest.fn(),
  stat: jest.fn(),
  getRemovableExternalFilesDir: jest.fn(),
}));

const AutoActionButton = require('../../components/AutoActionButton').default;
const fs = require('../../util/fs');
const { manipulateAsync } = require('expo-image-manipulator');

const photo = {
  uri: 'file:///cache/camera.jpg',
  width: 4032,
  height: 3024,
  format: 'jpg',
  exif: { FocalLength: 4.2, FocalLenIn35mmFilm: 26 },
};

describe('automatic capture persistence', () => {
  let button;
  const updateLocation = async (latitude) => {
    mockState.cameraReducer.cameraLocation = { latitude, longitude: 29, accuracy: 1, heading: 90 };
    await act(async () => {
      button.update(<AutoActionButton />);
    });
  };
  const capture = async () => {
    await act(async () => {
      button = renderer.create(<AutoActionButton />);
    });
    await updateLocation(41);
    await updateLocation(41.0001);
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockState = {
      cameraReducer: {
        camera: { takePictureAsync: mockTakePicture },
        accuracy: { degree: true },
        GPSAccuracy: true,
        rotateStatus: false,
        showRotateAlert: true,
        batteryStatus: false,
        mocked: false,
        captureButtonStatus: true,
        cameraLocation: null,
        groupId: 'capture-group',
      },
      settingsReducer: {
        autoCaptureStart: true,
        distanceBetween: 5,
        defaultStoragePath: 'internal',
        selectedProject: {
          projectKey: 'project-key',
          projectName: 'Test project',
          organizationKey: 'organization-key',
        },
      },
      generalReducer: { debugMode: false },
      tooltipReducer: { camera: { isInitialized: true } },
    };
    mockTakePicture.mockResolvedValue({ ...photo });
    mockInsertToDB.mockResolvedValue({ lastInsertRowId: 1 });
    manipulateAsync.mockResolvedValue({ uri: 'file:///cache/compressed.jpeg' });
    fs.exists.mockResolvedValue(false);
    fs.mkdir.mockResolvedValue();
    fs.moveFile.mockResolvedValue();
    fs.unlink.mockResolvedValue();
    fs.stat.mockResolvedValue({ size: 1234 });
    fs.getRemovableExternalFilesDir.mockResolvedValue('/sd-card');
  });

  afterEach(async () => {
    await act(async () => button?.unmount());
  });

  it.each([
    ['internal', '/documents'],
    ['external', '/sd-card'],
  ])(
    'saves an Expo camera URI to %s storage and records the upload metadata',
    async (storage, root) => {
      mockState.settingsReducer.defaultStoragePath = storage;
      await capture();

      expect(mockTakePicture).toHaveBeenCalledTimes(1);
      expect(manipulateAsync).toHaveBeenCalledWith(
        photo.uri,
        [{ resize: { width: photo.width, height: photo.height } }],
        { compress: 0.5, format: 'jpeg' }
      );
      expect(fs.mkdir).toHaveBeenCalledWith(`${root}/capture-group`);
      expect(mockInsertToDB).toHaveBeenCalledTimes(1);
      const row = mockInsertToDB.mock.calls[0][0];
      expect(row).toEqual(
        expect.objectContaining({
          path: `capture-group/${row.filename}.jpeg`,
          groupId: 'capture-group',
          uuid: 'capture-sequence',
          captureID: 0,
          projectKey: 'project-key',
          organizationName: 'Test project',
          organizationKey: 'organization-key',
          defaultStoragePath: storage,
        })
      );
      expect(JSON.parse(row.location)).toEqual(mockState.cameraReducer.cameraLocation);
      expect(JSON.parse(row.exif)).toEqual(
        expect.objectContaining({
          captureWidth: photo.width,
          captureHeight: photo.height,
          focalLength: 4.2,
          focalLength35: 26,
        })
      );
      expect(fs.moveFile).toHaveBeenCalledWith(
        'file:///cache/compressed.jpeg',
        `${root}/${row.path}`
      );
      expect(fs.unlink).toHaveBeenCalledWith(photo.uri);
      expect(mockDispatch).toHaveBeenCalledWith({ type: UPDATE_IMAGE_SIZE, payload: 1234 });
      expect(mockDispatch).toHaveBeenCalledWith({ type: UPDATE_PHOTO_AMOUNT, payload: 1 });
      expect(toast.show).not.toHaveBeenCalled();
    }
  );

  it('only counts a photo after its database record has been saved', async () => {
    let finishInsert;
    mockInsertToDB.mockReturnValueOnce(
      new Promise((resolve) => {
        finishInsert = resolve;
      })
    );
    await capture();

    expect(mockInsertToDB).toHaveBeenCalledTimes(1);
    expect(mockDispatch).not.toHaveBeenCalledWith({ type: UPDATE_PHOTO_AMOUNT, payload: 1 });
    await act(async () => finishInsert({ lastInsertRowId: 1 }));
    expect(mockDispatch).toHaveBeenCalledWith({ type: UPDATE_PHOTO_AMOUNT, payload: 1 });
  });

  it.each(['camera', 'compression', 'move', 'database'])(
    'reports a %s failure without counting the photo as saved',
    async (stage) => {
      const operation = {
        camera: mockTakePicture,
        compression: manipulateAsync,
        move: fs.moveFile,
        database: mockInsertToDB,
      }[stage];
      operation.mockRejectedValueOnce(new Error('Capture could not be saved'));
      await capture();

      expect(toast.show).toHaveBeenCalledTimes(1);
      expect(toast.show).toHaveBeenCalledWith('something_went_wrong', { type: 'error' });
      expect(mockDispatch).not.toHaveBeenCalledWith({ type: UPDATE_PHOTO_AMOUNT, payload: 1 });
      expect(mockDispatch).not.toHaveBeenCalledWith({ type: UPDATE_IMAGE_SIZE, payload: 1234 });
    }
  );
});
