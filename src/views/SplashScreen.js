import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  Dimensions
} from 'react-native';

import splashImage from './../img/splash_image.png';

import showAlert   from '../components/Alert';
import makeRequest from '../util/requests';
import Util        from '../util/util';
import Models      from '../util/models';
import Config      from '../config';

import transError from '../translations/errors';

// SplashScreen shown while data is being loaded
class SplashScreen extends Component {

  constructor(props, context) {
    super(props, context);

    this.issues = [];
    this.userSubmittedIssues = Models.fetchAllIssues();

    transError.setLanguage('fi');
  }

  componentWillMount() {
    this.fetchIssues();
  }

  // Fetch a fixed amount of issues from Open311 API
  fetchIssues() {
    var url = Config.OPEN311_SERVICE_REQUESTS_URL;
    var headers = {'Accept': 'application/json', 'Content-Type': 'application/json'};

    makeRequest(url, 'GET', headers, null, null)
    .then(result => {
      this.issues = Util.parseIssues(result, this.userSubmittedIssues);
      this.navToMainView();
    }, error => {
      if (error.message === Config.TIMEOUT_MESSAGE) {
        showAlert(transError.serviceNotAvailableErrorTitle,
          transError.serviceNotAvailableErrorMessage, transError.serviceNotAvailableErrorButton);
        this.navToMainView();
      } else {
        showAlert(transError.networkErrorTitle, transError.networkErrorMessage,
          transError.networkErrorButton);
        this.navToMainView();
      }
    });
  }

  navToMainView() {
    this.props.navigator.resetTo({
      id: 'MainView',
      issues: this.issues,
    });
  }

  render() {

    return (
      <View style={styles.container}>
        <Image
          source={splashImage}
          style={styles.splashImage}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center'
  },
  splashImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
  },
  splashLogo: {

    height: 300,
    width: 290,
  }
});

module.exports = SplashScreen
