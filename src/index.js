import React, { Component, PropTypes } from 'react';

import {
  AppRegistry,
  StyleSheet,
  Navigator,
  Platform,
} from 'react-native';

import StartScreen from './components/StartScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

class OpenCity extends Component {
  /**
   * @constructor
   */
  constructor() {
    super();
  }

  /**
   * Component is now mounted.
   */
  componentDidMount() {
    if (Platform.OS === 'ios') {
      // const { mountBackgroundTask } = require('./src/helpers/backgroundTask');
      // mountBackgroundTask(this.refs.nav);
    }
  }

  /**
   * Component is unmounting.
   */
  componentWillUnmount() {
    if (Platform.OS === 'ios') {
      // const { unmountBackgroundTask } = require('./src/helpers/backgroundTask');
      // unmountBackgroundTask();
    }
  }

  /**
   * Scene configuration method for the navigator.
   * @param route
   * @returns {*}
   */
  configureScene(route) {
    if (route.sceneConfig) {
      return route.sceneConfig;
    }

    return Object.assign({}, Navigator.SceneConfigs.HorizontalSwipeJump, {
      gestures: {
        pop: null
      }
    });
  }

  /**
   * Render method for the navigator scene.
   * @param route
   * @param navigator
   * @returns {XML}
   */
  renderScene(route, navigator) {
    return <route.component {...route.passProps} route={route} navigator={navigator}/>;
  }

  /**
   * OpenCity component render method.
   * @returns {XML}
   */
  render() {
    return (
      <Navigator
        ref="nav"
        style={styles.container}
        initialRoute={{component: StartScreen}}
        renderScene={this.renderScene.bind(this)}
        configureScene={this.configureScene.bind(this)}
      />
    );
  }
}

AppRegistry.registerComponent('OpenCity', () => OpenCity);
