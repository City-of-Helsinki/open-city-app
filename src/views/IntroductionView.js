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
import Global    from '../util/globals';
import Config    from '../config';

import backgroundImage from '../img/introduction_background.png';
import checkboxIcon    from '../img/check.png';

const SIDE_PADDING = 20;

class IntroductionView extends Component {

  constructor(props) {
    super(props);

    transIntroduction.setLanguage('fi');

    this.state = {
      checkboxSelected: false
    };

    if (Platform.OS === 'android') { UIManager.setLayoutAnimationEnabledExperimental(true) }
  }

  navToMainView() {
    if (this.state.checkboxSelected) {
      Util.setItemToStorage(Config.STORAGE_IS_FIRST_TIME, 'false');
    }
    this.props.navigator.resetTo({
      id: 'MainView',
      serviceRequests: this.props.route.serviceRequests,
    });
  }

  onCheckboxSelect() {
    this.setState({
      checkboxSelected: !this.state.checkboxSelected
    });
  }

  render() {
    var checkboxImage = this.state.checkboxSelected ?
      <Image style={styles.checkboxImage} source={checkboxIcon} /> : null;

    var titleText = transIntroduction.formatString(transIntroduction.modalTitle, Config.APP_NAME);

    return (
      <View style={styles.container}>
        <Image source={backgroundImage} style={styles.backgroundImage} />
        <Text style={styles.versionText}>{transIntroduction.versionTitle}</Text>
        <View style={styles.modalContainer}>
          <View style={styles.textContainer}>
            <Text style={[styles.modalText, styles.modalTitle]}>{titleText}</Text>
            <Text style={[styles.modalText, styles.modalDescription]}>{transIntroduction.modalDescription}</Text>
          </View>
          <View style={styles.checkboxContainer}>
            <View style={styles.checkboxViewContainer}>
              <TouchableWithoutFeedback onPress={this.onCheckboxSelect.bind(this)}>
                <View style={styles.checkboxView}>
                  {checkboxImage}
                </View>
              </TouchableWithoutFeedback>
            </View>
            <Text style={styles.checkboxLabel}>{transIntroduction.checkboxLabel}</Text>
          </View>
          <View style={styles.closeButtonContainer}>
            <TouchableWithoutFeedback onPress={this.navToMainView.bind(this)}>
              <View style={styles.closeButtonView}>
              <Text style={styles.closeButtonText}>{transIntroduction.closeButton}</Text>
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
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Global.COLOR.WHITE,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  },
  versionText: {
    color: Global.COLOR.WHITE,
    fontWeight: 'bold',
    fontSize: 22,
    backgroundColor: Global.COLOR.TRANSPARENT,
  },
  modalContainer: {
    width: Dimensions.get('window').width - SIDE_PADDING,
    backgroundColor: Global.COLOR.WHITE,
    flexDirection: 'column',
    padding: 20,
    // Shadow
    ...Platform.select({
      ios: {
        shadowColor: Global.COLOR.BLACK,
        shadowOffset: {width: 2, height: 1},
        shadowOpacity: 0.9,
        shadowRadius: 4,
      },
      android: {
        elevation: 7,
      }
    }),
  },
  textContainer: {
    paddingRight: 10,
    paddingLeft: 10,
    alignItems: 'center',
  },
  modalText: {
    color: Global.COLOR.BLUE,
    textAlign: 'center'
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  modalDescription: {
    fontSize: 18,
  },
  checkboxContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 10,
  },
  checkboxViewContainer: {
    height: 32,
    width: 32,
  },
  checkboxView: {
    height: 32,
    width: 32,
    backgroundColor: Global.COLOR.BLUE,
    borderRadius: 3,
  },
  checkboxLabel: {
    color: Global.COLOR.BLACK,
    flexWrap: 'wrap',
    flex: 1,
    marginLeft: 20,
  },
  checkboxImage: {
    height: 32,
    width: 32,
  },
  closeButtonContainer: {
    flexDirection: 'row',
    backgroundColor: Global.COLOR.BLUE,
    marginTop: 20,
  },
  closeButtonView: {
    flex: 1,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: Global.COLOR.WHITE,
    fontSize: 18,
    fontWeight: 'bold'
  }

});

module.exports = IntroductionView
