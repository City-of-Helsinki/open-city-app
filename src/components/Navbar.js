import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Platform,
} from 'react-native';

class Navbar extends Component {

  constructor(props, context) {
    super(props);
  }

  render() {

    // Add Padding for iOS status bar
    var iosStatusBar = null;
    if (Platform.OS !== 'android') {
      iosStatusBar = <View style={styles.iosStatusBar}></View>
    }

    return (
      <View>
        {iosStatusBar}
        <View style={styles.container}>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 55,
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'center',
    backgroundColor: 'yellow',
  },
  iosStatusBar: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    height: 15,
    backgroundColor: '#F15A24',
  },
});


module.exports = Navbar
