import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Navigator
} from 'react-native';

import IssueList from './src/components/Issue/IssueList';

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

class OpenCity extends Component {
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
        style={styles.container}
        initialRoute={{component: IssueList}}
        renderScene={this.renderScene.bind(this)}
        configureScene={this.configureScene.bind(this)}
      />
    );
  }
}

AppRegistry.registerComponent('OpenCity', () => OpenCity);
