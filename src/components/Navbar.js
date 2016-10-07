import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';

import menuIcon from './../img/menu.png';

const MENU_BUTTON_WIDTH  = 40;
const MENU_BUTTON_HEIGHT = 40;

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
            <TouchableWithoutFeedback onPress={this.props.onMenuClick}>
              <View style={styles.menuButtonView}>
                <Image
                  source={menuIcon}
                  style={styles.menuIcon}/>
              </View>
            </TouchableWithoutFeedback>
            <Text style={[styles.header, styles.textFont]}>{this.props.header}</Text>
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
    height: MENU_BUTTON_HEIGHT,
  },
  menuButtonView: {
    position: 'absolute',
    left: 10,
    width: MENU_BUTTON_WIDTH,
    height: MENU_BUTTON_HEIGHT,
  },
  menuIcon: {
    height: MENU_BUTTON_HEIGHT,
    width: MENU_BUTTON_WIDTH,
  },
  header: {
    alignItems: 'center',
    fontSize: 18,
    color: '#000'
  },
  textFont: {
    fontFamily: 'montserrat',
  }
});


module.exports = Navbar
