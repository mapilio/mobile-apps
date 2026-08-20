export const toMapLibrePaint = (style = {}) =>
  Object.fromEntries(
    Object.entries(style).map(([key, value]) => [
      key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`),
      value,
    ])
  );
