import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Platform,
  TouchableWithoutFeedback,
  Linking,
  Dimensions
} from 'react-native';

import Global from './../util/globals';
import Config from './../config.json';

// Images
import feedbackIcon     from '../img/feedback.png';
import listIcon         from '../img/list.png';
import closeIcon        from '../img/close.png';
import appFeedbackImage from '../img/feedback.png';

import transMenu from '../translations/menu';

class Menu extends Component {

  constructor(props, context) {
    super(props);

    transMenu.setLanguage('fi');
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={this.props.onMenuClick}>
          <View style={styles.closeIconView}>
            <Image
              source={closeIcon}
              style={[styles.icon, styles.closeIcon]}/>
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.innerContainer}>
          <View style={styles.buttonContainer}>
            <TouchableWithoutFeedback onPress={this.props.mapView}>
              <View style={[styles.buttonView, styles.buttonDividerGray]}>
                <Text style={styles.menuText}>{transMenu.menuTitleFeedback}</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>

          <View style={styles.appFeedbackContainer}>
            <View style={styles.appFeedbackInnerContainer}>
              <Image style={styles.appFeedbackImage} source={appFeedbackImage}  />
              <View style={styles.appFeedbackContentContainer}>
                <Text style={styles.appFeedbackText}>{transMenu.menuAppFeedbackDescription}</Text>
                <TouchableWithoutFeedback onPress={this.props.onAppFeedbackClick}>
                  <View style={styles.appFeedbackButton}>
                    <Text style={styles.appFeedbackButtonText}>{transMenu.menuAppFeedbackButton}</Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: Global.COLOR.LIGHT_GREY,
    paddingTop: Platform.OS === 'ios' ? 15 : 0,
  },
  closeIconView: {
    height: 55,
    width: 56,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 16,
    paddingRight: 16,
  },
  closeIcon: {
    height: 20,
    width: 20,
  },
  innerContainer: {
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'space-between'
  },
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  buttonView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 16,
    paddingRight: 16,
  },
  menuText: {
    fontSize: 16,
    color: '#212121',
    flexWrap: 'wrap',
    flex: 1
  },
  icon: {
    height: 30,
    width: 30,
    marginRight: 5,
  },
  appFeedbackContainer: {
    flexDirection: 'row',
  },
  appFeedbackInnerContainer: {
    flex:1,
    height: 200,
    flexDirection: 'row',
  },
  appFeedbackContentContainer: {
    padding: 10,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  },
  appFeedbackImage: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    height: 200,
    width: Dimensions.get('window').width - (Dimensions.get('window').width * Global.OPEN_DRAWER_OFFSET),
  },
  appFeedbackText: {
    color: Global.COLOR.WHITE,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: Global.COLOR.TRANSPARENT,
  },
  appFeedbackButton: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 5,
    paddingTop: 5,
    borderRadius: 2,
    backgroundColor: Global.COLOR.WHITE
  },
  appFeedbackButtonText: {
    color: Global.COLOR.BLUE,
    flexWrap: 'wrap',
    fontSize: 18,
    fontWeight: 'bold'
  },
});


module.exports = Menu
