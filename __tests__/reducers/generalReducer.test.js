import generalReducer from '../../store/reducers/generalReducer/generalReducer';
import {
  UPDATE_CONNECTION_STATUS,
  UPDATE_LANGUAGE,
  SET_DEBUG_MODE,
  SET_MAP_MODE,
  SET_MAINTENANCE_MODE,
  SET_MAIL_MODAL_SHOWN,
  SET_CONFIG,
  SET_CURRENT_POSITION,
  UPDATE_CURRENT_FEED_SEQUENCE,
  UPDATE_WELCOME_WALKTHROUGH_STATUS,
  UPDATE_CURRENT_DB,
} from '../../store/actionsName';

const initialState = {
  connection: { connectionStatus: true, connectionType: 'wifi' },
  welcomeWalkthroughStatus: false,
  db: null,
  currentFeedSequence: null,
  language: 'en',
  currentPosition: undefined,
  debugMode: false,
  mapShown: true,
  maintenanceMode: false,
  shouldShowMailModal: false,
  config: expect.any(Object),
};

describe('generalReducer', () => {
  it('returns initial state for unknown action', () => {
    const state = generalReducer(undefined, { type: '@@INIT' });
    expect(state.language).toBe('en');
    expect(state.debugMode).toBe(false);
    expect(state.maintenanceMode).toBe(false);
  });

  it('handles UPDATE_CONNECTION_STATUS', () => {
    const payload = { connectionStatus: false, connectionType: 'cellular' };
    const state = generalReducer(undefined, { type: UPDATE_CONNECTION_STATUS, payload });
    expect(state.connection).toEqual(payload);
  });

  it('handles UPDATE_LANGUAGE', () => {
    const state = generalReducer(undefined, { type: UPDATE_LANGUAGE, payload: 'tr' });
    expect(state.language).toBe('tr');
  });

  it('handles SET_DEBUG_MODE', () => {
    const state = generalReducer(undefined, { type: SET_DEBUG_MODE, payload: true });
    expect(state.debugMode).toBe(true);
  });

  it('handles SET_MAP_MODE', () => {
    const state = generalReducer(undefined, { type: SET_MAP_MODE, payload: false });
    expect(state.mapShown).toBe(false);
  });

  it('handles SET_MAINTENANCE_MODE', () => {
    const state = generalReducer(undefined, { type: SET_MAINTENANCE_MODE, payload: true });
    expect(state.maintenanceMode).toBe(true);
  });

  it('handles SET_MAIL_MODAL_SHOWN', () => {
    const state = generalReducer(undefined, { type: SET_MAIL_MODAL_SHOWN, payload: true });
    expect(state.shouldShowMailModal).toBe(true);
  });

  it('handles SET_CURRENT_POSITION', () => {
    const position = { latitude: 41.0, longitude: 29.0, altitude: 0 };
    const state = generalReducer(undefined, { type: SET_CURRENT_POSITION, payload: position });
    expect(state.currentPosition).toEqual(position);
  });

  it('handles UPDATE_CURRENT_FEED_SEQUENCE', () => {
    const state = generalReducer(undefined, {
      type: UPDATE_CURRENT_FEED_SEQUENCE,
      payload: 'seq-123',
    });
    expect(state.currentFeedSequence).toBe('seq-123');
  });

  it('handles SET_CONFIG — merges into existing config', () => {
    const initial = generalReducer(undefined, { type: '@@INIT' });
    const state = generalReducer(initial, {
      type: SET_CONFIG,
      payload: { isMarketOpen: true },
    });
    expect(state.config.isMarketOpen).toBe(true);
    // Other config fields should be preserved
    expect(state.config.isChallengeOpen).toBe(false);
  });

  it('does not mutate previous state', () => {
    const prev = generalReducer(undefined, { type: '@@INIT' });
    const next = generalReducer(prev, { type: SET_DEBUG_MODE, payload: true });
    expect(prev.debugMode).toBe(false);
    expect(next.debugMode).toBe(true);
    expect(prev).not.toBe(next);
  });

  it('handles UPDATE_WELCOME_WALKTHROUGH_STATUS', () => {
    const state = generalReducer(undefined, {
      type: UPDATE_WELCOME_WALKTHROUGH_STATUS,
      payload: true,
    });
    expect(state.welcomeWalkthroughStatus).toBe(true);
  });

  it('handles UPDATE_CURRENT_DB', () => {
    const state = generalReducer(undefined, {
      type: UPDATE_CURRENT_DB,
      payload: 'mapilio.db',
    });
    expect(state.db).toBe('mapilio.db');
  });

  it('returns same state reference for unknown actions', () => {
    const state = generalReducer(undefined, { type: '@@INIT' });
    const next = generalReducer(state, { type: 'UNKNOWN' });
    expect(next).toBe(state);
  });
});
