import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Platform,
  TouchableWithoutFeedback,
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
          <View>
            <TouchableWithoutFeedback onPress={this.props.menuAction}>
              <View style={styles.menuButton}></View>
            </TouchableWithoutFeedback>
          </View>
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
  menuButton: {
    width: 40,
    height: 40,
    marginLeft: 20,
    backgroundColor: 'blue',
  },
});


module.exports = Navbar
