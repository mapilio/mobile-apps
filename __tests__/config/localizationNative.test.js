jest.mock('expo-localization', () => ({
  getLocales: jest.fn(() => [{ languageCode: 'en' }]),
}));

jest.mock('expo-updates', () => ({
  reloadAsync: jest.fn(),
}));

const fs = require('fs');
const path = require('path');
const { ENABLED_LOCALES } = require('../../localization/localization');
const appConfig = require('../../app.config');

const root = path.join(__dirname, '../..');
const read = (...parts) => fs.readFileSync(path.join(root, ...parts), 'utf8');

const extractPlistArray = (source, key) => {
  const section = source.match(new RegExp(`<key>${key}</key>\\s*<array>([\\s\\S]*?)</array>`));
  return [...section[1].matchAll(/<string>([^<]+)<\/string>/g)].map((match) => match[1]);
};

const extractAndroidLocales = (source) =>
  [...source.matchAll(/<locale android:name="([^"]+)"\s*\/>/g)].map((match) => match[1]);

const extractGradleConfigurations = (source) => {
  const declaration = source.match(/resourceConfigurations\s*\+=\s*\[([^\]]+)\]/);
  return [...declaration[1].matchAll(/"([^"]+)"/g)].map((match) => match[1]);
};

const expectExactLocales = (actual) => {
  expect(actual).toEqual(ENABLED_LOCALES);
  expect(new Set(actual).size).toBe(actual.length);
};

describe('native localization declarations', () => {
  test('declares one exact locale list across JavaScript, app config, iOS, Android, and Gradle', () => {
    const localizationPlugin = appConfig.expo.plugins.find(
      (plugin) => Array.isArray(plugin) && plugin[0] === 'expo-localization'
    );
    const iosLocales = extractPlistArray(
      read('ios', 'Mapilio', 'Info.plist'),
      'CFBundleLocalizations'
    );
    const androidLocales = extractAndroidLocales(
      read('android', 'app', 'src', 'main', 'res', 'xml', 'locales_config.xml')
    );
    const gradleConfigurations = extractGradleConfigurations(
      read('android', 'app', 'build.gradle')
    );

    expectExactLocales(localizationPlugin[1].supportedLocales);
    expectExactLocales(iosLocales);
    expectExactLocales(androidLocales);
    expect(gradleConfigurations).toEqual(ENABLED_LOCALES.map((locale) => `b+${locale}`));
    expect(new Set(gradleConfigurations).size).toBe(gradleConfigurations.length);
  });

  test('enables Android per-app locale and RTL configuration', () => {
    const manifest = read('android', 'app', 'src', 'main', 'AndroidManifest.xml');

    expect(manifest).toContain('android:supportsRtl="true"');
    expect(manifest).toContain('android:localeConfig="@xml/locales_config"');
    expect(manifest).toContain('locale|layoutDirection');
  });

  test('keeps the OTA runtime version aligned across config and native files', () => {
    expect(appConfig.expo.runtimeVersion).toBe('5.0.0');
    expect(read('ios', 'Mapilio', 'Supporting', 'Expo.plist')).toContain('<string>5.0.0</string>');
    expect(read('android', 'app', 'src', 'main', 'res', 'values', 'strings.xml')).toContain(
      '<string name="expo_runtime_version" translatable="false">5.0.0</string>'
    );
  });
});
