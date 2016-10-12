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

import progressImage1 from '../img/progress_1.png';
import progressImage2 from '../img/progress_2.png';
import progressImage3 from '../img/progress_3.png';
import markersImage   from '../img/markers.png';
import menuImage      from '../img/splash_image.png';

const EVENT_RIGHT_SWIPE_THRESHOLD = -35;
const EVENT_LEFT_SWIPE_THRESHOLD  = 35;

// An introductory view where user can swipe to move back and forth. After the final view user is
// redirected to the MainView. The view is divided into 3 seperate states.
class IntroductionView extends Component {

  constructor(props, context) {
    super(props, context);

    transIntroduction.setLanguage('fi');

    this.state = {
      topText: transIntroduction.firstTopText,        // The text displayd on the top
      bottomText: transIntroduction.firstBottomText,  // The text displayd on the bottom
      image: markersImage,                            // An image which is located on the middle
      progressImage: progressImage1,                  // Image which displays users progress in the introduction view
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
        var newView = this.state.currentView;

        if (gestureState.dx < EVENT_RIGHT_SWIPE_THRESHOLD) {
          newView++;
        } else if (gestureState.dx > EVENT_LEFT_SWIPE_THRESHOLD) {
          newView = newView < 2 ? 1 : newView - 1;
        }
        this.changeView(newView);
      },
      onPanResponderTerminate: (evt, gestureState) => {},
      onShouldBlockNativeResponder: (evt, gestureState) => {return true;},
    });
  }

  changeView(newView) {
    var topText       = '';
    var bottomText    = '';
    var progressImage = '';
    var image         = '';

    // On Left swipe set up the next introduction view, go to the MainView after the third introduction view
    // On right swipe go to the previous introduction view unless it's the first view in which case nothing will be done
    switch (newView) {
      case 1:
        topText = transIntroduction.firstTopText;
        bottomText = transIntroduction.firstBottomText;
        progressImage = progressImage1;
        image = markersImage;
        break;
      case 2:
        topText = transIntroduction.secondTopText;
        bottomText = '';
        progressImage = progressImage2;
        image = menuImage;
        break;
      case 3:
        topText = transIntroduction.thirdTopText;
        bottomText = transIntroduction.thirdBottomText;
        progressImage = progressImage3;
        image = markersImage;
        break;
      case 4:
        this.navToMainView();
        break;
      default:
        break;
    }

    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    this.setState({
      topText: topText,
      bottomText: bottomText,
      progressImage: progressImage,
      currentView: newView,
      image: image,
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
        <View style={styles.imageContainer}>
          <Image source={this.state.image} style={styles.image} resizeMode={'contain'} />
        </View>
        <View
          style={[styles.textContainer, {
          padding: this.state.bottomText !== '' ? 15 : 0, // If there is no text don't use padding so that an empty white box does not show up
          }]}>
          <Text style={[styles.descriptionText, styles.textFont]}>{this.state.bottomText}</Text>
        </View>
        <View style={styles.progressImageContainer}>
          <Image source={this.state.progressImage} style={styles.progressImage}/>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF176',
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 35,
    paddingTop: 20,
  },
  titleText: {
    fontSize: 20,
  },
  descriptionText: {
    fontSize: 16,
  },
  textFont: {
    fontFamily: 'montserrat',
    color: '#212121',
  },
  imageContainer: {
    height: 200,
    width: 175,
    margin: 10,
  },
  image: {
    height: 200,
    width: 175,
  },
  textContainer: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  progressImageContainer: {
    position: 'absolute',
    bottom: 15,
    left: Dimensions.get('window').width / 2 - 25,
    width: 50,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressImage: {
    height: 16,
    width: 50,
  }

});

module.exports = IntroductionView
