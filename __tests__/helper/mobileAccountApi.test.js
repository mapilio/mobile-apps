import { mobileAccountPaths } from '../../util/helpers/api/MobileAccountPaths';
import { mobileAccountApi } from '../../util/helpers/api/MobileAccountApi';
import api from '../../util/helpers/api/Api';
import publicApi from '../../util/helpers/api/PublicApi';

jest.mock('../../util/helpers/api/Api', () => ({
  __esModule: true,
  default: { post: jest.fn(), delete: jest.fn() },
}));

jest.mock('../../util/helpers/api/PublicApi', () => ({
  __esModule: true,
  default: { post: jest.fn() },
}));

describe('versioned mobile account API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('keeps every account lifecycle call on the v1 mobile surface', () => {
    expect(mobileAccountPaths).toEqual({
      register: '/api/v1/mobile/accounts',
      forgotPassword: '/api/v1/mobile/password/forgot',
      profile: '/api/v1/mobile/profile',
      email: '/api/v1/mobile/profile/email',
      account: '/api/v1/mobile/account',
    });

    Object.values(mobileAccountPaths).forEach((path) => {
      expect(path).toMatch(/^\/api\/v1\/mobile\//);
      expect(path).not.toContain('/function/');
    });
  });

  it('keeps public account entry points off the authenticated client', () => {
    const registration = { email: 'new@example.test' };
    const recovery = { email: 'known@example.test' };

    mobileAccountApi.register(registration);
    mobileAccountApi.forgotPassword(recovery);

    expect(publicApi.post).toHaveBeenNthCalledWith(
      1,
      mobileAccountPaths.register,
      registration,
      expect.any(Object)
    );
    expect(publicApi.post).toHaveBeenNthCalledWith(
      2,
      mobileAccountPaths.forgotPassword,
      recovery,
      expect.any(Object)
    );
    expect(api.post).not.toHaveBeenCalled();
  });

  it('uses the authenticated client for profile and account changes', () => {
    const profile = { display_name: 'Mapilio Contributor' };
    const email = { email: 'updated@example.test' };
    const deletion = { login_type: 'default' };

    mobileAccountApi.updateProfile(profile);
    mobileAccountApi.updateEmail(email);
    mobileAccountApi.deleteAccount(deletion);

    expect(api.post).toHaveBeenNthCalledWith(
      1,
      mobileAccountPaths.profile,
      profile,
      expect.any(Object)
    );
    expect(api.post).toHaveBeenNthCalledWith(
      2,
      mobileAccountPaths.email,
      email,
      expect.any(Object)
    );
    expect(api.delete).toHaveBeenCalledWith(mobileAccountPaths.account, { data: deletion });
  });
});
