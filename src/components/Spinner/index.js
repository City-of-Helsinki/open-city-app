import React, { Component } from 'react';
import {
  View,
  ActivityIndicator
} from 'react-native';
import styles from './styles';

// Display the correct activity indicator depending on the users platform
class Spinner extends Component {

  constructor(props, context) {
    super(props, context);
  }

  render() {
    var spinner = <ActivityIndicator color={this.props.color}/>;
    spinner = this.props.visible ? spinner : null;

    return (
      <View style={styles.spinner}>
        {spinner}
      </View>
    );
  }
}

module.exports = Spinner
