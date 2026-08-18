import { buildVectorTileUrl, probeVectorTile } from '../../util/mapOverlayHealth';

describe('buildVectorTileUrl', () => {
  it('fills all tile coordinate placeholders', () => {
    expect(
      buildVectorTileUrl('https://tiles.test/{z}/{x}/{y}.pbf', {
        zoom: 12,
        x: 2377,
        y: 1535,
      })
    ).toBe('https://tiles.test/12/2377/1535.pbf');
  });

  it('returns null when the template is missing', () => {
    expect(buildVectorTileUrl(undefined, { zoom: 1, x: 2, y: 3 })).toBeNull();
  });
});

describe('probeVectorTile', () => {
  const request = {
    template: 'https://tiles.test/{z}/{x}/{y}.pbf',
    coordinates: { zoom: 6, x: 37, y: 24 },
  };

  afterEach(() => {
    jest.useRealTimers();
  });

  it('uses a bounded HEAD request and reports success', async () => {
    const fetchImplementation = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
    });

    await expect(probeVectorTile({ ...request, fetchImplementation })).resolves.toEqual({
      available: true,
      reason: null,
      status: 200,
    });

    expect(fetchImplementation).toHaveBeenCalledWith(
      'https://tiles.test/6/37/24.pbf',
      expect.objectContaining({
        method: 'HEAD',
        signal: expect.objectContaining({ aborted: false }),
      })
    );
  });

  it('reports an HTTP failure without throwing', async () => {
    const fetchImplementation = jest.fn().mockResolvedValue({
      ok: false,
      status: 503,
    });

    await expect(probeVectorTile({ ...request, fetchImplementation })).resolves.toEqual({
      available: false,
      reason: 'http_error',
      status: 503,
    });
  });

  it('aborts a probe that exceeds its time limit', async () => {
    jest.useFakeTimers();
    const fetchImplementation = jest.fn(
      (url, options) =>
        new Promise((resolve, reject) => {
          options.signal.addEventListener('abort', () => {
            const error = new Error('aborted');
            error.name = 'AbortError';
            reject(error);
          });
        })
    );

    const result = probeVectorTile({
      ...request,
      timeoutMs: 100,
      fetchImplementation,
    });

    jest.advanceTimersByTime(100);

    await expect(result).resolves.toEqual({
      available: false,
      reason: 'timeout',
    });
  });

  it('reports a missing URL without making a request', async () => {
    const fetchImplementation = jest.fn();

    await expect(
      probeVectorTile({
        template: undefined,
        coordinates: request.coordinates,
        fetchImplementation,
      })
    ).resolves.toEqual({ available: false, reason: 'missing_url' });

    expect(fetchImplementation).not.toHaveBeenCalled();
  });
});
