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
import Config               from './../config.json';
import makeRequest          from './../util/requests';
import MarkerPopup          from './IssueDetailMarkerView';

// External modules
import MapView from 'react-native-maps';
import Drawer  from 'react-native-drawer'

// Translations
import transMap   from '../translations/map';
import transError from '../translations/errors';

// Images
import redMarker    from '../img/red_marker.png';
import yellowMarker from '../img/yellow_marker.png';
import greenMarker  from '../img/green_marker.png';

// Default region set as Helsinki
const DEFAULT_LATITUDE        = 60.1680574;
const DEFAULT_LONGITUDE       = 24.9339746;
const DEFAULT_LATITUDE_DELTA  = 0.0922;
const DEFAULT_LONGITUDE_DELTA = 0.0421;

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
      showPopup: false,
    }

    transMap.setLanguage('fi');
    transError.setLanguage('fi');
  }

  componentWillMount() {
    this.fetchIssues();
  }

  // Fetch a fixed amount of issues from Openahjo API
  fetchIssues() {
    var url = Config.OPENAHJO_API_BASE_URL + Config.OPENAHJO_API_ISSUE_URL + Config.ISSUE_LIMIT;
    console.log(url)
    makeRequest(url, 'GET')
    .then(result => {
      this.parseIssues(result);
    }, err => {
      showAlert(transError.networkErrorTitle, transError.networkErrorMessage, transError.networkErrorOk);
    });
  }

  // Get all issues with coordinates and show them on the map
  parseIssues(data) {
    var temp = [];
    var issueObjects = data.objects;

    for (var i=0; i < issueObjects.length; i++) {
      if (issueObjects[i].geometries.length > 0) {
        if (issueObjects[i].geometries[0].coordinates.length > 0 &&
          typeof issueObjects[i].geometries[0].coordinates[0] != 'undefined' &&
          typeof issueObjects[i].geometries[0].coordinates[1] != 'undefined') {

          // Testing Magic for showing different types of markers
          var image = i % 3 == 0 ? redMarker : i % 2 == 0 ? yellowMarker : greenMarker;
          temp.push(
            {coordinates:
              {latitude: issueObjects[i].geometries[0].coordinates[1],
              longitude: issueObjects[i].geometries[0].coordinates[0]},
            title: issueObjects[i].category_name,
            description: issueObjects[i].category_name,
            image: image});
        }
      }
    }

    this.setState({
      issues: temp,
    });
  }

  navToFeedbackView() {
    this.props.navigator.push({
      id: 'FeedbackView',
    })
  }

  // Open a detailed view of the selected issue
  showIssueDetailPopup() {
    console.log('show')
    this.setState({
      showPopup: true,
    })
  }

  openWebViewMarket() {
    var url = Platform.OS === 'android' ? Config.ANDROID_STORE_URL : Config.IOS_STORE_URL;
    Linking.openURL(url).catch(err => {
      showAlert(transError.networkErrorTitle, transError.networkErrorMessage, transError.networkErrorOk);
    });
  }

  onMapRegionChange() {

  }

  render() {

    // Initialize Popup which will be shown when a marker is clicked
    var issueDetailPopup = this.state.showPopup ?
      <MarkerPopup
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
            mapView={()=>{alert('mappii')}}
            feedbackView={()=>{this.navToFeedbackView(this)}}
            onMenuClick={()=>this._drawer.close()}
            appFeedback={()=>this.openWebViewMarket(this)}/>
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
              onRegionChangeComplete={this.onMapRegionChange.bind(this)}>
              {this.state.issues.map(issue => (
                <MapView.Marker
                  coordinate={issue.coordinates}
                  title={issue.title}
                  description={issue.description}
                  image={issue.image}
                  onPress={this.showIssueDetailPopup.bind(this)}
                />
              ))}
            </MapView>
          </View>
          {issueDetailPopup}
          <FloatingActionButton
            onButtonClick={()=>alert('lisäykseen')}/>
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
