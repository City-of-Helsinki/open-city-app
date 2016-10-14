import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  Dimensions,
  LayoutAnimation,
  Platform,
  UIManager,
  TouchableWithoutFeedback,
} from 'react-native';

import transIntroduction from '../translations/introduction';

import showAlert from '../components/Alert';
import Util      from '../util/util';
import Config    from '../config';

import progressImage1  from '../img/progress_1.png';
import progressImage2  from '../img/progress_2.png';
import progressImage3  from '../img/progress_3.png';
import markersImage    from '../img/introduction_markers.png';
import menuImage       from '../img/introduction_menu.png';
import screenshotImage from '../img/introduction_screenshots.png';
import nextViewIcon    from '../img/next.png'
import doneIcon        from '../img/done.png'
import checkboxIcon    from '../img/close.png';

// An introductory view where user can swipe to move back and forth. After the final view user is
// redirected to the MainView. The view is divided into 3 seperate states.
class IntroductionView extends Component {

  constructor(props, context) {
    super(props, context);

    transIntroduction.setLanguage('fi');

    this.state = {
      topText: transIntroduction.firstTopText,        // The text displayd on the top
      bottomText: transIntroduction.firstBottomText,  // The text displayd on the bottom
      image: screenshotImage,                         // An image which is located on the middle
      progressImage: progressImage1,                  // Image which displays users progress in the introduction view
      currentView: 1,                                 // Index of the current view of the introductory flow
      checkboxSelected: false,                        // Whether the checkbox is checked
    };

    if (Platform.OS === 'android') { UIManager.setLayoutAnimationEnabledExperimental(true) }
  }

  // Receives the index of the new view as a paramater and the data on the screen is
  // changed accordingly
  changeView(newView) {
    var topText       = '';
    var bottomText    = '';
    var progressImage = '';
    var image         = '';

    switch (newView) {
      case 1:
        topText = transIntroduction.firstTopText;
        bottomText = transIntroduction.firstBottomText;
        progressImage = progressImage1;
        image = screenshotImage;
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
        if (this.state.checkboxSelected) {
          Util.setItemToStorage(Config.STORAGE_IS_FIRST_TIME, 'false');
        }
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

  onCheckboxSelect() {
    this.setState({
      checkboxSelected: !this.state.checkboxSelected
    });
  }

  render() {
    var buttonIcon = this.state.currentView === 3 ? doneIcon : nextViewIcon;

    return (
      <View style={styles.container}>
        <Text
          style={[styles.titleText, styles.textFont, {
            fontWeight: this.state.currentView === 1 ? 'bold' : 'normal',
          }]}>
          {this.state.topText}
        </Text>
        <View style={styles.imageContainer}>
          <Image source={this.state.image} style={styles.image} resizeMode={'contain'}  />
        </View>
        <View
          style={[styles.textContainer, {                   // If there is no text don't use padding
            padding: this.state.bottomText !== '' ? 15 : 0, // so that an empty white box does not show up
          }]}>
          <Text style={[styles.descriptionText, styles.textFont]}>{this.state.bottomText}</Text>
        </View>
        {this.state.currentView === 3 && // Show a checkbox on the last page of the introduction
        <View style={styles.checkboxContainer}>
          <View style={styles.checkboxViewContainer}>
            <TouchableWithoutFeedback onPress={this.onCheckboxSelect.bind(this)}>
              <View style={styles.checkboxView}>
                { this.state.checkboxSelected &&
                  <Image style={styles.checkboxImage} source={checkboxIcon} /> }
              </View>
            </TouchableWithoutFeedback>
          </View>
          <Text style={[styles.checkboxLabel, styles.textFont]}>{transIntroduction.checkboxLabel}</Text>
        </View>
        }
        <View style={styles.buttonContainer}>
          <TouchableWithoutFeedback onPress={this.changeView.bind(this, (this.state.currentView+1))}>
            <View style={styles.buttonView}>
              <Image
                source={buttonIcon}
                style={styles.buttonIcon}/>
            </View>
          </TouchableWithoutFeedback>
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
    paddingBottom: 80,
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
    textAlign: 'center'
  },
  imageContainer: {
    flex: 1,
    alignSelf: 'stretch',
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    height: 200,
    width: Dimensions.get('window').width - 40,
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
  },
  checkboxContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 10,
    width: Dimensions.get('window').width - 40,
  },
  checkboxViewContainer: {
    height: 32,
    width: 32,
  },
  checkboxView: {
    height: 32,
    width: 32,
    backgroundColor: '#fff',
  },
  checkboxLabel: {
    color: '#212121',
    flexWrap: 'wrap',
    flex: 1,
    marginLeft: 5,
    fontWeight: 'bold',
  },
  checkboxImage: {
    height: 32,
    width: 32,
  },
  buttonContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    position: 'absolute',
    bottom: 10,
    right: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonView: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    width: 72,
    height: 72
  }

});

module.exports = IntroductionView
