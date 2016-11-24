import React, { Component } from 'react';
import {
  AppRegistry,
  AsyncStorage,
  Navigator,
  Platform
} from 'react-native';

import SplashScreen             from './views/SplashScreen';
import MainView                 from './views/MainView';
import SendServiceRequestView   from './views/SendServiceRequestView';
import ServiceRequestListView   from './views/ServiceRequestListView';
import IntroductionView         from './views/IntroductionView';
import ServiceRequestDetailView from './views/ServiceRequestDetailView';
import AppFeedbackView          from './views/AppFeedbackView';

class OpenCity extends Component {

  constructor(props, context) {
    super(props);
  }

  render() {
    return (
      <Navigator
        initialRoute={{id: 'SplashScreen'}}
        renderScene={this.navigatorRenderScene} />
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
    }
  }
}


AppRegistry.registerComponent('OpenCity', () => OpenCity);
