// Sanity tests for action name constants.
// These catch typos (leading/trailing spaces, wrong case) that cause silent
// Redux mismatches — the class of bugs fixed in Phase 3.
import * as actions from '../../store/actionsName';

describe('actionsName — no leading/trailing whitespace', () => {
  Object.entries(actions).forEach(([key, value]) => {
    it(`${key} has no whitespace padding`, () => {
      expect(value).toBe(value.trim());
    });
  });
});

describe('actionsName — value matches its key (convention check)', () => {
  // All constants in this file follow the pattern: KEY = "KEY"
  Object.entries(actions).forEach(([key, value]) => {
    it(`${key} value matches its export name`, () => {
      expect(value).toBe(key);
    });
  });
});

describe('actionsName — critical constants exist and are correct', () => {
  it('UPDATE_ACCURACY has no leading space', () => {
    expect(actions.UPDATE_ACCURACY).toBe('UPDATE_ACCURACY');
  });

  it('IS_UPLOADED has no leading space', () => {
    expect(actions.IS_UPLOADED).toBe('IS_UPLOADED');
  });

  it('UPDATE_CURRENT_SEQUENCE is correctly cased', () => {
    expect(actions.UPDATE_CURRENT_SEQUENCE).toBe('UPDATE_CURRENT_SEQUENCE');
  });

  it('SET_LEADERBOARD_USERS is spelled correctly', () => {
    expect(actions.SET_LEADERBOARD_USERS).toBe('SET_LEADERBOARD_USERS');
  });

  it('SET_LEADERBOARD_CHALLENGE_USERS is spelled correctly', () => {
    expect(actions.SET_LEADERBOARD_CHALLENGE_USERS).toBe('SET_LEADERBOARD_CHALLENGE_USERS');
  });
});
