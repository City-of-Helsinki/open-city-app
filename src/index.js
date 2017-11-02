import React, { Component } from 'react';
import {
  AppRegistry,
  AsyncStorage,
  Platform,
  BackAndroid
} from 'react-native';
import 'core-js';

import { Navigator } from 'react-native-deprecated-custom-components';
import { default as FCM, FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType } from 'react-native-fcm';
import { Provider } from 'react-redux';
import { OidcProvider } from 'redux-oidc';
import store from './redux/store';
import userManager from './util/userManager';
import './util/notificationHandler';
import { default as AuthActions } from './redux/auth/actions';

import ConnectedAuthView        from './views/AuthView';
import SplashScreen             from './views/SplashScreen';
import MainView                 from './views/MainView';
import SendServiceRequestView   from './views/SendServiceRequestView';
import ServiceRequestListView   from './views/ServiceRequestListView';
import IntroductionView         from './views/IntroductionView';
import ServiceRequestDetailView from './views/ServiceRequestDetailView';
import AppFeedbackView          from './views/AppFeedbackView';
import ImageView                from './views/ImageView';
import Global                   from './util/globals';


class OpenCity extends Component {

  constructor(props, context) {
    super(props);
  }

  componentDidMount() {
      FCM.requestPermissions().then(()=>console.log('granted')).catch(()=>console.log('notification permission rejected'));
      FCM.getFCMToken().then(token => {
          console.log("got notification token", token)
          store.dispatch(AuthActions.updateUser({
            "firebase_token": token,
            "language": "fi",
            "contact_method": "firebase"
          }))
      });

      this.notificationListener = FCM.on(FCMEvent.Notification, async (notif) => {
          // optional, do some component related stuff
      });

      // initial notification contains the notification that launches the app. Fired even when app is opened via the regular app icon
      FCM.getInitialNotification().then(notif=>{
         console.log("initial notif", notif)
      });
  }

  componentWillUnmount() {
      // stop listening for events
      this.notificationListener.remove();
  }


  render() {
    return (
      <Provider store={store} >
        <OidcProvider store={store} userManager={userManager}>
          <ConnectedAuthView enabled={true}>
            <Navigator
              initialRoute={{id: 'SplashScreen'}}
              renderScene={this.navigatorRenderScene} />
          </ConnectedAuthView>
        </OidcProvider>
      </Provider>
    );
  }

  navigatorRenderScene(route, navigator) {
    _navigator = navigator;
    switch (route.id) {
      case 'SplashScreen':
        return(<SplashScreen navigator={navigator} route={route} title='SplashScreen' />);
      case 'IntroductionView':
        return(<IntroductionView navigator={navigator} route={route} title='IntroductionView' />);
      case 'MainView':
        return(<MainView navigator={navigator} route={route} title='MainView' />);
      case 'SendServiceRequestView':
        return(<SendServiceRequestView navigator={navigator} route={route} title='SendServiceRequestView' />);
      case 'ServiceRequestListView':
        return(<ServiceRequestListView navigator={navigator} route={route} title='ServiceRequestListView' />);
      case 'ServiceRequestDetailView':
        return(<ServiceRequestDetailView navigator={navigator} route={route} title='ServiceRequestDetailView' />);
      case 'AppFeedbackView':
        return(<AppFeedbackView navigator={navigator} route={route} title='AppFeedbackView' />);
      case 'ImageView':
        return(<ImageView navigator={navigator} route={route} title='ImageView' />);
      default:
        return(<MainView navigator={navigator} route={route} title='MainView' />);
    }
  }
}

BackAndroid.addEventListener('hardwareBackPress', function() {

  // If drawer is open, close it
  if (Global.menuOpen && Global.menuRef !== null) {
    Global.menuRef.close();
    return true;

    // If a marker popup is open, close it
  } else if (Global.isMainView && Global.mainViewRef && Global.mainViewRef.state.showPopup) {
    Global.mainViewRef.setState({ showPopup:false });
    return true;

    // If map view is active, exit the app
  } else if (Global.isMainView) {
    BackAndroid.exitApp();

    // If the view is anyother than MapView, pop to the previous view
  } else if (!Global.isMainView) {
    Global.navigatorRef.pop();
    return true;
  }

  return false;
});


AppRegistry.registerComponent('OpenCity', () => OpenCity);
