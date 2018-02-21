import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableWithoutFeedback,
  Linking
} from 'react-native';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Global from '../../util/globals';
import Config from '../../config.json';

// Images
import feedbackIcon     from '../../img/feedback.png';
import listIcon         from '../../img/list.png';
import closeIcon        from '../../img/close.png';
import appFeedbackImage from '../../img/feedback.png';

import transMenu        from '../../translations/menu';
import styles           from './styles';
import {HEADER_LOGO}     from '../../styles/common';

class Menu extends Component {

  static navigationOptions = {
    headerTitle: (
        <Image
          style={HEADER_LOGO}
          resizeMode="contain"
          source={require('./../../img/city-logo.png')}
        />
    ),
    tabBarLabel: 'Info',
    tabBarIcon: ({ tintColor }) => (
      <Image
        source={require('./../../img/icon-bars.png')}
        style={[styles.icon, {tintColor: tintColor}]}
      />
    ),
  };

  constructor(props, context) {
    super(props);

    transMenu.setLanguage('fi');
  }

  navToAppFeedbackView() {
    this.props.navigation.navigate('AppFeedbackView', {});
  }

  render() {
    return (
      <View style={styles.container}>
          <View style={styles.textBlock}>
            <Text style={styles.infoText}>{transMenu.menuInfoText}</Text>
          </View>
          <View style={styles.appFeedbackContentContainer}>
            <Text style={styles.appFeedbackText}>{transMenu.menuAppFeedbackDescription}</Text>
            <TouchableWithoutFeedback onPress={() => this.navToAppFeedbackView()}>
                <View style={styles.appFeedbackButton}>
                  <Text style={styles.appFeedbackButtonText}>
                    {transMenu.menuAppFeedbackButton}
                  </Text>
                </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => Linking.openURL(Config.GITHUB_URL)}>
                <View style={styles.appFeedbackButton}>
                  <Text style={styles.appFeedbackButtonText}>
                    {transMenu.menuCodeLink}
                  </Text>
                </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => Linking.openURL(Config.PRIVACY_POLICY_URL)}>
              <View style={styles.appFeedbackButton}>
                <Text style={styles.appFeedbackButtonText}>
                  {transMenu.menuPrivacyPolicy}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {}
}

function mapDispatchToProps(dispatch) {
  return {}
}

const ConnectedMenu = connect(mapStateToProps, mapDispatchToProps)(Menu);

export default ConnectedMenu;
