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
import Request              from './../util/requests';
import Config               from './../config.json';

import MapView from 'react-native-maps';
import Drawer  from 'react-native-drawer'

import transMap from '../translations/map';

class MainView extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      drawerIsOpen: false
    };

    transMap.setLanguage('fi');
  }

  componentWillMount() {

  }

  onMapRegionChange() {

  }

  render() {

    var drawerIsOpen = false;

    return (
      <Drawer
        ref={(ref) => this._drawer = ref}
        type="static"
        content={<Menu mapView={()=>{alert('mappii')}} feedbackView={()=>{alert('feedbackView')}}/>}
        openDrawerOffset={100}
        tweenHandler={Drawer.tweenPresets.parallax}>
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
