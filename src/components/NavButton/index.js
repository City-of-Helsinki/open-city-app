import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  Platform,
  TouchableWithoutFeedback,
  Animated
} from 'react-native';

import Global   from '../../util/globals';
import styles   from './styles';


// Navbar for the application with iOS status bar taken into account (extra padding)
class NavButton extends Component {

  constructor(props, context) {
    super(props);
  }

  render() {

    const { icon, onPress } = this.props
    return (
      <TouchableWithoutFeedback onPress={onPress}>
        <View style={styles.buttonView}>
          <Image
            source={icon}
            style={styles.icon} />
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

export default NavButton
