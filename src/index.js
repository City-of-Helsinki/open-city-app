import React, { Component } from 'react';
import {
  AppRegistry,
  AsyncStorage,
  Platform,
  BackHandler
} from 'react-native';

// import {
//   Navigator
// } from 'react-native-deprecated-custom-components';

import SplashScreen             from './views/SplashScreen';
import MainView                 from './views/MainView';
import SendServiceRequestView   from './views/SendServiceRequestView';
import ServiceRequestListView   from './views/ServiceRequestListView';
import IntroductionView         from './views/IntroductionView';
import ServiceRequestDetailView from './views/ServiceRequestDetailView';
import AppFeedbackView          from './views/AppFeedbackView';
import ImageView                from './views/ImageView';
import Global                   from './util/globals';

import { Navigator } from './navigation';

class OpenCity extends Component<{}> {

  constructor(props, context) {
    super(props);
  }

  render() {
    return (
      <Navigator />
    );
  }

  // navigatorRenderScene(route, navigator) {
  //   _navigator = navigator;
  //   switch (route.id) {
  //     case 'SplashScreen':
  //       return(<SplashScreen navigator={navigator} route={route} title='SplashScreen' />);
  //     case 'IntroductionView':
  //       return(<IntroductionView navigator={navigator} route={route} title='IntroductionView' />);
  //     case 'MainView':
  //       return(<MainView navigator={navigator} route={route} title='MainView' />);
  //     case 'SendServiceRequestView':
  //       return(<SendServiceRequestView navigator={navigator} route={route} title='SendServiceRequestView' />);
  //     case 'ServiceRequestListView':
  //       return(<ServiceRequestListView navigator={navigator} route={route} title='ServiceRequestListView' />);
  //     case 'ServiceRequestDetailView':
  //       return(<ServiceRequestDetailView navigator={navigator} route={route} title='ServiceRequestDetailView' />);
  //     case 'AppFeedbackView':
  //       return(<AppFeedbackView navigator={navigator} route={route} title='AppFeedbackView' />);
  //     case 'ImageView':
  //       return(<ImageView navigator={navigator} route={route} title='ImageView' />);
  //   }
  // }
}

BackHandler.addEventListener('hardwareBackPress', function() {

  // Refactor after adding redux
  // If drawer is open, close it
  // if (Global.menuOpen && Global.menuRef !== null) {
  //   Global.menuRef.close();
  //   return true;
  //
  //   // If a marker popup is open, close it
  // } else if (Global.isMainView && Global.mainViewRef && Global.mainViewRef.state.showPopup) {
  //   Global.mainViewRef.setState({ showPopup:false });
  //   return true;
  //
  //   // If map view is active, exit the app
  // } else if (Global.isMainView) {
  //   BackHandler.exitApp();
  //
  //   // If the view is anyother than MapView, pop to the previous view
  // } else if (!Global.isMainView) {
  //   Global.navigatorRef.pop();
  //   return true;
  // }
  BackHandler.exitApp();
  return false;
});


AppRegistry.registerComponent('OpenCity', () => OpenCity);
