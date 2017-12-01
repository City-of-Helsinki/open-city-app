import React, { Component } from 'react';
import { WebView } from 'react-native';

class HearingDetailView extends Component {
  constructor(props) {
    super(props)
  }


  render() {
    const { navigation } = this.props

    return (
      <WebView
        source={{uri: navigation.state.params.url}}
        style={{flex:1, marginTop: 20}}
      />
    );
  }
}

export default HearingDetailView
