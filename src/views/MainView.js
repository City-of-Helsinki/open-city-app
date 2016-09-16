import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text
} from 'react-native';

import MapView from 'react-native-maps';
import Navbar  from './../components/Navbar';
import Drawer  from 'react-native-drawer'

class MainView extends Component {

  constructor(props, context) {
    super(props, context);
  }

  onMapRegionChange() {

  }

  render() {

    return (
      <View style={styles.container}>
        <Navbar />
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            showsUserLocation={true}
            followUserLocation={false}
            onRegionChangeComplete={this.onMapRegionChange.bind(this)}>
          </MapView>
        </View>
      </View>
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
