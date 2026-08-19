import { getPublicApiErrorMessage } from '../../util/helpers/api/PublicApi';

describe('public API errors', () => {
  it('keeps a backend message when one is present', () => {
    expect(
      getPublicApiErrorMessage({
        message: 'Request failed',
        response: { data: { message: 'Too many attempts.' } },
      })
    ).toBe('Too many attempts.');
  });

  it('extracts the first field validation message', () => {
    expect(
      getPublicApiErrorMessage({
        message: 'Request failed with status code 400',
        response: {
          data: {
            email: ['The email has already been taken.'],
            username: ['The username has already been taken.'],
          },
        },
      })
    ).toBe('The email has already been taken.');
  });
});
