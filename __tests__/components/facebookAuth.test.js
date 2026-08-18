import { processFacebookProfile } from '../../components/SocialLogin/facebookAuth';

describe('processFacebookProfile', () => {
  it('reports missing email and does not continue login', () => {
    const onMissingEmail = jest.fn();
    const onValidProfile = jest.fn();

    expect(processFacebookProfile({ name: 'No Email' }, { onMissingEmail, onValidProfile })).toBe(
      false
    );
    expect(onMissingEmail).toHaveBeenCalledTimes(1);
    expect(onValidProfile).not.toHaveBeenCalled();
  });

  it('continues when Facebook provides an email', () => {
    const onMissingEmail = jest.fn();
    const onValidProfile = jest.fn();
    const profile = { email: 'user@example.test' };

    expect(processFacebookProfile(profile, { onMissingEmail, onValidProfile })).toBe(true);
    expect(onValidProfile).toHaveBeenCalledWith(profile);
    expect(onMissingEmail).not.toHaveBeenCalled();
  });
});
