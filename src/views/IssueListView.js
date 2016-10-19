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

import Drawer         from 'react-native-drawer'
import OverlaySpinner from 'react-native-loading-spinner-overlay';

import FloatingActionButton from './../components/FloatingActionButton';
import Navbar           from './../components/Navbar';
import Menu             from './../components/Menu';
import IssueListRow     from './../components/IssueListRow';
import showAlert        from './../components/Alert';
import makeRequest      from './../util/requests';
import Util             from './../util/util';
import Global           from './../util/globals';
import Config           from './../config';
import AppFeedbackModal from './AppFeedbackView';
import plusIcon     from '../img/plus.png'

// Translations
import transList  from '../translations/list';
import transError from '../translations/errors';

var navigator;
const DEFAULT_LATITUDE           = 60.1680574;
const DEFAULT_LONGITUDE          = 24.9339746;
const DEFAULT_LATITUDE_DELTA     = 0.02208;
const DEFAULT_LONGITUDE_DELTA    = 0.01010;

class IssueListView extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      issueList: [],               // All objects to be shown
      isLoading: true,             // Show/hide spinner
      showAppFeedbackModal: false, // Show/hide modal for giving feedback
    };

    navigator = this.props.navigator;

    transList.setLanguage('fi');
    transError.setLanguage('fi');

    Global.isMainView = false;
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
    }, error => {
      this.setState({ isLoading: false });
      if (error.message === Config.TIMEOUT_MESSAGE) {
        showAlert(transError.serviceNotAvailableErrorTitle,
          transError.serviceNotAvailableErrorMessage, transError.serviceNotAvailableErrorButton);
      } else {
        showAlert(transError.networkErrorTitle, transError.networkErrorMessage,
          transError.networkErrorButton);
      }
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

  navToFeedbackView() {

    var mapRegion = {
      latitude: DEFAULT_LATITUDE,
      longitude: DEFAULT_LONGITUDE,
      latitudeDelta: DEFAULT_LATITUDE_DELTA,
      longitudeDelta: DEFAULT_LONGITUDE_DELTA,
    };

    this.props.navigator.push({
      id: 'FeedbackView',
      mapRegion: mapRegion, // Sets default region for the map in feedback view
    });
  }

  render() {
    return (
      <Drawer
        ref={(ref) => {
          this._drawer = ref;
          Global.menuRef = ref;
        }}
        type={'overlay'}
        openDrawerOffset={0.25}
        closedDrawerOffset={0}
        tapToClose={true}
        acceptTap={true}
        captureGestures={'open'}
        onOpen={()=> Global.menuOpen = true}
        onClose={()=> Global.menuOpen = false}
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
            header={transList.viewTitle}/>
          <OverlaySpinner visible={this.state.isLoading} />
          <ScrollView>
            <View style={styles.issueContainer}>
              {this.state.issueList.map((item) => (
                <IssueListRow
                  image={item.media_url}
                  title={item.title}
                  distance={item.distance}
                  date={item.date}
                  description={item.description}
                  extendedData={item.extendedData}
                  statusNotes={item.status_notes} />
              ))}
            </View>
          </ScrollView>
          <AppFeedbackModal
            visible={this.state.showAppFeedbackModal}
            onClose={()=>this.onAppFeedbackModalClose(this)} />
          {!this.state.showAppFeedbackModal && // When popup is displayed hide FAB because Google Maps toolbar
            <FloatingActionButton   // shows up after a marker is clicked
              icon={plusIcon}
              onButtonClick={()=>this.navToFeedbackView(this)}/>}
        </View>
      </Drawer>
    );
  }
}

BackAndroid.addEventListener('hardwareBackPress', function() {

  // Close menu if it's open otherwise navigate to the previous view
  if (Global.menuOpen && Global.menuRef !== null) {
    Global.menuRef.close();
    return true;
  } else if (navigator) {
    Global.isMainView = true;
    navigator.popToTop();
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
