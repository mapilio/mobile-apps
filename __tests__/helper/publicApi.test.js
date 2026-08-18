const responseUse = jest.fn();
const mockAxiosInstance = {
  interceptors: { response: { use: responseUse } },
  get: jest.fn(),
  post: jest.fn(),
};
const mockCreate = jest.fn(() => mockAxiosInstance);

jest.mock('axios', () => ({ create: mockCreate }));
jest.mock('../../util/helpers/index', () => ({
  translate: (key) => key,
}));

describe('public API client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it('uses the service base URL and bounded timeout without auth machinery', () => {
    require('../../util/helpers/api/PublicApi');

    expect(mockCreate).toHaveBeenCalledWith({
      baseURL: process.env.EXPO_PUBLIC_SERVICE_URL,
      timeout: 10000,
      timeoutErrorMessage: 'timeout',
    });
    expect(responseUse).toHaveBeenCalledTimes(1);
    expect(mockAxiosInstance.interceptors).not.toHaveProperty('request');
  });

  it('unwraps backend error messages and sanitizes timeout failures', () => {
    require('../../util/helpers/api/PublicApi');
    const [, onRejected] = responseUse.mock.calls[0];

    expect(() => onRejected({ response: { data: { message: 'backend failure' } } })).toThrow(
      'backend failure'
    );
    expect(() => onRejected({ code: 'ECONNABORTED', message: 'network timeout' })).toThrow(
      'timeout'
    );
  });
});
