const packageJson = require('../../package.json');
const fs = require('fs');
const path = require('path');
const appConfigSource = fs.readFileSync(path.join(__dirname, '../../app.config.js'), 'utf8');

const androidBuildGradle = fs.readFileSync(
  path.join(__dirname, '../../android/build.gradle'),
  'utf8'
);
const androidGradleProperties = fs.readFileSync(
  path.join(__dirname, '../../android/gradle.properties'),
  'utf8'
);

describe('Expo SDK compatibility contract', () => {
  test('pins the SDK 53 and React Native 0.79 runtime pair', () => {
    expect(packageJson.dependencies.expo).toBe('~53.0.0');
    expect(packageJson.dependencies['react-native']).toBe('0.79.6');
    expect(packageJson.dependencies.react).toBe('19.0.0');
    expect(packageJson.devDependencies['jest-expo']).toBe('~53.0.14');
    expect(packageJson.devDependencies['@types/react']).toBe('~19.0.10');
  });

  test('keeps native-sensitive integrations without the obsolete OneSignal patch', () => {
    expect(packageJson.dependencies['@maplibre/maplibre-react-native']).toBeDefined();
    expect(packageJson.dependencies['react-native-onesignal']).toBeDefined();
    expect(packageJson.dependencies['react-native-fbsdk-next']).toBeDefined();
    expect(packageJson.dependencies['expo-camera']).toBe('~16.1.11');
    expect(packageJson.dependencies['react-native-reanimated']).toBe('~3.17.4');
    expect(packageJson.scripts.postinstall).toBeUndefined();
  });

  test('uses the SDK 53 Android Kotlin toolchain without legacy Jetifier', () => {
    expect(androidBuildGradle).toContain(
      "kotlinVersion = findProperty('android.kotlinVersion') ?: '2.0.21'"
    );
    expect(appConfigSource).toContain("kotlinVersion: '2.0.21'");
    expect(androidGradleProperties).not.toContain('android.enableJetifier=true');
  });
});
