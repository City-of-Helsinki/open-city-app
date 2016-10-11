import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  ProgressBarAndroid,
  ActivityIndicatorIOS,
  Platform,
} from 'react-native';

// Display the correct activity indicator depending on the users platform
class Spinner extends Component {

  constructor(props, context) {
    super(props, context);
  }

  render() {
    var spinner = Platform.OS === 'android' ?
                  <ProgressBarAndroid color={this.props.color} /> :
                  <ActivityIndicatorIOS color={this.props.color}/>;
    spinner = this.props.visible ? spinner : null;

    return (
      <View style={styles.container}>
        {spinner}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
  },
});

module.exports = Spinner
