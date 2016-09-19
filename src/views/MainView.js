import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text
} from 'react-native';

// Components and helpers
import Navbar               from './../components/Navbar';
import Menu                 from './../components/Menu';
import FloatingActionButton from './../components/FloatingActionButton';
import showAlert            from './../components/Alert';
import Config               from './../config.json';
import makeRequest          from './../util/requests';

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


const LATITUDE        = 60.1680574;
const LONGITUDE       = 24.9339746;
const LATITUDE_DELTA  = 0.0922;
const LONGITUDE_DELTA = 0.0421;

class MainView extends Component {


  constructor(props, context) {
    super(props, context);

    this.state = {
      issues: [],
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
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
      showAlert(transError.networkErrorTitle, transError.networkErrorMessage, transError.networkErrorOk)
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
          console.log(i)
          console.log(issueObjects[i])
          // Magic for showing different types of markers
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

  onMapRegionChange() {

  }

  render() {
    return (
      <Drawer
        ref={(ref) => this._drawer = ref}
        type="overlay"

        content={<Menu mapView={()=>{alert('mappii')}} FeedbackView={()=>{this.navToFeedbackView(this)}}/>}
        openDrawerOffset={0.3}
        closedDrawerOffset={0}
        tapToClose={true}
        acceptTap={true}
        content={
          <Menu
            mapView={()=>{alert('mappii')}}
            feedbackView={()=>{alert('feedbackView')}}/>
        }>
        <View style={styles.container}>
          <Navbar
            buttonAction={()=>this._drawer.open()}
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
                />
              ))}
            </MapView>
          </View>
          <FloatingActionButton
            buttonAction={()=>alert('lisäykseen')}/>
        </View>
      </Drawer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
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
