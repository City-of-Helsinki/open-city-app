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

import transIntroduction from '../translations/introduction';

import showAlert   from '../components/Alert';
import Util        from '../util/util';
import Config      from '../config';

const EVENT_RIGHT_SWIPE_THRESHOLD = -30;
const EVENT_LEFT_SWIPE_THRESHOLD  = 30;

// An introductory view where user can swipe to move back and forth. After the final view user is
// redirected to the MainView. The view is divided into 3 seperate states.
class IntroductionView extends Component {

  constructor(props, context) {
    super(props, context);

    transIntroduction.setLanguage('fi');

    this.state = {
      topText: transIntroduction.firstTopText,        // The text displayd on the top
      bottomText: transIntroduction.firstBottomText,  // The text displayd on the bottom
      image: '',                                      // An image which is located on the middle
      progressImage: '',                              // Image which displays users progress in the introduction view
      currentView: 1,                                 // Index of the current view of the introductory flow
    };
  }

  componentWillMount() {
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => {},
      onPanResponderMove: (evt, gestureState) => {},
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {

        // Set up the next introduction view, go to the MainView after the third introduction view
        if (gestureState.dx < EVENT_RIGHT_SWIPE_THRESHOLD) {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
          this.setState({
            topText: transIntroduction.thirdTopText,
            bottomText: transIntroduction.thirdBottomText,
          });
        }

        // Go to the previous introduction view unless it's the first view in which case nothing will be done
        else if (gestureState.dx > EVENT_LEFT_SWIPE_THRESHOLD) {
          this.navToMainView();
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

module.exports = IntroductionView
