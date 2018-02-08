import React, { Component } from 'react';
import { Image, View, WebView } from 'react-native';
import {HEADER_LOGO}      from '../../styles/common';


class HearingDetailView extends Component {

  static navigationOptions = {
    headerTitle: (
        <Image
          style={HEADER_LOGO}
          resizeMode="contain"
          source={require('./../../img/city-logo.png')}
        />
    ),
    headerRight: (
      <View />
    )
  };

  constructor(props) {
    super(props)
  }


  render() {
    const { navigation } = this.props

    return (
      <WebView
        source={{uri: navigation.state.params.url}}
        style={{flex:1}}
        startInLoadingState={true}
        javaScriptEnabled={true}
        injectedJavaScript={'Array.from(document.getElementsByTagName("nav")).map(elem => elem.style.display="none")'}
      />
    );
  }
}

export default HearingDetailView
