import cameraReducer from '../../store/reducers/cameraReducer/cameraReducer';
import {
  UPDATE_GPS_ACCURACY,
  UPDATE_CAMERA_STATUS,
  UPDATE_CAMERA_REF,
  UPDATE_IMAGE_SIZE,
  UPDATE_PHONE_MEMORY,
  UPDATE_PHOTO_AMOUNT,
  UPDATE_BATTERY_LEVEL,
  UPDATE_BATTERY_STATUS,
  UPDATE_MOCKED_STATUS,
  CAMERA_REDUCER_RESET,
  UPDATE_ACCURACY,
  CAPTURE_BUTTON_STATUS,
  UPDATE_ROTATE_STATUS,
  SET_CAMERA_LOCATION,
  UPDATE_OPENED_STATUS,
  IS_ACTIVE,
  GROUP_ID,
  TOGGLE_ROTATE_ALERT,
} from '../../store/actionsName';

const initialState = {
  GPSAccuracy: false,
  cameraStatus: '',
  camera: null,
  imageSize: 3145728,
  phoneMemory: 0,
  photoAmount: 0,
  batteryLevel: 100,
  batteryStatus: false,
  accuracy: false,
  accuracyLevel: null,
  mocked: false,
  captureButtonStatus: false,
  rotateStatus: false,
  showRotateAlert: true,
  cameraLocation: null,
  isFirstOpen: true,
  isActive: true,
  groupId: null,
};

describe('cameraReducer', () => {
  it('returns initial state when called with undefined state', () => {
    const state = cameraReducer(undefined, { type: '@@INIT' });
    expect(state).toEqual(initialState);
  });

  it('handles UPDATE_GPS_ACCURACY', () => {
    const state = cameraReducer(undefined, { type: UPDATE_GPS_ACCURACY, payload: true });
    expect(state.GPSAccuracy).toBe(true);
  });

  it('handles UPDATE_CAMERA_STATUS', () => {
    const state = cameraReducer(undefined, { type: UPDATE_CAMERA_STATUS, payload: 'recording' });
    expect(state.cameraStatus).toBe('recording');
  });

  it('handles UPDATE_IMAGE_SIZE', () => {
    const state = cameraReducer(undefined, { type: UPDATE_IMAGE_SIZE, payload: 1024 });
    expect(state.imageSize).toBe(1024);
  });

  it('handles UPDATE_PHONE_MEMORY', () => {
    const state = cameraReducer(undefined, { type: UPDATE_PHONE_MEMORY, payload: 50 });
    expect(state.phoneMemory).toBe(50);
  });

  it('handles UPDATE_PHOTO_AMOUNT', () => {
    const state = cameraReducer(undefined, { type: UPDATE_PHOTO_AMOUNT, payload: 10 });
    expect(state.photoAmount).toBe(10);
  });

  it('handles UPDATE_BATTERY_LEVEL', () => {
    const state = cameraReducer(undefined, { type: UPDATE_BATTERY_LEVEL, payload: 80 });
    expect(state.batteryLevel).toBe(80);
  });

  it('handles UPDATE_BATTERY_STATUS', () => {
    const state = cameraReducer(undefined, { type: UPDATE_BATTERY_STATUS, payload: true });
    expect(state.batteryStatus).toBe(true);
  });

  it('handles UPDATE_MOCKED_STATUS', () => {
    const state = cameraReducer(undefined, { type: UPDATE_MOCKED_STATUS, payload: true });
    expect(state.mocked).toBe(true);
  });

  it('handles UPDATE_ACCURACY', () => {
    const state = cameraReducer(undefined, { type: UPDATE_ACCURACY, payload: true });
    expect(state.accuracy).toBe(true);
  });

  it('handles CAPTURE_BUTTON_STATUS', () => {
    const state = cameraReducer(undefined, { type: CAPTURE_BUTTON_STATUS, payload: true });
    expect(state.captureButtonStatus).toBe(true);
  });

  it('handles UPDATE_ROTATE_STATUS', () => {
    const state = cameraReducer(undefined, { type: UPDATE_ROTATE_STATUS, payload: true });
    expect(state.rotateStatus).toBe(true);
  });

  it('handles SET_CAMERA_LOCATION', () => {
    const location = { latitude: 41.0, longitude: 29.0, altitude: 50 };
    const state = cameraReducer(undefined, { type: SET_CAMERA_LOCATION, payload: location });
    expect(state.cameraLocation).toEqual(location);
  });

  it('handles UPDATE_OPENED_STATUS', () => {
    const state = cameraReducer(undefined, { type: UPDATE_OPENED_STATUS, payload: false });
    expect(state.isFirstOpen).toBe(false);
  });

  it('handles IS_ACTIVE', () => {
    const state = cameraReducer(undefined, { type: IS_ACTIVE, payload: false });
    expect(state.isActive).toBe(false);
  });

  it('handles GROUP_ID', () => {
    const state = cameraReducer(undefined, { type: GROUP_ID, payload: 'test-uuid' });
    expect(state.groupId).toBe('test-uuid');
  });

  it('handles TOGGLE_ROTATE_ALERT', () => {
    const state = cameraReducer(undefined, { type: TOGGLE_ROTATE_ALERT, payload: false });
    expect(state.showRotateAlert).toBe(false);
  });

  it('handles CAMERA_REDUCER_RESET — resets camera fields but keeps others', () => {
    const modified = {
      ...initialState,
      GPSAccuracy: true,
      photoAmount: 99,
      imageSize: 1024,
      groupId: 'some-uuid',
    };
    const state = cameraReducer(modified, { type: CAMERA_REDUCER_RESET });
    expect(state.GPSAccuracy).toBe(false);
    expect(state.photoAmount).toBe(0);
    expect(state.imageSize).toBe(3145728);
    // groupId should be preserved (not reset)
    expect(state.groupId).toBe('some-uuid');
  });

  it('does not mutate the previous state', () => {
    const prev = cameraReducer(undefined, { type: '@@INIT' });
    const next = cameraReducer(prev, { type: UPDATE_GPS_ACCURACY, payload: true });
    expect(prev.GPSAccuracy).toBe(false); // original unchanged
    expect(next.GPSAccuracy).toBe(true);
    expect(prev).not.toBe(next);
  });

  it('handles UPDATE_CAMERA_REF', () => {
    const mockCamera = { takePhoto: jest.fn() };
    const state = cameraReducer(undefined, { type: UPDATE_CAMERA_REF, payload: mockCamera });
    expect(state.camera).toBe(mockCamera);
  });

  it('returns the same state for unknown actions', () => {
    const state = cameraReducer(initialState, { type: 'UNKNOWN_ACTION' });
    expect(state).toBe(initialState);
  });
});
