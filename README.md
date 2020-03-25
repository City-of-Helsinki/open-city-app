# Open City App


## Prequisites (Mac OS X)

- You need to have installed:
  - [Node](https://nodejs.org/en/) version 5>
  - [Homebrew](http://brew.sh/)
- Install [Watchman](https://facebook.github.io/watchman/):
`brew install watchman`


## Getting started

Please read [Getting Started with React Native](https://facebook.github.io/react-native/docs/getting-started.html) for more detailed instructions on how to setup the tools.

`git clone https://github.com/City-of-Helsinki/open-city-app`

`cd open-city-app`

`npm install`

`npm install -g react-native-cli`


Running on iOS simulator:
`react-native run-ios`

Running on Android (you have to have a device connected which has developer mode enabled, or simulator running)

1. `cp ./android/app/src/main/res/values/api-keys.example.xml ./android/app/src/main/res/values/api-keys.xml`

2. Generate a Google Maps Android API KEY (available from [Google API Library](https://console.developers.google.com/apis/)) and add it to `/android/app/src/main/res/values/api-keys.xml`

3. Add fingerprint of debug keystore into Google API credentials

        keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android

4. Add API key for sending service requests. It needs to be added to `config.json` as the value for `OPEN311_SEND_SERVICE_API_KEY`.


`react-native run-android`

If you run debug build on device you have to forward the dev server port to the device:

`adb reverse tcp:8081 tcp:8081`

or

`adb -s <Device ID> reverse tcp:8081 tcp:8081` if multiple devices/simulators are connected.


## HOX! Adding new react-native bridge libraries

You might have to add native dependencies manually.
Using rnpm might break react-native-maps setup.

To link libraries with rnpm run: `rnpm link`


## Changing API urls

Edit `./src/config.js` to change API urls.


## Building Android release

0. Make sure you can run the app with `react-native run-android`

1. Generate signing key and place it in ./android/app (don't lose this when publishing the app. You can't make updates for the app unless the signing key is the same as the last release)

        `keytool -genkey -v -keystore my-release-key.keystore -alias open-city-app -keyalg RSA -keysize 2048 -validity 10000`

1. Generate fingerprint from keystore and add it to your Google Maps API fingerprints

        `keytool -list -v -keystore my-release-key.keystore -alias open-city-app -storepass PASSWORD -keypass PASSWORD`

2. Add these lines into `~/.gradle/gradle.properties`

```
OPEN_CITY_APP_STORE_FILE=my-release-key.keystore
OPEN_CITY_APP_KEY_ALIAS=open-city-app
OPEN_CITY_APP_STORE_PASSWORD=**\*Keystore password\***
OPEN_CITY_APP_KEY_PASSWORD=**\*Keystore password\***
```

3. Run `./gradlew assembleRelease` in ./android


## Building iOS release

_TODO_

## Developing Components with [Storybook](https://storybook.js.org)

1. Write stories in `storybook/stories/<component-name>/`

2. Start storybook

      `npm run storybook`

3. Run the app `react-native run-ios` to see your stories on the device. To preserve storybook state while making changes, enable hot reload from development menu

4. Optionally, navigate to [localhost:7007](localhost:7007) to see stories
