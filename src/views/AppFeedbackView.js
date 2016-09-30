import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  TextInput,
  Dimensions,
  Platform,
  TouchableWithoutFeedback,
  ScrollView,
  Modal
} from 'react-native';

import Spinner from 'react-native-loading-spinner-overlay';

import showAlert from '../components/Alert';
import Config    from '../config';

import closeIcon from './../img/close.png';

import transFeedback from '../translations/appFeedback';
import transError    from '../translations/errors';

const MODAL_HEIGHT           = 300;
const SIDE_PADDING           = 32;
const CLOSE_ICON_HEIGHT      = 32;
const CLOSE_ICON_WIDTH       = 32;

class AppFeedbackView extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      feedbackText: '',
    };

    transFeedback.setLanguage('fi');
    transError.setLanguage('fi');
  }

  onSendButtonClick() {
    if (this.state.feedbackText.length >= Config.OPEN311_DESCRIPTION_MIN_LENGTH &&
        this.state.feedbackText.length <= Config.OPEN311_DESCRIPTION_MAX_LENGTH) {
      // TODO: send feedback
    } else {
      // Show an alert informing user that the description text was not valid
      showAlert(transError.feedbackTextLengthErrorTitle, transError.feedbackTextLengthErrorMessage, transError.feedbackErrorButton);
    }
  }

  render() {
    return (
      <View>
        <Modal
          animationType={'fade'}
          transparent={true}
          visible={this.props.visible}
          onRequestClose={this.props.onClose}>
          <View style={styles.modalContainer}>
            <View style={styles.contentContainer}>
              <Text style={styles.text}>{transFeedback.appFeedbackViewTitle}</Text>
              <TextInput
                style={styles.contentInput}
                placeholder={transFeedback.feedbackInputPlaceholder}
                multiline={true}
                onChangeText={(text)=> {
                  this.setState({
                    feedbackText: text,
                  });
                }} />
              <TouchableWithoutFeedback onPress={this.onSendButtonClick.bind(this)}>
                <View style={styles.sendButtonView}>
                  <Text style={styles.sendButtonText}>{transFeedback.sendButtonText}</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
            <TouchableWithoutFeedback onPress={this.props.onClose}>
              <Image
                source={closeIcon}
                style={styles.closeIcon}/>
            </TouchableWithoutFeedback>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    position: 'absolute',
    top: MODAL_HEIGHT / 2 + 10,
    right: SIDE_PADDING / 2 + 5,
    height: CLOSE_ICON_HEIGHT,
    width: CLOSE_ICON_WIDTH,
  },
  contentContainer: {
    shadowOpacity: 0.8,
    shadowOffset: {
      height: 0,
      width: 0
    },
    height: MODAL_HEIGHT,
    width: Dimensions.get('window').width - SIDE_PADDING,
    backgroundColor: '#EEEEEE',
    padding: 20,
  },
  sendButtonView: {
    height: 40,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sendButtonText: {
    color: '#607D8B',
    fontSize: 18,
    fontWeight: 'bold',
  }
});

module.exports = AppFeedbackView
