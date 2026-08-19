jest.mock('../../store/store', () => ({
  store: { getState: () => ({ getTokenReducer: {} }) },
}));

jest.mock('../../util/helpers', () => ({
  translate: (key) => key,
}));

jest.mock('../../util/helpers/api/RefreshToken', () => ({
  refreshToken: jest.fn(),
}));

import api from '../../util/helpers/api/Api';

describe('authenticated API client', () => {
  it('exposes every HTTP method used by mobile account actions', () => {
    expect(api.get).toEqual(expect.any(Function));
    expect(api.post).toEqual(expect.any(Function));
    expect(api.delete).toEqual(expect.any(Function));
  });
});
