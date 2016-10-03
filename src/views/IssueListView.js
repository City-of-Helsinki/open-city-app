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

import Drawer  from 'react-native-drawer'
import Spinner from 'react-native-loading-spinner-overlay';

import Navbar           from './../components/Navbar';
import Menu             from './../components/Menu';
import IssueListRow     from './../components/IssueListRow';
import makeRequest      from './../util/requests';
import Util             from './../util/util';
import Config           from './../config';
import AppFeedbackModal from './AppFeedbackView';

// Translations
import transList  from '../translations/list';
import transError from '../translations/errors';

var navigator;

class IssueListView extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      issueList: [],               // All objects to be shown (max 20)
      isLoading: true,             // Show/hide spinner
      showAppFeedbackModal: false, // Show/hide modal for giving feedback
    };

    navigator = this.props.navigator;

    transList.setLanguage('fi');
    transError.setLanguage('fi');
  }

  componentWillMount() {
    this.fetchIssues();
  }

  fetchIssues() {
    var timeSpan = Util.getTimeSpan();
    var parameters = '?start_date=' + timeSpan.startDate + '&end_date=' + timeSpan.endDate
                   + Config.OPEN311_SERVICE_REQUESTS_EXTENSIONS_POSTFIX;
    var url = Config.OPEN311_SERVICE_REQUESTS_URL + parameters;
    var headers = {'Accept': 'application/json', 'Content-Type': 'application/json'};

    makeRequest(url, 'GET', headers, null, null)
    .then(result => {
      var issueList = Util.parseIssueList(result, this.props.route.userPosition);
      this.setState({
        isLoading: false,
        issueList: issueList,
      });
    }, err => {
      showAlert(transError.networkErrorTitle, transError.networkErrorMessage, transError.networkErrorButton);
    });
  }

  navToMapView() {
    this.props.navigator.resetTo({
      id: 'MainView',
    });
  }

  onAppFeedbackModalClick(drawer) {
    drawer.close();
    this.setState({
      showAppFeedbackModal: true,
    });
  }

  onAppFeedbackModalClose() {
    this.setState({
      showAppFeedbackModal: false,
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
            appFeedbackView={()=>{this.onAppFeedbackModalClick(this._drawer)}}
            onMenuClick={()=>this._drawer.close()}/>
        }>
        <View style={styles.container}>
          <Navbar
            onMenuClick={()=>this._drawer.open()}
            header={transList.listViewTitle}/>
          <Spinner visible={this.state.isLoading} />
          <ScrollView>
            <View style={styles.issueContainer}>
              {this.state.issueList.map((item) => (
                <IssueListRow
                  image={item.media_url}
                  title={item.title}
                  distance={item.distance}
                  date={item.date}
                  description={item.description}
                  extendedData={item.extendedData} />
              ))}
            </View>
          </ScrollView>
          <AppFeedbackModal
            visible={this.state.showAppFeedbackModal}
            onClose={()=>this.onAppFeedbackModalClose(this)} />
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
  }
});

module.exports = IssueListView
