import * as Localization from 'expo-localization';
import { I18nManager } from 'react-native';
import * as Updates from 'expo-updates';

export const ENABLED_LOCALES = [
  'cs',
  'da',
  'el',
  'es',
  'fi',
  'fr',
  'it',
  'pt',
  'ru',
  'tr',
  'en',
  'de',
  'ar',
];

export const FALLBACK_LOCALE = 'en';
export const RTL_LOCALES = new Set(['ar']);

const getLanguageCode = (locale) => {
  if (typeof locale === 'string') {
    return locale;
  }

  return locale?.languageCode || locale?.languageTag;
};

export const normalizeLocale = (locale) => {
  const languageCode = getLanguageCode(locale);
  const normalized = languageCode?.toLowerCase().split(/[-_]/)[0];

  return ENABLED_LOCALES.includes(normalized) ? normalized : FALLBACK_LOCALE;
};

export const selectDeviceLocale = (locales = Localization.getLocales()) => {
  const deviceLocales = Array.isArray(locales) ? locales : [];
  const supportedLocale = deviceLocales.find((locale) => {
    const languageCode = getLanguageCode(locale);
    const normalized = languageCode?.toLowerCase().split(/[-_]/)[0];
    return ENABLED_LOCALES.includes(normalized);
  });

  return normalizeLocale(supportedLocale);
};

export const getInitialLocale = () => {
  try {
    return selectDeviceLocale();
  } catch {
    return FALLBACK_LOCALE;
  }
};

export const synchronizeLocale = async ({
  locale,
  i18n,
  i18nManager = I18nManager,
  reload = () => Updates.reloadAsync(),
  reloadState = {},
  isCurrent = () => true,
}) => {
  const normalizedLocale = normalizeLocale(locale);

  if (!isCurrent()) {
    return { locale: normalizedLocale, reloadRequired: false, stale: true };
  }

  const shouldUseRTL = RTL_LOCALES.has(normalizedLocale);
  const directionChanged = i18nManager.isRTL !== shouldUseRTL;

  await i18n.changeLanguage(normalizedLocale);

  if (!isCurrent()) {
    return { locale: normalizedLocale, reloadRequired: false, stale: true };
  }

  if (!directionChanged || reloadState.pendingDirection === shouldUseRTL) {
    return { locale: normalizedLocale, reloadRequired: false };
  }

  reloadState.pendingDirection = shouldUseRTL;
  i18nManager.allowRTL(shouldUseRTL);
  i18nManager.forceRTL(shouldUseRTL);

  try {
    await reload();
  } catch (error) {
    reloadState.pendingDirection = undefined;
    throw error;
  }

  return { locale: normalizedLocale, reloadRequired: true };
};

export const synchronizePersistedLocale = async ({
  locale,
  flush,
  onNormalize,
  ...synchronizationOptions
}) => {
  const normalizedLocale = normalizeLocale(locale);

  if (locale !== normalizedLocale) {
    if (synchronizationOptions.isCurrent && !synchronizationOptions.isCurrent()) {
      return { locale: normalizedLocale, persisted: false, reloadRequired: false, stale: true };
    }

    onNormalize(normalizedLocale);
    return { locale: normalizedLocale, persisted: false, reloadRequired: false };
  }

  await flush();

  if (synchronizationOptions.isCurrent && !synchronizationOptions.isCurrent()) {
    return { locale: normalizedLocale, persisted: true, reloadRequired: false, stale: true };
  }

  const result = await synchronizeLocale({ locale: normalizedLocale, ...synchronizationOptions });
  return { ...result, persisted: true };
};

export const createLocaleSynchronizer = () => {
  let queue = Promise.resolve();
  const reloadState = {};

  return {
    enqueue(options) {
      const operation = queue.then(() => synchronizePersistedLocale({ reloadState, ...options }));
      queue = operation.catch(() => undefined);
      return operation;
    },
  };
};
