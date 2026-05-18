const { config } = require('dotenv');

config();

module.exports = {
  expo: {
    name: 'Mapilio',
    slug: 'mapilio',
    scheme: 'mapilio',
    version: '1.2.1',
    orientation: 'portrait',
    icon: './assets/playstore.png',
    userInterfaceStyle: 'light',
    updates: {
      fallbackToCacheTimeout: 0,
      url: `https://u.expo.dev/${process.env.EAS_PROJECT_ID}`,
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      requireFullScreen: true,
      bundleIdentifier: 'com.mapilio.main',
      infoPlist: {
        UIBackgroundModes: ['location', 'fetch', 'remote-notification', 'audio'],
        NSCameraUsageDescription: '$(PRODUCT_NAME) needs access to your Camera.',
        NSPhotoLibraryUsageDescription: '$(PRODUCT_NAME) needs access to your Photo Library.',
        SKAdNetworkItems: [
          { SKAdNetworkIdentifier: 'v9wttpbfk9.skadnetwork' },
          { SKAdNetworkIdentifier: 'n38lu8286q.skadnetwork' },
        ],
      },
      runtimeVersion: '1.0.0',
    },
    android: {
      permissions: [
        'android.permission.CAMERA',
        'android.permission.RECORD_AUDIO',
        'android.permission.ACCESS_COARSE_LOCATION',
        'android.permission.ACCESS_FINE_LOCATION',
        'android.permission.INTERNET',
        'android.permission.WRITE_EXTERNAL_STORAGE',
        'android.permission.READ_EXTERNAL_STORAGE',
      ],
      icon: './assets/playstore.png',
      package: 'com.mapilio.app',
      versionCode: 70,
    },
    web: {
      favicon: './assets/favicon.png',
    },
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    plugins: [
      [
        'onesignal-expo-plugin',
        {
          mode: 'production',
        },
      ],
      [
        'expo-camera',
        {
          cameraPermission: 'Allow $(PRODUCT_NAME) to access your camera',
          microphonePermission: 'Allow $(PRODUCT_NAME) to access your microphone',
          recordAudioAndroid: false,
        },
      ],
      ['@maplibre/maplibre-react-native'],
      [
        'expo-location',
        {
          locationAlwaysAndWhenInUsePermission: 'Allow $(PRODUCT_NAME) to use your location.',
        },
      ],
      [
        'react-native-permissions',
        {
          iosPermissions: [
            'Camera',
            'Microphone',
            'PhotoLibraryAddOnly',
            'PhotoLibrary',
            'LocationAlways',
            'LocationWhenInUse',
          ],
        },
      ],
      [
        'expo-screen-orientation',
        {
          initialOrientation: 'PORTRAIT_UP',
        },
      ],
      [
        '@react-native-google-signin/google-signin',
        {
          iosUrlScheme: process.env.GOOGLE_IOS_URL_SCHEME,
        },
      ],
      [
        'expo-build-properties',
        {
          android: {
            compileSdkVersion: 35,
            targetSdkVersion: 35,
            minSdkVersion: 24,
            buildToolsVersion: '35.0.0',
            kotlinVersion: '1.9.25',
          },
          ios: {
            deploymentTarget: '15.1',
          },
        },
      ],
      [
        'react-native-fbsdk-next',
        {
          appID: process.env.FACEBOOK_APP_ID,
          displayName: 'Mapilio',
          clientToken: process.env.FACEBOOK_CLIENT_TOKEN,
          scheme: `fb${process.env.FACEBOOK_APP_ID}`,
        },
      ],
    ],
    extra: {
      eas: {
        projectId: process.env.EAS_PROJECT_ID,
      },
    },
  },
};
