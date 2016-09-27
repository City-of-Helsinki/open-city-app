import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  Platform,
  Linking
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
import MarkerPopup          from './IssueDetailMarkerView';

// External modules
import MapView from 'react-native-maps';
import Drawer  from 'react-native-drawer'
import Geolib  from 'geolib';

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
const DEFAULT_LATITUDE_DELTA  = 0.0922;
const DEFAULT_LONGITUDE_DELTA = 0.0421;
const STATUS_OPEN             = 'open';

class MainView extends Component {


  constructor(props, context) {
    super(props, context);

    this.state = {
      issues: [],
      region: {
        latitude: DEFAULT_LATITUDE,
        longitude: DEFAULT_LONGITUDE,
        latitudeDelta: DEFAULT_LATITUDE_DELTA,
        longitudeDelta: DEFAULT_LONGITUDE_DELTA,
      },
      userPosition: {
        latitude: null,
        longitude: null,
      },
      showPopup: false,
      popupLoading: false,
      popupData: null,
    }

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

  // Fetch a fixed amount of issues from Openahjo API
  fetchIssues() {
    var url = Config.OPEN311_SERVICE_REQUESTS_URL;
    var headers = {'Accept': 'application/json', 'Content-Type': 'application/json'};

    makeRequest(url, 'GET', headers, null)
    .then(result => {
      this.parseIssues(result);
    }, err => {
      showAlert(transError.networkErrorTitle, transError.networkErrorMessage, transError.networkErrorButton);
    });
  }

  fetchIssueDetails(issue) {
    console.log('issue.id')
    console.log(issue.id)
    var url = Config.OPEN311_SERVICE_REQUEST_BASE_URL + issue.id + Config.OPEN311_SERVICE_REQUEST_PARAMETERS_URL;
    console.log(url)
    var headers = {'Accept': 'application/json', 'Content-Type': 'application/json'};

    makeRequest(url, 'GET', headers, null)
    .then(result => {
      console.log('responese')
      console.log(result)
      this.setState({
        showPopup: true,
        popupLoading: false,
        popupData: result,
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
                    markerImage: this.selectMarkerImage(data[i].status),
                    id: data[i].service_request_id});
      }
    }

    this.setState({
      issues: issues,
    });
  }

  // Parse status and return the appropriate marker
  selectMarkerImage(status) {
    return status === STATUS_OPEN ? yellowMarker : greenMarker;
  }

  navToFeedbackView() {
    var mapRegion = {
      latitude: DEFAULT_LATITUDE,
      longitude: DEFAULT_LONGITUDE,
      latitudeDelta: DEFAULT_LATITUDE_DELTA,
      longitudeDelta: DEFAULT_LONGITUDE_DELTA,
    };

    if (this.state.userPosition.latitude !== null && this.state.userPosition.longitude !== null) {
      mapRegion.latitude = this.state.userPosition.latitude;
      mapRegion.longitude = this.state.userPosition.longitude;
    }

    this.props.navigator.push({
      id: 'FeedbackView',
      mapRegion: mapRegion,
    });
  }

  navToIssueListView(drawer) {
    drawer.close();
    this.props.navigator.push({
      id: 'IssueListView',
    });
  }

  // Open a detailed view of the selected issue
  showIssueDetailPopup(issue) {
    this.fetchIssueDetails(issue);
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
        ref={(ref) => this._drawer = ref}
        type="overlay"
        openDrawerOffset={0.25}
        closedDrawerOffset={0}
        tapToClose={true}
        acceptTap={true}
        captureGestures={'open'}
        content={
          <Menu
            mapView={()=>{this._drawer.close()}}
            feedbackView={()=>{this.navToIssueListView(this._drawer)}}
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

module.exports = MainView
