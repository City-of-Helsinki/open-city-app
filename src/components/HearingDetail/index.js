import React, { Component } from 'react';
import { WebView } from 'react-native';

class HearingDetail extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { url, JStoInject } = this.props
    return (
      <WebView
        source={{uri: url}}
        startInLoadingState={true}
        injectedJavaScript={JStoInject}
        javaScriptEnabled={true}
      />
    );
  }
}

export default HearingDetail
