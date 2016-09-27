import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  Platform,
  BackAndroid,
  ScrollView
} from 'react-native';

import Drawer      from 'react-native-drawer'
import Navbar      from './../components/Navbar';
import Menu        from './../components/Menu';
import makeRequest from './../util/requests';
import Config      from './../config';

// Translations
import transList  from '../translations/list';
import transError from '../translations/errors';

var navigator;

class IssueListView extends Component {

  constructor(props, context) {
    super(props, context);

    navigator = this.props.navigator;

    transList.setLanguage('fi');
    transError.setLanguage('fi');
  }

  componentWillMount() {
    this.fetchIssues();
  }

  fetchIssues() {
    var url = Config.OPEN311_SERVICE_REQUESTS_URL + '?start_date=2016-08-24T00:00:00Z&end_date=2016-09-24T00:00:00Z';
    var headers = {'Accept': 'application/json', 'Content-Type': 'application/json'};

    makeRequest(url, 'GET', headers, null)
    .then(result => {

    }, err => {
      showAlert(transError.networkErrorTitle, transError.networkErrorMessage, transError.networkErrorButton);
    });
  }

  navToMapView() {
    this.props.navigator.resetTo({
      id: 'MainView',
    });
  }

  render() {
    return (
      <Drawer
        ref={(ref) => this._drawer = ref}
        type="overlay"
        openDrawerOffset={0.25}
        closedDrawerOffset={0}
        tapToClose={true}
        acceptTap={true}
        captureGestures={'open'}
        content={
          <Menu
            mapView={()=>{this.navToMapView(this)}}
            feedbackView={()=>{this._drawer.close()}}
            onMenuClick={()=>this._drawer.close()}/>
        }>
        <View style={styles.container}>
          <Navbar
            onMenuClick={()=>this._drawer.open()}
            header={transList.listViewTitle}/>
          <ScrollView>
            <View style={styles.issueContainer}>
              <Text>afafaf</Text>
            </View>
          </ScrollView>
        </View>
      </Drawer>
    );
  }
}

BackAndroid.addEventListener('hardwareBackPress', function() {
  if (navigator) {
      navigator.pop();
      return true;
  }
  return false;
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#EEEEEE'
  },
  issueContainer: {
    padding: 10,
    borderColor: 'black',
    borderWidth: 1,
  }
});

module.exports = IssueListView
