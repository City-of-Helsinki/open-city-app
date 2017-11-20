import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';

import Drawer     from 'react-native-drawer'
import Navbar     from '../../components/Navbar';
import Spinner    from '../../components/Spinner';
import Util       from '../../util/util';
import Global     from '../../util/globals';
import caretIcon  from '../../img/chevron_right.png';
import closeIcon  from '../../img/close.png';
import transPopup from '../../translations/markerPopup';
import styles     from './styles';

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

module.exports = MarkerPopup
