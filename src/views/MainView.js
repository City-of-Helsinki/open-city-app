import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  Platform,
  LayoutAnimation,
  BackAndroid
} from 'react-native';

// Components and helpers
import Navbar               from './../components/Navbar';
import Menu                 from './../components/Menu';
import FloatingActionButton from './../components/FloatingActionButton';
import showAlert            from './../components/Alert';
import EmptyMarkerCallout   from './../components/EmptyMarkerCallout';
import Config               from './../config.json';
import makeRequest          from './../util/requests';
import Util                 from './../util/util';
import Models               from './../util/models';
import MarkerPopup          from './IssueDetailMarkerView';
import AppFeedbackModal     from './AppFeedbackView';

// External modules
import MapView from 'react-native-maps';
import Drawer  from 'react-native-drawer'
import Geolib  from 'geolib';
import Spinner from 'react-native-loading-spinner-overlay';
import Realm   from 'realm';

// Translations
import transMap   from '../translations/map';
import transError from '../translations/errors';

// Images
import redMarker    from '../img/red_marker.png';
import yellowMarker from '../img/yellow_marker.png';
import greenMarker  from '../img/green_marker.png';
import plusIcon     from '../img/plus.png'

// Default region set as Helsinki
const DEFAULT_LATITUDE        = 60.1680574;
const DEFAULT_LONGITUDE       = 24.9339746;
const DEFAULT_LATITUDE_DELTA  = 0.02208;
const DEFAULT_LONGITUDE_DELTA = 0.01010;

// Defines the string which the Open311 API returns. The string is used for status comparison
const STATUS_OPEN             = 'open';

// Global reference for drawer is needed in order to enable 'back to close' functionality
var menuRef  = null;
var menuOpen = false;

class MainView extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      issues: [],           // List of all issues which will be shown on the map
      region: {             // Coordinates for the visible area of the map
        latitude: DEFAULT_LATITUDE,
        longitude: DEFAULT_LONGITUDE,
        latitudeDelta: DEFAULT_LATITUDE_DELTA,
        longitudeDelta: DEFAULT_LONGITUDE_DELTA,
      },
      userPosition: {       // The position of the user
        latitude: null,
        longitude: null,
      },
      showAppFeedbackModal: false, // Show/hide modal for giving feedback
      showPopup: false,     // Show/hide the popup which displays the details of a selected issue
      isLoading: false,     // Show/hide loading spinner
      popupData: null,      // The data which will be passed to a child component and displayed in the popup
    }

    // Details with default data for marker popups
    this.issueDetails = {
      title: '',
      description:'',
      extendedData:[],
      agency: '',
      distance: 0,
      date: '',
      media_url: null
    };

    this.userSubmittedIssues = Models.fetchAllIssues();
    transMap.setLanguage('fi');
    transError.setLanguage('fi');
  }

  componentWillMount() {
    this.fetchIssues();
  }

  componentDidMount() {
    this.geoLocation();
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  // Fetch users position and set the region of the map accordingly
  geoLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        var region = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: DEFAULT_LATITUDE_DELTA,
          longitudeDelta: DEFAULT_LONGITUDE_DELTA,
        };
        var userPosition = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }
        this.setState({
          region: region,
          userPosition: userPosition
        });
      },
      (error) => {
      },
      {
        enableHighAccuracy: Config.GPS_HIGH_ACCURACY,
        timeout: Config.GPS_TIMEOUT,
        maximumAge: Config.GPS_MAXIMUM_AGE
      }
    );
    this.watchID = navigator.geolocation.watchPosition((position) => {
        var region = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: DEFAULT_LATITUDE_DELTA,
          longitudeDelta: DEFAULT_LONGITUDE_DELTA,
        };
        var userPosition = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }
        this.setState({
          region: region,
          userPosition: userPosition
        });
    });
  }

  // Fetch a fixed amount of issues from Open311 API
  fetchIssues() {
    var url = Config.OPEN311_SERVICE_REQUESTS_URL;
    var headers = {'Accept': 'application/json', 'Content-Type': 'application/json'};

    makeRequest(url, 'GET', headers, null, null)
    .then(result => {
      this.parseIssues(result);
    }, error => {
      showAlert(transError.networkErrorTitle, transError.networkErrorMessage, transError.networkErrorButton);
    });
  }

  // Fetch details of a single issue
  fetchIssueDetails(issue) {
    var url = Config.OPEN311_SERVICE_REQUEST_BASE_URL + issue.id + Config.OPEN311_SERVICE_REQUEST_PARAMETERS_URL;
    var headers = {'Accept': 'application/json', 'Content-Type': 'application/json'};

    makeRequest(url, 'GET', headers, null, null)
    .then(result => {
      var data = Util.parseIssueDetails(result, this.state.userPosition);
      this.setState({
        isLoading: false,
        popupData: data,
      });
    }, error => {
      showAlert(transError.networkErrorTitle, transError.networkErrorMessage, transError.networkErrorButton);
    });
  }

  // Get all issues with coordinates and show them on the map
  parseIssues(data) {
    var issues = [];

    for (var i=0; i < data.length; i++) {
      if (data[i].lat !== 'undefined' && typeof data[i].long !== 'undefined') {
        issues.push({coordinates:
                      {latitude: data[i].lat,
                      longitude: data[i].long},
                    markerImage: this.selectMarkerImage(data[i].status, data[i].service_request_id),
                    id: data[i].service_request_id});
      }
    }

    this.setState({
      issues: issues,
    });
  }

  // Parse status and return the appropriate marker
  selectMarkerImage(status, issueId) {

    if (!this.userSubmittedIssue(issueId)) {
      return status === STATUS_OPEN ? yellowMarker : greenMarker;
    } else {
      // TODO: user marker icon
      return status === STATUS_OPEN ? yellowMarker : greenMarker;
    }
  }

  // Return true if the id was found in the database, false otherwise
  userSubmittedIssue(issueId) {

    mArray = [];
    this.userSubmittedIssues.forEach(function(value, index, ar) {
      if(value.issueId == issueId) {
        return true;
      }
    })

    return false;
  }

  navToFeedbackView() {
    var mapRegion = {
      latitude: DEFAULT_LATITUDE,
      longitude: DEFAULT_LONGITUDE,
      latitudeDelta: DEFAULT_LATITUDE_DELTA,
      longitudeDelta: DEFAULT_LONGITUDE_DELTA,
    };

    // If users position has been located it will be set as the region for feedback view
    if (this.state.userPosition.latitude !== null && this.state.userPosition.longitude !== null) {
      mapRegion.latitude = this.state.userPosition.latitude;
      mapRegion.longitude = this.state.userPosition.longitude;
    }

    this.props.navigator.push({
      id: 'FeedbackView',
      mapRegion: mapRegion, // Sets default region for the map in feedback view
    });
  }

  navToIssueListView(drawer) {
    drawer.close();
    this.props.navigator.push({
      id: 'IssueListView',
      userPosition: this.state.userPosition,
    });
  }

  // Open a detailed view of the selected issue
  showIssueDetailPopup(issue) {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.linear)
    this.setState({showPopup:true, popupData: this.issueDetails, isLoading: true});
    this.fetchIssueDetails(issue);
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

  // Hide popup when map is clicked
  onMapViewClick() {
    if (this.state.showPopup) {
      this.setState({
        region: this.state.region,
        showPopup: false,
      });
    }
  }

  // Keep track of mapview region in order for the map not to reset after
  // closing popup which causes UI to refresh
  onMapRegionChange(region) {
    this.setState({
      region: region
    });
  }

  render() {

    // Initialize Popup which will be shown when a marker is clicked
    var issueDetailPopup = this.state.showPopup ?
      <MarkerPopup
        data={this.state.popupData}
        userPosition={this.state.userPosition}
        onExitClick={()=>this.setState({showPopup:false})}
        />
      : null;

    return (
      <Drawer
        ref={(ref) => {
          this._drawer = ref;
          menuRef = ref;
        }}
        type={'overlay'}
        openDrawerOffset={0.25}
        closedDrawerOffset={0}
        tapToClose={true}
        acceptTap={true}
        captureGestures={'open'}
        onOpen={()=> menuOpen = true}
        onClose={()=> menuOpen = false}
        content={
          <Menu
            mapView={()=>{this._drawer.close()}}
            feedbackView={()=>{this.navToIssueListView(this._drawer)}}
            appFeedbackView={()=>{this.onAppFeedbackModalClick(this._drawer)}}
            onMenuClick={()=>this._drawer.close()}/>
        }>
        <View style={styles.container}>
          <Navbar
            onMenuClick={()=>this._drawer.open()}
            header={transMap.mapViewTitle}/>
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              region={this.state.region}
              showsUserLocation={true}
              followUserLocation={false}
              toolbarEnabled={false}
              onPress={this.onMapViewClick.bind(this)}
              onRegionChangeComplete={this.onMapRegionChange.bind(this)}>
              {this.state.issues.map(issue => (
                <MapView.Marker
                  coordinate={issue.coordinates}
                  title={issue.title}
                  description={issue.summary}
                  image={issue.markerImage}
                  onPress={()=> this.showIssueDetailPopup(issue)}>
                  <MapView.Callout tooltip={true}>
                    <EmptyMarkerCallout />
                  </MapView.Callout>
                </MapView.Marker>
              ))}
            </MapView>
          </View>
          {issueDetailPopup}
          <AppFeedbackModal
            visible={this.state.showAppFeedbackModal}
            onClose={()=>this.onAppFeedbackModalClose(this)} />
          <Spinner visible={this.state.isLoading} overlayColor={'rgba(0,0,0,0.0)'} color={'#000'} />
          <FloatingActionButton
            icon={plusIcon}
            onButtonClick={()=>this.navToFeedbackView(this)}/>
        </View>
      </Drawer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  mapContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  map: {
    flex: 1,
  },
});

BackAndroid.addEventListener('hardwareBackPress', function() {
  if (menuOpen && menuRef !== null) {
    menuRef.close();
    return true;
  }
  return false;
});

module.exports = MainView
