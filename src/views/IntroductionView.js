import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  Dimensions,
  PanResponder,
  LayoutAnimation
} from 'react-native';

import splashImage from './../img/splash_image.png';

import transIntroduction from '../translations/introduction';

import showAlert   from '../components/Alert';
import Spinner     from '../components/Spinner';
import makeRequest from '../util/requests';
import Util        from '../util/util';
import Models      from '../util/models';
import Config      from '../config';

const EVENT_MOVE_RIGHT_THRESHOLD = -30;
const EVENT_MOVE_LEFT_THRESHOLD = 30;

// SplashScreen shown while data is being loaded
class SplashScreen extends Component {

  constructor(props, context) {
    super(props, context);

    transIntroduction.setLanguage('fi');

    this.state = {
      topText: transIntroduction.firstTopText,
      bottomText: transIntroduction.firstBottomText,
      image: '',
      progressImage: '',
      currentView: 1,
    };
  }

  componentWillMount() {
    console.log('xxx')
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => {},
      onPanResponderMove: (evt, gestureState) => {
        console.log('xxx')
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx < EVENT_MOVE_RIGHT_THRESHOLD) {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
          this.setState({
            topText: transIntroduction.thirdTopText,
            bottomText: transIntroduction.thirdBottomText,
          });
        } else {
          if (gestureState.dx > EVENT_MOVE_LEFT_THRESHOLD) {
            this.navToMainView();
          }
        }
      },
      onPanResponderTerminate: (evt, gestureState) => {},
      onShouldBlockNativeResponder: (evt, gestureState) => {return true;},
    });
  }

  navToMainView() {
    this.props.navigator.resetTo({
      id: 'MainView',
      issues: this.props.route.issues,
    });
  }

  render() {
    return (
      <View style={styles.container} {...this.panResponder.panHandlers}>
        <Text style={[styles.titleText, styles.textFont]}>{this.state.topText}</Text>
        <View style={styles.image}></View>
        <View style={styles.textContainer}>
          <Text style={[styles.descriptionText, styles.textFont]}>{this.state.bottomText}</Text>
        </View>
        <View style={styles.progressImageContainer}>

        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'yellow',
    paddingLeft: 20,
    paddingRight: 20,
  },
  titleText: {
    fontSize: 20,
  },
  descriptionText: {
    fontSize: 16,
  },
  textFont: {
    fontFamily: 'montserrat',
  },
  image: {
    backgroundColor: 'black',
    height: 300,
    width: 250,
    margin: 10,
  },
  textContainer: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressImageContainer: {
    position: 'absolute',
    bottom: 20,
    left: Dimensions.get('window').width / 2 - 20,
    width: 40,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
  }

});

module.exports = SplashScreen
