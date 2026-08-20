const packageJson = require('../../package.json');
const fs = require('fs');
const path = require('path');
const appConfigSource = fs.readFileSync(path.join(__dirname, '../../app.config.js'), 'utf8');

const androidBuildGradle = fs.readFileSync(
  path.join(__dirname, '../../android/build.gradle'),
  'utf8'
);
const androidAppBuildGradle = fs.readFileSync(
  path.join(__dirname, '../../android/app/build.gradle'),
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
const iosPodfileProperties = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../../ios/Podfile.properties.json'), 'utf8')
);
const iosAppDelegate = fs.readFileSync(
  path.join(__dirname, '../../ios/Mapilio/AppDelegate.swift'),
  'utf8'
);
const iosProject = fs.readFileSync(
  path.join(__dirname, '../../ios/Mapilio.xcodeproj/project.pbxproj'),
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
  test('pins the SDK 57 and React Native 0.86 runtime pair', () => {
    expect(packageJson.dependencies.expo).toBe('~57.0.14');
    expect(packageJson.dependencies['react-native']).toBe('0.86.2');
    expect(packageJson.dependencies.react).toBe('19.2.3');
    expect(packageJson.devDependencies['jest-expo']).toBe('~57.0.0');
    expect(packageJson.devDependencies['@types/react']).toBe('~19.2.10');
    expect(packageJson.devDependencies['@react-native/babel-preset']).toBe('0.86.2');
    expect(packageJson.devDependencies['@react-native/jest-preset']).toBe('0.86.2');
    expect(packageJson.devDependencies['@react-native/metro-config']).toBe('0.86.2');
    expect(packageJson.devDependencies['@react-native/eslint-config']).toBe('0.86.2');
    expect(packageJson.devDependencies['@react-native/typescript-config']).toBe('0.86.2');
    expect(packageJson.engines.node).toBe('>=22.13 <25');
    expect(nodeVersion).toBe('22.13.0');
  });

  test('keeps native-sensitive integrations without the obsolete OneSignal patch', () => {
    expect(packageJson.dependencies['react-native-fs']).toBeUndefined();
    expect(packageJson.dependencies['@maplibre/maplibre-react-native']).toBe('11.3.6');
    expect(packageJson.dependencies['react-native-onesignal']).toBeDefined();
    expect(packageJson.dependencies['react-native-fbsdk-next']).toBeDefined();
    expect(packageJson.dependencies['expo-camera']).toBe('~57.0.3');
    expect(packageJson.dependencies['react-native-reanimated']).toBe('4.5.1');
    expect(packageJson.dependencies['react-native-worklets']).toBe('0.10.1');
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

  test('uses the SDK 57 Android toolchain and preserves New Architecture natively', () => {
    expect(appConfigSource).not.toContain('newArchEnabled');
    expect(appConfigSource).toContain('compileSdkVersion: 36');
    expect(appConfigSource).toContain('targetSdkVersion: 36');
    expect(appConfigSource).toContain("kotlinVersion: '2.1.20'");
    expect(androidGradleProperties).toContain('newArchEnabled=true');
    expect(androidGradleProperties).toContain('edgeToEdgeEnabled=true');
    expect(iosPodfileProperties.newArchEnabled).toBe('true');
    expect(androidGradleProperties).not.toContain('android.enableJetifier=true');
    expect(androidBuildGradle).not.toContain('kotlinVersion = findProperty');
    expect(androidAppBuildGradle).toContain("require.resolve('hermes-compiler/package.json'");
  });

  test('uses the SDK 57 Swift app delegate entry point', () => {
    expect(iosAppDelegate).toContain('@main');
    expect(iosAppDelegate).toContain('class AppDelegate: ExpoAppDelegate');
    expect(iosAppDelegate).toContain('ExpoReactNativeFactory(delegate: delegate)');
    expect(iosAppDelegate).toContain('delegate.dependencyProvider = RCTAppDependencyProvider()');
    expect(iosAppDelegate).toContain('withModuleName: "main"');
    expect(iosAppDelegate).toContain('forBundleRoot: ".expo/.virtual-metro-entry"');
    expect(iosAppDelegate).toContain(
      'Bundle.main.url(forResource: "main", withExtension: "jsbundle")'
    );
    expect(iosAppDelegate).toContain('RCTLinkingManager.application');
    expect(iosAppDelegate).toContain('didRegisterForRemoteNotificationsWithDeviceToken');
    expect(iosAppDelegate).not.toContain('EXAppDelegateWrapper');
    expect(iosProject).toContain('AppDelegate.swift in Sources');
    expect(iosProject).not.toMatch(/AppDelegate\.(h|mm)|main\.m|noop-file\.swift/);
    expect(fs.existsSync(path.join(__dirname, '../../ios/Mapilio/AppDelegate.h'))).toBe(false);
    expect(fs.existsSync(path.join(__dirname, '../../ios/Mapilio/AppDelegate.mm'))).toBe(false);
    expect(fs.existsSync(path.join(__dirname, '../../ios/Mapilio/main.m'))).toBe(false);
  });

  test('isolates SDK 57 updates from older native runtimes', () => {
    expect(appConfigSource).toContain("runtimeVersion: '4.0.0'");
    expect(appConfigSource).not.toContain("runtimeVersion: '1.0.0'");
    expect(androidManifest).toContain(
      'android:name="expo.modules.updates.EXPO_RUNTIME_VERSION" android:value="@string/expo_runtime_version"'
    );
    expect(androidStrings).toContain(
      '<string name="expo_runtime_version" translatable="false">4.0.0</string>'
    );
    expect(iosUpdatesConfig).toContain(
      '<key>EXUpdatesRuntimeVersion</key>\n    <string>4.0.0</string>'
    );
    expect(iosPodfileProperties['ios.deploymentTarget']).toBe('16.4');
    expect(appConfigSource).toContain("deploymentTarget: '16.4'");
    expect(iosProject).not.toMatch(/IPHONEOS_DEPLOYMENT_TARGET = (?!16\.4)[0-9.]+;/);
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
