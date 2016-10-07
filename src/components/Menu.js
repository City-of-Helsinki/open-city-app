import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Platform,
  TouchableWithoutFeedback,
  Linking,
} from 'react-native';

import Config from './../config.json';

// Images
import feedbackIcon     from '../img/feedback.png';
import listIcon         from '../img/list.png';
import mapIcon          from '../img/map.png';
import menuIcon         from '../img/menu.png';
import userFeedbackIcon from '../img/user_feedback.png';

import transMenu from '../translations/menu';

class Menu extends Component {

  constructor(props, context) {
    super(props);

    transMenu.setLanguage('fi');
  }

  openWebViewMarket() {
    var url = Platform.OS === 'android' ? Config.ANDROID_STORE_URL : Config.IOS_STORE_URL;
    Linking.openURL(url).catch(err => {
      showAlert(transError.networkErrorTitle, transError.networkErrorMessage, transError.networkErrorOk);
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={this.props.onMenuClick}>
          <Image
            source={menuIcon}
            style={[styles.icon, styles.menuIcon]}/>
        </TouchableWithoutFeedback>
        <View style={styles.innerContainer}>
          <TouchableWithoutFeedback onPress={this.props.mapView}>
            <View style={[styles.buttonView, styles.buttonDividerGray]}>
              <Image
                source={mapIcon}
                style={styles.icon}/>
              <Text style={[styles.menuText, styles.textFont]}>{transMenu.menuTitleMapButton}</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={this.props.feedbackView}>
            <View style={[styles.buttonView, styles.buttonDividerGray]}>
              <Image
                source={listIcon}
                style={styles.icon}/>
              <Text style={[styles.menuText, styles.textFont]}>{transMenu.menuTitleListButton}</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={this.props.appFeedbackView}>
            <View style={[styles.buttonView, styles.buttonDividerYellow]}>
              <Image
                source={feedbackIcon}
                style={styles.icon}/>
              <Text style={[styles.menuText, styles.textFont]}>{transMenu.menuTitleFeedbackButton}</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'rgba(255,255,255,1)',
    paddingTop: 55,
  },
  menuIcon: {
    height: 40,
    width: 40,
    position: 'absolute', // Menu icon positioned on top of the navbar menu icon
    top: 7,
    left: 10,
  },
  innerContainer: {
    flexDirection: 'column',
    alignItems: 'stretch',

  },
  buttonView: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonDividerGray: {
    borderTopWidth: 2,
    borderTopColor: '#757575',
  },
  buttonDividerYellow: {
    borderTopWidth: 2,
    borderTopColor: '#FBC02D',
  },
  menuText: {
    fontSize: 18,
    color: '#000',
  },
  icon: {
    height: 30,
    width: 30,
    marginRight: 5,
  },
  titleView: {
    backgroundColor: '#FEF47D',
    paddingLeft: 10,
    marginBottom: 10,
  },
  titleText: {
    fontSize: 20,
    color: '#000',
  },
  textFont: {
    fontFamily: 'montserrat',
  }
});


module.exports = Menu
