import React, { Component, PropTypes } from 'react';
import {
  ProgressBarAndroid
} from 'react-native';

class ActivityIndicator extends Component {
  render() {
    return (<ProgressBarAndroid style={this.props.style} />);
  }
}

export default ActivityIndicator;
