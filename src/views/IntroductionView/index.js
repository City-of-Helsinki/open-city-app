import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
  LayoutAnimation,
  Platform,
  UIManager,
  TouchableWithoutFeedback,
} from 'react-native';

import transIntroduction from '../../translations/introduction';
import showAlert         from '../../components/Alert';
import Util              from '../../util/util';
import Global            from '../../util/globals';
import Config            from '../../config';
import backgroundImage   from '../../img/introduction_background.png';
import checkboxIcon      from '../../img/check.png';
import styles            from './styles';


class IntroductionView extends Component {

  constructor(props) {
    super(props);

    transIntroduction.setLanguage('fi');

    this.state = {
      checkboxSelected: false
    };

    Global.isMainView = true;
    Global.navigatorRef = this.props.navigator;

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

module.exports = IntroductionView
