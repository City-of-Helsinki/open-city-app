import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text
} from 'react-native';

import MapView from 'react-native-maps';

class MainView extends Component {

  constructor(props, context) {
    super(props, context);
  }

  onMapRegionChange() {

  }

  render() {

    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          showsUserLocation={true}
          followUserLocation={false}
          onRegionChangeComplete={this.onMapRegionChange.bind(this)}>
        </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'red',
    flexDirection: 'column',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  map: {
    flex: 1,

  },
});

module.exports = MainView
