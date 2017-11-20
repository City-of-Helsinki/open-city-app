import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableWithoutFeedback,
  Linking
} from 'react-native';

import Global from '../../util/globals';
import Config from '../../config.json';

// Images
import feedbackIcon     from '../../img/feedback.png';
import listIcon         from '../../img/list.png';
import closeIcon        from '../../img/close.png';
import appFeedbackImage from '../../img/feedback.png';

import transMenu        from '../../translations/menu';
import styles           from './styles';

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
            <View style={styles.versionTextView}>
              <Text style={styles.versionText}>{Config.APP_VERSION}</Text>
            </View>
          </View>

          <View style={styles.appFeedbackContainer}>
            <View style={styles.appFeedbackInnerContainer}>
              <Image style={styles.appFeedbackImage} source={appFeedbackImage} />
              <View style={styles.appFeedbackContentContainer}>
                <Text style={styles.appFeedbackText}>{transMenu.menuAppFeedbackDescription}</Text>
                <TouchableWithoutFeedback onPress={this.props.onAppFeedbackClick}>
                  <View style={styles.appFeedbackButton}>
                    <Text style={styles.appFeedbackButtonText}>{transMenu.menuAppFeedbackButton}</Text>
                  </View>
                </TouchableWithoutFeedback>
                  <Text style={styles.appPrivacyPolicy}
                        onPress={() => Linking.openURL(Config.PRIVACY_POLICY_URL)}>
                      {transMenu.menuPrivacyPolicy}
                  </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

module.exports = Menu
