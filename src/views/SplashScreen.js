import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  Dimensions
} from 'react-native';

import splashImage from './../img/HK_logo.png';

// SplashScreen intended for android
class SplashScreen extends Component {

  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    setTimeout(()=> {
      this.props.navigator.resetTo({
        id: 'MainView'
      });
    }, 1000)
  }

  render() {

    return (
      <View style={styles.container}>
        {/*<Image
          source={splashImage}
          style={styles.splashImage}/>*/}
        <Text style={{color: 'white', textAlign: 'center'}}>SplashScreen</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center'
  },
  splashImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
  }
});

module.exports = SplashScreen
