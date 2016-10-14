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

import menuIcon from './../img/menu.png';

const MENU_BUTTON_WIDTH  = 30;
const MENU_BUTTON_HEIGHT = 30;
const HEADER_VIEW_WIDTH  = Dimensions.get('window').width - ((MENU_BUTTON_WIDTH * 2) + 30);

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
            <View style={styles.headerView}>
              <Text style={[styles.header, styles.textFont]}>{this.props.header}</Text>
            </View>
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
    backgroundColor: '#FFF176',
  },
  iosStatusBar: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    height: 15,
    backgroundColor: '#FFF176',
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
  headerView: {
    width: HEADER_VIEW_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 16,
    color: '#212121',
    textAlign: 'center'
  },
  textFont: {
    fontFamily: 'montserrat',
  }
});


module.exports = Navbar
