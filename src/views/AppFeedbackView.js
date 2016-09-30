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

import MapView from 'react-native-maps';
import Drawer  from 'react-native-drawer'
import Navbar  from './../components/Navbar';
import Menu    from './../components/Menu';
import Util    from './../util/util';

import closeIcon        from './../img/close.png';
import sendEnabledIcon  from '../img/send.png';
import sendDisabledIcon from '../img/send_disabled.png';

const SIDE_PADDING           = 32;
const TOP_MARGIN             = Platform.OS === 'android' ? 60 : 75;
const BOTTOM_MARGIN          = 320;
const CLOSE_ICON_HEIGHT      = 32;
const CLOSE_ICON_WIDTH       = 32;
const CONTAINER_MAX_HEIGHT   = Dimensions.get('window').height - TOP_MARGIN - BOTTOM_MARGIN;
const DESCRIPTION_MIN_LENGTH = 10;
const DESCRIPTION_MAX_LENGTH = 5000;

class AppFeedbackView extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      feedbackText: '',
    };
  }

  componentWillReceiveProps() {
    console.log('mount')
  }

  render() {
    return (
      <View style={styles.container}>
        <Modal
          animationType={'fade'}
          transparent={true}
          visible={this.props.visible}
          onRequestClose={this.props.onClose}>
          <View style={styles.modalContainer}>
            <View style={styles.contentContainer}>
              <Text>modal</Text>
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
    alignItems: 'center'
  },
  closeIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
    height: CLOSE_ICON_HEIGHT,
    width: CLOSE_ICON_WIDTH,
  },
  contentContainer: {
    width: 200,
    height: 200,
    backgroundColor: '#c0ffee',
  },
  text: {
    color: '#000',
  },
});

module.exports = AppFeedbackView
