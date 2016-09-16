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

    transMap.setLanguage('fi');
    transError.setLanguage('fi');
  }

  componentWillMount() {
    var url = Config.OPENAHJO_API_BASE_URL + Config.OPENAHJO_API_ISSUE_URL + Config.ISSUE_LIMIT;

    makeRequest(url, 'GET')
    .then(result => {
      this.parseIssues(result);
    }, err => {
      showAlert(transError.networkErrorTitle, transError.networkErrorMessage, transError.networkErrorOk)
    });
  }

  parseIssues(data) {
    console.log('safaf')
    console.log(data._bodyBlob)
  }
  navToFeedbackView() {
    this.props.navigator.push({
      id: 'FeedbackView',
    })
  }

  render() {

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
