jest.mock('expo-localization', () => ({
  getLocales: jest.fn(),
}));

jest.mock('expo-updates', () => ({
  reloadAsync: jest.fn(),
}));

import { getLocales } from 'expo-localization';
import {
  ENABLED_LOCALES,
  FALLBACK_LOCALE,
  createLocaleSynchronizer,
  getInitialLocale,
  normalizeLocale,
  selectDeviceLocale,
  synchronizePersistedLocale,
  synchronizeLocale,
} from '../../localization/localization';

describe('localization policy', () => {
  test('keeps the enabled locale set at thirteen languages', () => {
    expect(ENABLED_LOCALES).toHaveLength(13);
    expect(ENABLED_LOCALES).toEqual(
      expect.arrayContaining([
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
      ])
    );
  });

  test('normalizes regional tags and falls back unsupported locales to English', () => {
    expect(normalizeLocale('pt-BR')).toBe('pt');
    expect(normalizeLocale({ languageCode: 'AR' })).toBe('ar');
    expect(normalizeLocale({ languageTag: 'de-DE' })).toBe('de');
    expect(normalizeLocale('ro')).toBe(FALLBACK_LOCALE);
    expect(normalizeLocale(undefined)).toBe(FALLBACK_LOCALE);
  });

  test('selects the first supported device locale', () => {
    expect(
      selectDeviceLocale([{ languageCode: 'ja' }, { languageCode: 'fr' }, { languageCode: 'en' }])
    ).toBe('fr');
  });

  test('uses English when the device has no supported locale or localization is unavailable', () => {
    expect(selectDeviceLocale([{ languageCode: 'ja' }])).toBe(FALLBACK_LOCALE);
    getLocales.mockImplementationOnce(() => {
      throw new Error('native localization unavailable');
    });
    expect(getInitialLocale()).toBe(FALLBACK_LOCALE);
  });

  test('changes i18next and requests one RTL reload when direction changes', async () => {
    const i18n = { changeLanguage: jest.fn().mockResolvedValue(undefined) };
    const i18nManager = {
      isRTL: false,
      allowRTL: jest.fn(),
      forceRTL: jest.fn(),
    };
    const reload = jest.fn().mockResolvedValue(undefined);

    await synchronizeLocale({ locale: 'ar', i18n, i18nManager, reload, reloadState: {} });

    expect(i18n.changeLanguage).toHaveBeenCalledWith('ar');
    expect(i18nManager.allowRTL).toHaveBeenCalledWith(true);
    expect(i18nManager.forceRTL).toHaveBeenCalledWith(true);
    expect(reload).toHaveBeenCalledTimes(1);
  });

  test('synchronizes an explicit hydrated choice without an unnecessary reload', async () => {
    const i18n = { changeLanguage: jest.fn().mockResolvedValue(undefined) };
    const i18nManager = {
      isRTL: false,
      allowRTL: jest.fn(),
      forceRTL: jest.fn(),
    };
    const reload = jest.fn();

    await synchronizeLocale({ locale: 'fr', i18n, i18nManager, reload });

    expect(i18n.changeLanguage).toHaveBeenCalledWith('fr');
    expect(reload).not.toHaveBeenCalled();
  });

  test('flushes persistence before a direction-changing reload', async () => {
    const order = [];
    const i18n = {
      changeLanguage: jest.fn().mockImplementation(async () => order.push('language')),
    };
    const i18nManager = {
      isRTL: false,
      allowRTL: jest.fn(),
      forceRTL: jest.fn(),
    };
    const flush = jest.fn().mockImplementation(async () => order.push('flush'));
    const reload = jest.fn().mockImplementation(async () => order.push('reload'));

    await synchronizePersistedLocale({
      locale: 'ar',
      flush,
      onNormalize: jest.fn(),
      i18n,
      i18nManager,
      reload,
      reloadState: {},
    });

    expect(order).toEqual(['flush', 'language', 'reload']);
  });

  test('normalizes a rehydrated unsupported locale before persisting or synchronizing it', async () => {
    const onNormalize = jest.fn();
    const flush = jest.fn();
    const i18n = { changeLanguage: jest.fn() };

    const result = await synchronizePersistedLocale({
      locale: 'ro',
      flush,
      onNormalize,
      i18n,
    });

    expect(result).toMatchObject({ locale: 'en', persisted: false });
    expect(onNormalize).toHaveBeenCalledWith('en');
    expect(flush).not.toHaveBeenCalled();
    expect(i18n.changeLanguage).not.toHaveBeenCalled();
  });

  test('does not request a second reload while the same direction change is pending', async () => {
    const i18n = { changeLanguage: jest.fn().mockResolvedValue(undefined) };
    const i18nManager = {
      isRTL: false,
      allowRTL: jest.fn(),
      forceRTL: jest.fn(),
    };
    const reload = jest.fn().mockResolvedValue(undefined);

    const reloadState = {};
    await synchronizeLocale({ locale: 'ar', i18n, i18nManager, reload, reloadState });
    await synchronizeLocale({ locale: 'ar', i18n, i18nManager, reload, reloadState });

    expect(reload).toHaveBeenCalledTimes(1);
  });

  test('serializes three generations when their persistence flushes resolve newest first', async () => {
    const deferred = () => {
      let resolve;
      const promise = new Promise((resolvePromise) => {
        resolve = resolvePromise;
      });
      return { promise, resolve };
    };
    const firstFlush = deferred();
    const secondFlush = deferred();
    const thirdFlush = deferred();
    let currentGeneration = 1;
    const i18n = {
      language: 'en',
      changeLanguage: jest.fn().mockImplementation(async (locale) => {
        i18n.language = locale;
      }),
    };
    const i18nManager = {
      isRTL: false,
      allowRTL: jest.fn(),
      forceRTL: jest.fn(),
    };
    const reload = jest.fn();
    const synchronizer = createLocaleSynchronizer();

    const firstSynchronization = synchronizer.enqueue({
      locale: 'ar',
      flush: () => firstFlush.promise,
      isCurrent: () => currentGeneration === 1,
      onNormalize: jest.fn(),
      i18n,
      i18nManager,
      reload,
      reloadState: {},
    });

    currentGeneration = 2;
    const secondSynchronization = synchronizer.enqueue({
      locale: 'en',
      flush: () => secondFlush.promise,
      isCurrent: () => currentGeneration === 2,
      onNormalize: jest.fn(),
      i18n,
      i18nManager,
      reload,
      reloadState: {},
    });

    currentGeneration = 3;
    const thirdSynchronization = synchronizer.enqueue({
      locale: 'fr',
      flush: () => thirdFlush.promise,
      isCurrent: () => currentGeneration === 3,
      onNormalize: jest.fn(),
      i18n,
      i18nManager,
      reload,
      reloadState: {},
    });

    thirdFlush.resolve();
    secondFlush.resolve();
    firstFlush.resolve();
    const results = await Promise.all([
      firstSynchronization,
      secondSynchronization,
      thirdSynchronization,
    ]);

    expect(results[0]).toMatchObject({ locale: 'ar', stale: true });
    expect(results[1]).toMatchObject({ locale: 'en', stale: true });
    expect(i18n.changeLanguage).toHaveBeenCalledTimes(1);
    expect(i18n.changeLanguage).toHaveBeenCalledWith('fr');
    expect(i18n.language).toBe('fr');
    expect(i18nManager.forceRTL).not.toHaveBeenCalled();
    expect(reload).not.toHaveBeenCalled();
  });

  test('runs the third generation after an older changeLanguage finishes stale', async () => {
    const deferred = () => {
      let resolve;
      const promise = new Promise((resolvePromise) => {
        resolve = resolvePromise;
      });
      return { promise, resolve };
    };
    const arabicChange = deferred();
    const arabicStarted = deferred();
    let generation = 1;
    const i18n = {
      language: 'en',
      changeLanguage: jest.fn((locale) => {
        if (locale === 'ar') {
          arabicStarted.resolve();
          return arabicChange.promise.then(() => {
            i18n.language = 'ar';
          });
        }

        i18n.language = locale;
        return Promise.resolve();
      }),
    };
    const i18nManager = {
      isRTL: false,
      allowRTL: jest.fn(),
      forceRTL: jest.fn(),
    };
    const reload = jest.fn();
    const synchronizer = createLocaleSynchronizer();

    const arabicSynchronization = synchronizer.enqueue({
      locale: 'ar',
      flush: jest.fn().mockResolvedValue(undefined),
      isCurrent: () => generation === 1,
      onNormalize: jest.fn(),
      i18n,
      i18nManager,
      reload,
      reloadState: {},
    });
    await arabicStarted.promise;
    expect(i18n.changeLanguage).toHaveBeenCalledWith('ar');

    generation = 2;
    const secondSynchronization = synchronizer.enqueue({
      locale: 'fr',
      flush: jest.fn().mockResolvedValue(undefined),
      isCurrent: () => generation === 2,
      onNormalize: jest.fn(),
      i18n,
      i18nManager,
      reload,
      reloadState: {},
    });

    generation = 3;
    const thirdSynchronization = synchronizer.enqueue({
      locale: 'en',
      flush: jest.fn().mockResolvedValue(undefined),
      isCurrent: () => generation === 3,
      onNormalize: jest.fn(),
      i18n,
      i18nManager,
      reload,
      reloadState: {},
    });

    arabicChange.resolve();
    const results = await Promise.all([
      arabicSynchronization,
      secondSynchronization,
      thirdSynchronization,
    ]);

    expect(results[0]).toMatchObject({ locale: 'ar', stale: true });
    expect(results[1]).toMatchObject({ locale: 'fr', stale: true });
    expect(i18n.changeLanguage.mock.calls.map(([locale]) => locale)).toEqual(['ar', 'en']);
    expect(i18n.language).toBe('en');
    expect(i18nManager.isRTL).toBe(false);
    expect(i18nManager.forceRTL).not.toHaveBeenCalled();
    expect(reload).not.toHaveBeenCalled();
  });
});
