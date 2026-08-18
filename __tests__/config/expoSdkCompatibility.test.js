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
const androidManifest = fs.readFileSync(
  path.join(__dirname, '../../android/app/src/main/AndroidManifest.xml'),
  'utf8'
);
const androidStrings = fs.readFileSync(
  path.join(__dirname, '../../android/app/src/main/res/values/strings.xml'),
  'utf8'
);
const iosUpdatesConfig = fs.readFileSync(
  path.join(__dirname, '../../ios/Mapilio/Supporting/Expo.plist'),
  'utf8'
);
const gitignore = fs.readFileSync(path.join(__dirname, '../../.gitignore'), 'utf8');
const nodeVersion = fs.readFileSync(path.join(__dirname, '../../.nvmrc'), 'utf8').trim();
const storageModuleConfig = fs.readFileSync(
  path.join(__dirname, '../../modules/mapilio-storage/expo-module.config.json'),
  'utf8'
);
const storageModuleKotlin = fs.readFileSync(
  path.join(
    __dirname,
    '../../modules/mapilio-storage/android/src/main/java/expo/modules/mapiliostorage/MapilioStorageModule.kt'
  ),
  'utf8'
);

describe('Expo SDK compatibility contract', () => {
  test('pins the SDK 54 and React Native 0.81 runtime pair', () => {
    expect(packageJson.dependencies.expo).toBe('~54.0.0');
    expect(packageJson.dependencies['react-native']).toBe('0.81.5');
    expect(packageJson.dependencies.react).toBe('19.1.0');
    expect(packageJson.devDependencies['jest-expo']).toBe('~54.0.18');
    expect(packageJson.devDependencies['@types/react']).toBe('~19.1.10');
    expect(packageJson.devDependencies['@react-native/babel-preset']).toBe('0.81.5');
    expect(packageJson.devDependencies['@react-native/metro-config']).toBe('0.81.5');
    expect(packageJson.engines.node).toBe('>=22 <25');
    expect(nodeVersion).toBe('22');
  });

  test('keeps native-sensitive integrations without the obsolete OneSignal patch', () => {
    expect(packageJson.dependencies['react-native-fs']).toBeUndefined();
    expect(packageJson.dependencies['@maplibre/maplibre-react-native']).toBeDefined();
    expect(packageJson.dependencies['react-native-onesignal']).toBeDefined();
    expect(packageJson.dependencies['react-native-fbsdk-next']).toBeDefined();
    expect(packageJson.dependencies['expo-camera']).toBe('~17.0.10');
    expect(packageJson.dependencies['react-native-reanimated']).toBe('~4.1.1');
    expect(packageJson.dependencies['react-native-worklets']).toBe('0.5.1');
    expect(packageJson.dependencies['react-native-walkthrough-tooltip']).toBe('^1.6.0');
    expect(packageJson.dependencies['@lightbase/react-native-panorama-view']).toBeUndefined();
    expect(packageJson.scripts.postinstall).toBeUndefined();
  });

  test('uses the local Android storage module without broad storage permissions', () => {
    expect(appConfigSource).not.toContain('READ_EXTERNAL_STORAGE');
    expect(appConfigSource).not.toContain('WRITE_EXTERNAL_STORAGE');
    expect(androidManifest).toContain(
      '<manifest xmlns:android="http://schemas.android.com/apk/res/android" xmlns:tools="http://schemas.android.com/tools">'
    );
    expect(androidManifest).toContain(
      '<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" tools:node="remove"/>'
    );
    expect(androidManifest).toContain(
      '<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" tools:node="remove"/>'
    );
    expect(storageModuleConfig).toContain('"platforms": ["android"]');
    expect(storageModuleKotlin).toContain('AsyncFunction("getRemovableExternalFilesDir")');
    expect(storageModuleKotlin).toContain('Environment.isExternalStorageRemovable(directory)');
    expect(storageModuleKotlin).toContain(
      'Environment.getExternalStorageState(directory) == Environment.MEDIA_MOUNTED'
    );
    expect(
      fs.existsSync(path.join(__dirname, '../../modules/mapilio-storage/android/build.gradle'))
    ).toBe(true);
    expect(
      fs.existsSync(
        path.join(
          __dirname,
          '../../modules/mapilio-storage/android/src/main/java/expo/modules/mapiliostorage/MapilioStorageModule.kt'
        )
      )
    ).toBe(true);
  });

  test('uses the SDK 54 Android toolchain and New Architecture', () => {
    expect(appConfigSource).toContain('newArchEnabled: true');
    expect(appConfigSource).toContain('compileSdkVersion: 36');
    expect(appConfigSource).toContain('targetSdkVersion: 36');
    expect(appConfigSource).toContain("kotlinVersion: '2.1.20'");
    expect(androidGradleProperties).toContain('newArchEnabled=true');
    expect(androidGradleProperties).toContain('edgeToEdgeEnabled=true');
    expect(androidGradleProperties).not.toContain('android.enableJetifier=true');
    expect(androidBuildGradle).not.toContain('kotlinVersion = findProperty');
  });

  test('isolates SDK 54 updates from older native runtimes', () => {
    expect(appConfigSource).toContain("runtimeVersion: '2.0.0'");
    expect(appConfigSource).not.toContain("runtimeVersion: '1.0.0'");
    expect(androidManifest).toContain(
      'android:name="expo.modules.updates.EXPO_RUNTIME_VERSION" android:value="@string/expo_runtime_version"'
    );
    expect(androidStrings).toContain(
      '<string name="expo_runtime_version" translatable="false">2.0.0</string>'
    );
    expect(iosUpdatesConfig).toContain(
      '<key>EXUpdatesRuntimeVersion</key>\n    <string>2.0.0</string>'
    );
  });

  test('keeps reproducible native entry points under version control', () => {
    expect(
      fs.existsSync(
        path.join(__dirname, '../../android/app/src/main/java/com/mapilio/app/MainActivity.kt')
      )
    ).toBe(true);
    expect(
      fs.existsSync(
        path.join(__dirname, '../../android/app/src/main/java/com/mapilio/app/MainApplication.kt')
      )
    ).toBe(true);
    expect(fs.existsSync(path.join(__dirname, '../../ios/Podfile.lock'))).toBe(true);
    expect(gitignore).not.toMatch(/^android\/\*$/m);
    expect(gitignore).not.toMatch(/^ios\/Podfile\.lock$/m);
  });
});
