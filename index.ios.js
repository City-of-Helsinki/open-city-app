import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Navigator
} from 'react-native';

import IssueList from './src/components/Issue/IssueList';

import {configureApi} from './src/helpers/api';
import {configureLog, LOG_LEVEL_DEBUG} from './src/helpers/log';

configureApi({endpoint: 'http://dev.hel.fi/openahjo/v1'});
configureLog({isLogging: true, logLevel: LOG_LEVEL_DEBUG});

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

class OpenCity extends Component {
  configureScene(route) {
    if (route.sceneConfig) {
      return route.sceneConfig;
    }

    return Navigator.SceneConfigs.HorizontalSwipeJump;
  }

  renderScene(route, navigator) {
    return <route.component {...route.passProps} route={route} navigator={navigator}/>;
  }

  render() {
    return (
      <Navigator
        style={styles.container}
        initialRoute={{component: IssueList}}
        renderScene={this.renderScene.bind(this)}
        configureScene={this.configureScene.bind(this)}
      />
    );
  }
}

AppRegistry.registerComponent('OpenCity', () => OpenCity);
