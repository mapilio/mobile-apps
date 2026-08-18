jest.mock('react-native-permissions', () => ({
  check: jest.fn(),
  request: jest.fn(),
  requestMultiple: jest.fn(),
  PERMISSIONS: { IOS: {}, ANDROID: {} },
  RESULTS: { GRANTED: 'granted', LIMITED: 'limited', DENIED: 'denied' },
}));

jest.mock('../../store/store', () => ({
  store: {
    getState: () => ({
      getTokenReducer: {
        auth: { access_token: 'test-token' },
        userInformation: { email: 'test@example.com' },
      },
      generalReducer: { connection: { connectionType: 'wifi' } },
    }),
  },
}));

jest.mock('i18next', () => ({
  t: (key) => key,
}));

jest.mock('../../db', () => ({
  runAsync: jest.fn().mockResolvedValue(undefined),
  getCapturesBySequenceIdAsync: jest.fn().mockResolvedValue([]),
  deleteById: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../../util/fs', () => ({
  DocumentDirectoryPath: '/mock/docs',
  stat: jest.fn().mockResolvedValue({ path: 'file:///mock/docs/test.jpg', size: 1024 }),
  getAllExternalFilesDirs: jest.fn().mockResolvedValue(['/ext0', '/ext1']),
  exists: jest.fn().mockResolvedValue(false),
  unlink: jest.fn().mockResolvedValue(undefined),
}));

const mockCdnPost = jest.fn();
jest.mock('../../util/helpers/api', () => ({
  cdn: { post: (...args) => mockCdnPost(...args) },
  api: { post: jest.fn() },
}));

jest.mock('@sentry/react-native', () => ({
  captureException: jest.fn(),
}));

import db from '../../db';
import {
  deleteSequence,
  getHash,
  imageryUpload,
  percentage,
  remainingImages,
} from '../../helper/upload';

const mockImage = {
  id: 1,
  path: 'seq/test.jpg',
  hash: null,
  default_storage_path: 'internal',
  project_key: null,
  organization_key: null,
};

describe('getHash', () => {
  beforeEach(() => {
    mockCdnPost.mockReset();
  });

  it('returns success and hash when server responds with files array', async () => {
    mockCdnPost.mockResolvedValue({ files: [{ hash: 'abc123' }] });
    const result = await getHash(mockImage);
    expect(result).toEqual({ status: 'success', hash: 'abc123' });
  });

  it('returns error instead of crashing when server response has no files array', async () => {
    mockCdnPost.mockResolvedValue({});
    const result = await getHash(mockImage);
    expect(result.status).toBe('error');
  });

  it('returns error instead of crashing when files array is empty', async () => {
    mockCdnPost.mockResolvedValue({ files: [] });
    const result = await getHash(mockImage);
    expect(result.status).toBe('error');
  });

  it('returns error instead of crashing when files[0] has no hash', async () => {
    mockCdnPost.mockResolvedValue({ files: [{}] });
    const result = await getHash(mockImage);
    expect(result.status).toBe('error');
  });

  it('skips CDN call and returns success when image already has a hash', async () => {
    const result = await getHash({ ...mockImage, hash: 'existing-hash' });
    expect(result).toEqual({ status: 'success', hash: 'existing-hash' });
    expect(mockCdnPost).not.toHaveBeenCalled();
  });
});

describe('upload progress helpers', () => {
  it('returns zero percentage when the total is zero', () => {
    expect(percentage(0, 0)).toBe(0);
  });

  it('clamps percentage to 100 when sent exceeds the total', () => {
    expect(percentage(12, 10)).toBe(100);
  });

  it('clamps percentage to zero for negative progress', () => {
    expect(percentage(-1, 10)).toBe(0);
  });

  it('returns zero for non-finite progress values', () => {
    expect(percentage(Number.NaN, 10)).toBe(0);
    expect(percentage(1, Number.POSITIVE_INFINITY)).toBe(0);
  });

  it('clamps remaining images to zero when sent exceeds the total', () => {
    expect(remainingImages(10, 12)).toBe(0);
  });

  it('returns zero remaining images for non-finite values', () => {
    expect(remainingImages(Number.NaN, 1)).toBe(0);
    expect(remainingImages(10, Number.POSITIVE_INFINITY)).toBe(0);
  });
});

describe('group-scoped sequence deletion', () => {
  beforeEach(() => {
    db.getCapturesBySequenceIdAsync.mockClear();
  });

  it('filters direct sequence deletion by group when provided', async () => {
    await deleteSequence('sequence-1', 'group-1');

    expect(db.getCapturesBySequenceIdAsync).toHaveBeenCalledWith('sequence-1', 'id ASC', 'group-1');
  });

  it('propagates the group when imagery upload deletes a short sequence', async () => {
    await imageryUpload([], 'sequence-1', 'group-1');

    expect(db.getCapturesBySequenceIdAsync).toHaveBeenCalledWith('sequence-1', 'id ASC', 'group-1');
  });

  it('preserves ungrouped sequence deletion', async () => {
    await deleteSequence('sequence-1');

    expect(db.getCapturesBySequenceIdAsync).toHaveBeenCalledWith('sequence-1', 'id ASC', null);
  });
});
