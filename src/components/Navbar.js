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
          <View style={styles.innerContainer}>
            <TouchableWithoutFeedback onPress={this.props.buttonAction}>
              <View style={styles.menuButton}></View>
            </TouchableWithoutFeedback>
            <Text style={styles.header}>{this.props.header}</Text>
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
    backgroundColor: '#FEF47D',
  },
  iosStatusBar: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    height: 15,
    backgroundColor: '#FEF47D',
  },
  innerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
  },
  menuButton: {
    position: 'absolute',
    left: 10,
    width: 40,
    height: 40,
    backgroundColor: 'blue',
  },
  header: {
    alignItems: 'center',
    fontSize: 18,
  }
});


module.exports = Navbar
