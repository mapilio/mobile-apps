const mockPost = jest.fn();

jest.mock('../../util/helpers/api/PublicApi', () => ({
  __esModule: true,
  default: { post: (...args) => mockPost(...args) },
}));

describe('social token auth helper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('posts the provider token as JSON to the mobile endpoint', async () => {
    const response = { access_token: 'access', refresh_token: 'refresh' };
    mockPost.mockResolvedValue(response);
    const { socialTokenLogin } = require('../../util/helpers/api/SocialAuth');

    await expect(socialTokenLogin('google', 'provider-token')).resolves.toBe(response);
    expect(mockPost).toHaveBeenCalledWith('/api/v1/mobile/auth/social-token', {
      provider: 'google',
      token: 'provider-token',
    });
  });

  it('keeps the endpoint URL free of query parameters', () => {
    const { socialTokenLogin } = require('../../util/helpers/api/SocialAuth');

    socialTokenLogin('openstreetmap', 'provider-code');

    expect(mockPost).toHaveBeenCalledWith('/api/v1/mobile/auth/social-token', {
      provider: 'openstreetmap',
      token: 'provider-code',
    });
    expect(mockPost.mock.calls[0][0]).not.toContain('?');
  });
});
