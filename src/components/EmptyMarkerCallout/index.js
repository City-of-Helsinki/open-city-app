import React, { Component } from 'react';
import {
  View,
  Text
} from 'react-native';

// Empty view to disable the default GoogleMaps marker callout
class EmptyMarkerCallout extends Component {

  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <View>
        <Text></Text>
      </View>
    );
  }
}

module.exports = EmptyMarkerCallout
