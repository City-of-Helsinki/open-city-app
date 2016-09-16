import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text
} from 'react-native';

import Navbar  from './../components/Navbar';
import Menu    from './../components/Menu';
import MapView from 'react-native-maps';
import Drawer  from 'react-native-drawer'

class MainView extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      drawerIsOpen: false
    };
  }

  onMapRegionChange() {

  }

  navToFeedbackView() {
    this.props.navigator.push({
      id: 'FeedbackView',
    })
  }

  render() {

    var drawerIsOpen = false;

    return (
      <Drawer
        ref={(ref) => this._drawer = ref}
        type="static"
        content={<Menu mapView={()=>{alert('mappii')}} FeedbackView={()=>{this.navToFeedbackView(this)}}/>}
        openDrawerOffset={100}
        tweenHandler={Drawer.tweenPresets.parallax}>
        <View style={styles.container}>
          <Navbar
            menuAction={()=>this._drawer.open()}
            />
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              showsUserLocation={true}
              followUserLocation={false}
              onRegionChangeComplete={this.onMapRegionChange.bind(this)}>
            </MapView>
          </View>
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
