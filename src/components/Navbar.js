import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Platform,
  TouchableWithoutFeedback,
  Dimensions
} from 'react-native';

import Global   from './../util/globals';

const NAVBAR_HEIGHT = 55;
const ICON_WIDTH    = 30;
const ICON_HEIGHT   = 30;

// Navbar for the application with iOS status bar taken into account (extra padding)
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

    var leftIcon  = typeof this.props.leftIcon !== 'undefined' ? this.props.leftIcon : null;
    var rightIcon = typeof this.props.rightIcon !== 'undefined' ? this.props.rightIcon : null;
    return (
      <View>
        {iosStatusBar}
        <View style={styles.container}>
          <View style={styles.innerContainer}>
            <TouchableWithoutFeedback onPress={this.props.onLeftButtonClick}>
              <View style={styles.buttonView}>
                <Image
                  source={leftIcon}
                  style={styles.icon} />
              </View>
            </TouchableWithoutFeedback>
            <View style={styles.headerView}>
              <Text style={styles.header}>{this.props.header}</Text>
            </View>
            <TouchableWithoutFeedback onPress={this.props.onRightButtonClick}>
              <View style={styles.buttonView}>
                <Image
                  source={rightIcon}
                  style={[styles.icon, this.props.iconAnimationStyle]} />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: NAVBAR_HEIGHT,
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'center',
    backgroundColor: Global.COLOR.LIGHT_GREY,
    borderBottomColor: Global.COLOR.GREY,
    // Shadow
    ...Platform.select({
      ios: {
        borderBottomWidth: 1.5,
      },
      android: {
        elevation: 5,
      }
    }),
  },
  iosStatusBar: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    height: 15,
    backgroundColor: Global.COLOR.LIGHT_GREY,
  },
  innerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: ICON_HEIGHT,
  },
  buttonView: {
    height: NAVBAR_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 10,
    paddingRight: 10,
  },
  icon: {
    height: ICON_HEIGHT,
    width: ICON_WIDTH,
  },
  headerView: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 18,
    color: Global.COLOR.BLUE,
    textAlign: 'center',
    fontWeight: 'bold'
  },
});


module.exports = Navbar
