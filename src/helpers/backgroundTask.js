import React, {
  PushNotificationIOS,
  AppState
} from 'react-native';

import BackgroundGeolocation from 'react-native-background-geolocation';
import {forEach} from 'lodash';

import IssueList from '../components/Issue/IssueList';
import IssueDetail from '../components/Issue/IssueDetail';
import {findIssues, getIssueMetaData, setIssuesNotified} from './issue';
import translationsIssue from '../translations/issue';

let _appState = 'active';
let _navigator = null;

/**
 *
 * @param location
 * @private
 */
function _onLocationChanged(location) {
  console.log('_onLocationChanged', location);
}

/**
 *
 * @param location
 * @private
 */
function _onMotionChange(location) {
  console.log('_onMotionChange', location)

  if (_appState === 'background' && location.is_moving === false) {
    findIssues({
      lat: location.coords.latitude,
      lon: location.coords.longitude,
      distance: 1000,
      order_by: '-latest_decision_date',
      limit: 10
    })
      .then((result) => {
        getIssueMetaData().then((metaData) => {
          let newIssues = [];

          forEach(result.data.objects, (issue) => {
            if (!metaData[issue.id]) {
              newIssues.push(issue);
            }
          });

          if (newIssues.length === 1) {
            const issue = newIssues[0];
            PushNotificationIOS.presentLocalNotification({
              alertBody: translationsIssue.formatString(translationsIssue.issueNotificationTitleSingle, issue.subject),
              userInfo: {
                issues: [issue],
                position: location
              }
            });
          } else if (newIssues.length > 1) {
            PushNotificationIOS.presentLocalNotification({
              alertBody: translationsIssue.formatString(translationsIssue.issueNotificationTitleMultiple, newIssues.length),
              userInfo: {
                issues: newIssues,
                position: location
              }
            });
          }

          setIssuesNotified(newIssues);
        });
      })
      .catch(err => alert(err));
  }
}

/**
 *
 * @param notification
 * @private
 */
function _onNotification(notification) {
  const data = notification.getData();
  const issues = data.userInfo.issues;
  const position = data.userInfo.position;

  // Navigate to the issue, if the notification has only one issue attached to it.
  if (issues.length === 1) {
    _navigator.immediatelyResetRouteStack([{
      component: IssueList
    }, {
      component: IssueDetail,
      passProps: {
        issue: issues[0],
        position: position
      }
    }]);
  }
}

/**
 *
 * @param currentAppState
 * @private
 */
function _handleAppStateChange(currentAppState) {
  _appState = currentAppState;

  if (currentAppState === 'background') {
    BackgroundGeolocation.start();
  } else if (currentAppState === 'active') {
    BackgroundGeolocation.stop();
  }
}

/**
 *
 * @param navigator
 */
export function mountBackgroundTask(navigator) {
  _navigator = navigator;

  BackgroundGeolocation.configure({
    desiredAccuracy: 0,
    stationaryRadius: 100,
    distanceFilter: 500,
    locationUpdateInterval: 5000,
    minimumActivityRecognitionConfidence: 80,   // 0-100%.  Minimum activity-confidence for a state-change
    fastestLocationUpdateInterval: 5000,
    activityRecognitionInterval: 5000,
    stopDetectionDelay: 1,  // <--  minutes to delay after motion stops before engaging stop-detection system
    stopTimeout: 30, // 30 minutes
    activityType: 'Other',

    // Application config
    debug: false, // <-- enable this hear sounds for background-geolocation life-cycle.
    forceReloadOnLocationChange: false,  // <-- [Android] If the user closes the app **while location-tracking is started** , reboot app when a new location is recorded (WARNING: possibly distruptive to user)
    forceReloadOnMotionChange: false,    // <-- [Android] If the user closes the app **while location-tracking is started** , reboot app when device changes stationary-state (stationary->moving or vice-versa) --WARNING: possibly distruptive to user)
    forceReloadOnGeofence: false,        // <-- [Android] If the user closes the app **while location-tracking is started** , reboot app when a geofence crossing occurs --WARNING: possibly distruptive to user)
    stopOnTerminate: true,              // <-- [Android] Allow the background-service to run headless when user closes the app.
    startOnBoot: false                   // <-- [Android] Auto start background-service in headless mode when device is powered-up.
  });

  // This handler fires whenever bgGeo receives a location update.
  BackgroundGeolocation.on('location', _onLocationChanged);
  BackgroundGeolocation.on('motionchange', _onMotionChange);

  PushNotificationIOS.addEventListener('localNotification', _onNotification);
  AppState.addEventListener('change', _handleAppStateChange);
}

export function unmountBackgroundTask() {
  PushNotificationIOS.removeEventListener('localNotification', _onNotification);
  AppState.removeEventListener('change', _handleAppStateChange);
}