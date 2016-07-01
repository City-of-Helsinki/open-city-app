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

`react-native run-android`

## HOX! Adding react-native libraries
Normally you would install a react-native package with `npm install react-native-<cool package> && rnpm link`. This will break the build currently because react-native-maps has a broken rnpm script. All native libraries have to be added manually into the build.

## Building Android release

0. Make sure you can run the app with `react-native run-android`

1. Generate signing key and place it in ./android/app

`keytool -genkey -v -keystore my-release-key.keystore -alias open-city-app -keyalg RSA -keysize 2048 -validity 10000`

2. Add these lines into ~/.gradle/gradle.properties

OPEN_CITY_APP_STORE_FILE=my-release-key.keystore

OPEN_CITY_APP_KEY_ALIAS=open-city-app

OPEN_CITY_APP_STORE_PASSWORD=**\*Keystore password\***

OPEN_CITY_APP_KEY_PASSWORD=**\*Keystore password\***

3. Run `./gradlew assembleRelease` in ./android

## Building iOS release
TODO
