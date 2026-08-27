const mockGet = jest.fn();
const mockPost = jest.fn();
const mockDispatch = jest.fn();
const mockSetUser = jest.fn();
const mockAddEmail = jest.fn();

jest.mock('../../util/helpers/api', () => ({
  api: {
    get: (...args) => mockGet(...args),
    post: (...args) => mockPost(...args),
  },
}));

jest.mock('@sentry/react-native', () => ({
  setUser: (...args) => mockSetUser(...args),
}));

jest.mock('react-native-onesignal', () => ({
  OneSignal: { User: { addEmail: (...args) => mockAddEmail(...args) } },
}));

class RecordingFormData {
  constructor() {
    this.entries = {};
  }

  append(key, value) {
    this.entries[key] = value;
  }
}

const { GET_USER_INDEX_TYPE, GET_USER_INFORMATION } = require('../../store/actionsName');
const { mobileAccountPaths } = require('../../util/helpers/api/MobileAccountPaths');
const { getUserInformation } = require('../../store/reducers/loginReducer/getUserInformation');

const profile = {
  id: 42,
  email: 'person@example.test',
  display_name: 'Mapilio Person',
  user_profile_photo: 'https://cdn.example.test/person.jpg',
  username: 'person',
  str_id: 'person-key',
  user_bio: 'Mapping roads',
  meters: 1234,
};

describe('getUserInformation', () => {
  let originalFormData;

  beforeEach(() => {
    jest.clearAllMocks();
    originalFormData = global.FormData;
    global.FormData = RecordingFormData;
    mockGet.mockResolvedValue({ data: [profile] });
    mockPost.mockResolvedValue({ data: { verified: true } });
  });

  afterEach(() => {
    global.FormData = originalFormData;
  });

  it('maps the versioned profile envelope into the expected Redux and Sentry identities', async () => {
    await getUserInformation()(mockDispatch);

    expect(mockGet).toHaveBeenCalledWith(mobileAccountPaths.profile);
    expect(mockDispatch).toHaveBeenNthCalledWith(1, {
      type: GET_USER_INDEX_TYPE,
      payload: {
        index: 0,
        type: {
          accountType: 'Individual',
          displayName: 'Mapilio Person',
          picture: 'https://cdn.example.test/person.jpg',
          username: 'person',
          key: 'person-key',
          id: 42,
          bio: 'Mapping roads',
          meters: 1234,
        },
      },
    });
    expect(mockDispatch).toHaveBeenNthCalledWith(2, {
      type: GET_USER_INFORMATION,
      payload: profile,
    });
    expect(mockSetUser).toHaveBeenCalledWith({ id: '42', email: 'person@example.test' });
  });

  it('verifies the email at the versioned endpoint before registering it with OneSignal', async () => {
    await getUserInformation()(mockDispatch);

    expect(mockPost).toHaveBeenCalledTimes(1);
    const [path, body, options] = mockPost.mock.calls[0];
    expect(path).toBe(mobileAccountPaths.onesignalIdentityVerification);
    expect(body.entries).toEqual({
      'options[parameters][email]': 'person@example.test',
    });
    expect(options).toEqual({ headers: { 'Content-Type': 'multipart/form-data' } });
    expect(mockAddEmail).toHaveBeenCalledWith('person@example.test');
    expect(mockPost.mock.invocationCallOrder[0]).toBeLessThan(
      mockAddEmail.mock.invocationCallOrder[0]
    );
  });
});
