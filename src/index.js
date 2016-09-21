import React, { Component } from 'react';
import {
  AppRegistry,
  AsyncStorage,
  Navigator,
  Platform
} from 'react-native';

import SplashScreen  from './views/SplashScreen';
import MainView      from './views/MainView';
import FeedbackView  from './views/FeedbackView';
import IssueListView from './views/IssueListView';

console.ignoredYellowBox = ['Warning: You are manually'];

class OpenCity extends Component {

  constructor(props, context) {
    super(props);

    var initialView = Platform.OS === 'android' ? 'SplashScreen' : 'MainView';
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
      case 'IssueListView':
        return(<IssueListView navigator={navigator} route={route} title='IssueListView' />);
    }
  }
}


AppRegistry.registerComponent('OpenCity', () => OpenCity);
