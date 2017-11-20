import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import styles from './styles';

// Button which will have an absolute position on the bottom right corner
class FloatingActionButton extends Component {

  constructor(props, context) {
    super(props);
  }

  render() {

    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={this.props.onButtonClick}>
          <View style={styles.buttonView}>
            <Image
              source={this.props.icon}
              style={styles.plusIcon}/>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

module.exports = FloatingActionButton
