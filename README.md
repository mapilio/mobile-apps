The following codes should be added to the "android/app/build.gradle" file, starting from the 1st line.

``` 
buildscript {
    repositories {
        gradlePluginPortal()
    }
    dependencies {
        classpath 'gradle.plugin.com.onesignal:onesignal-gradle-plugin:[0.12.10, 0.99.99]'
    }
}

apply plugin: 'com.onesignal.androidsdk.onesignal-gradle-plugin'

```
