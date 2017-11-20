import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  Platform,
  TouchableWithoutFeedback,
  Animated
} from 'react-native';

import Global   from '../../util/globals';
import styles   from './styles';


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
        {!this.props.hide &&
        <Animated.View style={[styles.container, this.props.hideAnimation]}>
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
        </Animated.View>
        }
      </View>
    );
  }
}

module.exports = Navbar
