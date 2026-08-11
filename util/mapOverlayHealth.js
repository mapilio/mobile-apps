const DEFAULT_TIMEOUT_MS = 5000;

export const buildVectorTileUrl = (template, {zoom, x, y}) => {
  if (!template) {
    return null;
  }

  return template
    .replace("{z}", String(zoom))
    .replace("{x}", String(x))
    .replace("{y}", String(y));
};

export const probeVectorTile = async ({
  template,
  coordinates,
  timeoutMs = DEFAULT_TIMEOUT_MS,
  fetchImplementation = fetch,
}) => {
  const url = buildVectorTileUrl(template, coordinates);

  if (!url) {
    return {available: false, reason: "missing_url"};
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetchImplementation(url, {
      method: "HEAD",
      headers: {
        Accept: "application/vnd.mapbox-vector-tile",
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      return {
        available: false,
        reason: "http_error",
        status: response.status,
      };
    }

    return {available: true, reason: null, status: response.status};
  } catch (error) {
    return {
      available: false,
      reason: error?.name === "AbortError" ? "timeout" : "network_error",
    };
  } finally {
    clearTimeout(timeout);
  }
};
