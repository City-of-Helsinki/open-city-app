import React, { Component } from 'react';
import {
  AppRegistry,
  AsyncStorage,
  Navigator,
  Platform
} from 'react-native';

import SplashScreen from './views/SplashScreen';
import MainView     from './views/MainView';
import FeedbackView from './views/FeedbackView';

console.disableYellowBox = true;

class OpenCity extends Component {

  constructor(props, context) {
    super(props);

    var initialView = Platform.OS === 'android' ? 'SplashScreen' : 'SplashScreen';
    this.state = {
      initialView: initialView
    };
  }

  render() {
    return (
      <Navigator
        initialRoute={{id: this.state.initialView}}
        renderScene={this.navigatorRenderScene} />
    );
  }

  navigatorRenderScene(route, navigator) {
    _navigator = navigator;
    switch (route.id) {
      case 'SplashScreen':
        return(<SplashScreen navigator={navigator} route={route} title='SplashScreen' />);
      case 'MainView':
        return(<MainView navigator={navigator} route={route} title='MainView' />);
      case 'FeedbackView':
        return(<FeedbackView navigator={navigator} route={route} title='FeedbackView' />);
    }
  }
}


AppRegistry.registerComponent('OpenCity', () => OpenCity);
