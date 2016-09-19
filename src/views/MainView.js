import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text
} from 'react-native';

import Navbar               from './../components/Navbar';
import Menu                 from './../components/Menu';
import FloatingActionButton from './../components/FloatingActionButton';
import showAlert            from './../components/Alert';
import Config               from './../config.json';
import makeRequest          from './../util/requests';

import MapView from 'react-native-maps';
import Drawer  from 'react-native-drawer'

import transMap   from '../translations/map';
import transError from '../translations/errors';

class MainView extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      issues: [],
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
          console.log(issueObjects[i].geometries[0].coordinates[0])
          console.log(issueObjects[i].geometries[0].coordinates[1])
          temp.push({coordinates: {latitude: issueObjects[i].geometries[0].coordinates[1], longitude: issueObjects[i].geometries[0].coordinates[0]}, title: issueObjects[i].category_name, description: issueObjects[i].category_name})
        }
      }
    }
    console.log('lopu')
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
        type="static"

        content={<Menu mapView={()=>{alert('mappii')}} FeedbackView={()=>{this.navToFeedbackView(this)}}/>}
        openDrawerOffset={100}
        tapToClose={true}
        tweenHandler={Drawer.tweenPresets.parallax}
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
              showsUserLocation={true}
              followUserLocation={false}
              onRegionChangeComplete={this.onMapRegionChange.bind(this)}>
              {this.state.issues.map(issue => (
                <MapView.Marker
                  coordinate={issue.coordinates}
                  title={issue.title}
                  description={issue.description}
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
