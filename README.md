# Open City App

## Prequisites (Mac OS X)
You need Node version 5> and homebrew installed

Install watchman:
`brew install watchman`

## Getting started
Please read this page for more detailed instructions https://facebook.github.io/react-native/docs/getting-started.html

`git clone https://github.com/City-of-Helsinki/open-city-app`

`cd open-city-app`

`npm install`

`npm install -g react-native-cli`


Running on iOS simulator:
`react-native run-ios`

Running on android (you have to have a device connected which has developer mode enabled, or simulator running)

1. Generate a Google Maps Android API KEY and add it to AndroidManifest.xml

https://console.developers.google.com/apis/

2. Add fingerprint of debug keystore into Google API credentials

        keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android


`react-native run-android`

If you run debug build on device you have to forward the dev server port to the device:

`adb reverse tcp:8081 tcp:8081`

or

`adb -s <Device ID> reverse tcp:8081 tcp:8081` if multiple devices/simulators are connected

## HOX! Adding react-native libraries
Normally you would install a react-native package with `npm install react-native-<cool package> && rnpm link`. This will break the build currently because react-native-maps has a broken rnpm script. All native libraries have to be added manually into the build.

## Changing API urls
Edit `./src/config.js` to change API urls

## Building Android release

0. Make sure you can run the app with `react-native run-android`

1. Generate signing key and place it in ./android/app (don't lose this when publishing the app. You can't make updates for the app unless the signing key is the same as the last release)

        keytool -genkey -v -keystore my-release-key.keystore -alias open-city-app -keyalg RSA -keysize 2048 -validity 10000

1. Generate fingerprint from keystore and add it to your Google Maps API fingerprints
        keytool -list -v -keystore my-release-key.keystore -alias open-city-app -storepass <password> -keypass <password>

2. Add these lines into ~/.gradle/gradle.properties
        OPEN_CITY_APP_STORE_FILE=my-release-key.keystore
        OPEN_CITY_APP_KEY_ALIAS=open-city-app
        OPEN_CITY_APP_STORE_PASSWORD=**\*Keystore password\***
        OPEN_CITY_APP_KEY_PASSWORD=**\*Keystore password\***

3. Run `./gradlew assembleRelease` in ./android

## Building iOS release
TODO
