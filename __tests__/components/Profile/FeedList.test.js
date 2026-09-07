import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { ActivityIndicator } from 'react-native';

const mockGet = jest.fn();
const mockProfileFeed = jest.fn(() => null);
const mockBadges = jest.fn(() => null);
const mockCaptureException = jest.fn();
let mockUserInformation = null;

jest.mock('../../../util/helpers/api', () => ({
  api: {
    get: (...args) => mockGet(...args),
  },
}));

jest.mock('react-redux', () => ({
  useSelector: (selector) =>
    selector({
      getTokenReducer: { userInformation: mockUserInformation },
    }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn() }),
}));

jest.mock('react-native-responsive-fontsize', () => ({
  RFValue: (value) => value,
}));

jest.mock('@sentry/react-native', () => ({
  captureException: (...args) => mockCaptureException(...args),
}));

jest.mock('../../../components/ProfileFeed', () => ({
  __esModule: true,
  default: (...args) => mockProfileFeed(...args),
}));

jest.mock('../../../components/UserInfos', () => 'UserInfos');
jest.mock('../../../components/Profile/Badges', () => ({
  __esModule: true,
  default: (...args) => mockBadges(...args),
}));
jest.mock('../../../components/Profile/EmptyComponent', () => 'EmptyComponent');
jest.mock('../../../highordercomponents', () => ({
  CustomText: 'CustomText',
  CustomTextBold: 'CustomTextBold',
}));

const FeedList = require('../../../components/Profile/FeedList').default;

const profile = {
  id: 42,
  username: 'mapilio-person',
  display_name: 'Mapilio Person',
  user_profile_photo: 'https://cdn.example.test/profile.jpg',
};

const scoreDetails = {
  point: 12,
  badges: [{ icon: 'https://cdn.example.test/badge.jpg' }],
};

const feedItem = {
  group_key: 'group-42',
  start_address: 'Mapilio Street',
  capture_time: '2026-09-07T10:00:00Z',
};

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0));

describe('FeedList profile hydration', () => {
  beforeEach(() => {
    mockUserInformation = null;
    mockGet.mockReset();
    mockProfileFeed.mockClear();
    mockBadges.mockClear();
    mockCaptureException.mockClear();
    global.toast.show.mockClear();
  });

  it('waits for a hydrated user id before fetching and renders the hydrated content', async () => {
    mockGet.mockImplementation((url) => {
      if (url.startsWith('/api/user-uploads-v2')) {
        return Promise.resolve({ data: [feedItem], pagination: { current_page: 1, last_page: 1 } });
      }
      return Promise.resolve(scoreDetails);
    });

    let tree;
    await act(async () => {
      tree = renderer.create(<FeedList />);
      await flushPromises();
    });

    expect(mockGet).not.toHaveBeenCalled();

    mockUserInformation = profile;
    await act(async () => {
      tree.update(<FeedList />);
      await flushPromises();
    });

    expect(mockGet).toHaveBeenCalledTimes(2);
    expect(mockGet).toHaveBeenCalledWith(
      '/api/user-uploads-v2?options[parameters][user_id]=42&options[limit]=10&page=1',
      expect.any(Object)
    );
    expect(mockGet).toHaveBeenCalledWith('/api/gamification/badges/42');
    expect(mockGet.mock.calls.flat().join(' ')).not.toContain('undefined');
    expect(mockProfileFeed).toHaveBeenCalledWith(
      expect.objectContaining({ data: feedItem, pressHandle: expect.any(Function) }),
      undefined
    );
    expect(mockBadges).toHaveBeenCalledWith({ badgeDetails: scoreDetails.badges }, undefined);
    expect(tree.root.findAllByType(ActivityIndicator)).toHaveLength(0);
  });

  it('ends the initial spinner when profile requests fail', async () => {
    mockUserInformation = profile;
    mockGet.mockRejectedValue(new Error('network unavailable'));

    let tree;
    await act(async () => {
      tree = renderer.create(<FeedList />);
      await flushPromises();
    });

    expect(tree.root.findAllByType(ActivityIndicator)).toHaveLength(0);
    expect(global.toast.show).toHaveBeenCalledWith('fetch_error', { type: 'error' });
  });

  it('ignores stale responses after an id change and cleanup', async () => {
    const pendingRequests = new Map();
    mockGet.mockImplementation(
      (url) => new Promise((resolve) => pendingRequests.set(url, resolve))
    );

    let tree;
    await act(async () => {
      tree = renderer.create(<FeedList userDetails={{ id: 'first', username: 'first-user' }} />);
      await flushPromises();
    });

    await act(async () => {
      tree.update(<FeedList userDetails={{ id: 'second', username: 'second-user' }} />);
      await flushPromises();
    });

    pendingRequests.get(
      '/api/user-uploads-v2?options[parameters][user_id]=first&options[limit]=10&page=1'
    )?.({ data: [{ ...feedItem, group_key: 'stale' }], pagination: null });
    pendingRequests.get('/api/gamification/badges/first')?.(scoreDetails);
    await act(async () => {
      await flushPromises();
    });
    expect(mockProfileFeed).not.toHaveBeenCalled();

    pendingRequests.get(
      '/api/user-uploads-v2?options[parameters][user_id]=second&options[limit]=10&page=1'
    )?.({ data: [feedItem], pagination: null });
    pendingRequests.get('/api/gamification/badges/second')?.(scoreDetails);
    await act(async () => {
      await flushPromises();
    });
    expect(mockProfileFeed).toHaveBeenCalledWith(
      expect.objectContaining({ data: feedItem }),
      undefined
    );

    await act(async () => {
      tree.update(<FeedList userDetails={{ id: 'third', username: 'third-user' }} />);
      await flushPromises();
    });
    const requestCountBeforeUnmount = mockGet.mock.calls.length;
    await act(async () => tree.unmount());
    pendingRequests.get(
      '/api/user-uploads-v2?options[parameters][user_id]=third&options[limit]=10&page=1'
    )?.({ data: [], pagination: null });
    pendingRequests.get('/api/gamification/badges/third')?.(scoreDetails);
    await act(async () => {
      await flushPromises();
    });
    expect(mockGet).toHaveBeenCalledTimes(requestCountBeforeUnmount);
  });
});
