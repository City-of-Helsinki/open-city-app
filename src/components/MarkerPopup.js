import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  Dimensions,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';

import Drawer     from 'react-native-drawer'
import Navbar     from './../components/Navbar';
import Spinner    from './../components/Spinner';
import Util       from './../util/util';
import Global     from './../util/globals';
import caretIcon  from '../img/chevron_right.png';
import closeIcon  from '../img/close.png';
import transPopup from '../translations/markerPopup';



const SIDE_PADDING      = 64;
const CARET_ICON_HEIGHT = 12;
const CARET_ICON_WIDTH  = 12;

// Popup which will be shown when a map marker is clicked
class MarkerPopup extends Component {

  constructor(props, context) {
    super(props, context);

    transPopup.setLanguage('fi');
  }


  render() {
    var responseText = this.props.data.agency ?
      <Text
        style={styles.feedbackTextAgency}>
        {transPopup.responseText}, {this.props.data.agency}
      </Text> : null;

    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={this.props.onClose}>
          <View style={styles.closeImageContainer}>
            <Image source={closeIcon} style={styles.closeImage} />
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={this.props.onClick}>
          <View style={styles.enterContainer}>
            <Image style={styles.caretIcon} source={caretIcon} />
            <Text numberOfLines={3} style={styles.feedbackTextDescription}>{this.props.data.description}</Text>
            {responseText}
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Dimensions.get('window').height / 2 - 50,
    left: SIDE_PADDING / 2,
    backgroundColor: Global.COLOR.LIGHT_GREY,
    width: Dimensions.get('window').width - SIDE_PADDING,
    borderRadius: 2,
    ...Platform.select({
      ios: {
        shadowColor: Global.COLOR.BLACK,
        shadowOffset: {width: 1, height: 2},
        shadowOpacity: 0.5,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      }
    }),
  },
  closeImageContainer: {
    padding: 16,
  },
  closeImage: {
    height: 16,
    width: 16,
  },
  enterContainer: {
    flex: 1,
    paddingLeft: 16,
    paddingBottom: 16,
    paddingRight: 48,
  },
  caretIcon: {
    position: 'absolute',
    right: 16,
    top: 16,
    height: CARET_ICON_HEIGHT,
    width: CARET_ICON_WIDTH
  },
  feedbackTextDescription: {
    flexWrap: 'wrap',
    flex: 1,
    color: Global.COLOR.BLACK,
    fontSize: 14,
    marginBottom: 8
  },
  feedbackTextAgency: {
    flexWrap: 'wrap',
    flex: 1,
    color: Global.COLOR.DARK_GREY,
    fontSize: 13,
    fontWeight: 'bold'
  },
});

module.exports = MarkerPopup
