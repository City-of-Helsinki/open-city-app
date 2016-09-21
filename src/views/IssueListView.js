import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  Platform,
  BackAndroid
} from 'react-native';

import Drawer  from 'react-native-drawer'
import Navbar  from './../components/Navbar';
import Menu    from './../components/Menu';

var navigator;

class IssueListView extends Component {

  constructor(props, context) {
    super(props, context);

    navigator = this.props.navigator;
  }

  navToMapView() {
    this.props.navigator.pop();
  }

  render() {
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
            mapView={()=>{this.navToMapView(this)}}
            feedbackView={()=>{this._drawer.close()}}
            onMenuClick={()=>this._drawer.close()}/>
        }>
        <View style={styles.container}>
          <Navbar
            onMenuClick={()=>this._drawer.open()}
            header={'lista foo'}/>
          <Text>lista</Text>
        </View>
      </Drawer>
    );
  }
}

BackAndroid.addEventListener('hardwareBackPress', function() {
  if (navigator) {
      navigator.pop();
      return true;
  }
  return false;
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'red'
  },
});

module.exports = IssueListView
