import React, { Component, PropTypes } from 'react';
import {
  ActivityIndicatorIOS
} from 'react-native';

class ActivityIndicator extends Component {
  render() {
    return (<ActivityIndicatorIOS style={this.props.style} />);
  }
}

export default ActivityIndicator;
