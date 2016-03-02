import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Navigator,
  PushNotificationIOS,
  AppState
} from 'react-native';

import IssueList from './src/components/Issue/IssueList';

import {configureApi} from './src/helpers/api';
import {mountBackgroundTask, unmountBackgroundTask} from './src/helpers/backgroundTask';

import BackgroundGeolocation from 'react-native-background-geolocation';

configureApi({endpoint: 'http://dev.hel.fi/openahjo/v1'});

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
    mountBackgroundTask(this.refs.nav);
  }

  /**
   * Component is unmounting.
   */
  componentWillUnmount() {
    unmountBackgroundTask();
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
        initialRoute={{component: IssueList}}
        renderScene={this.renderScene.bind(this)}
        configureScene={this.configureScene.bind(this)}
      />
    );
  }
}

AppRegistry.registerComponent('OpenCity', () => OpenCity);
