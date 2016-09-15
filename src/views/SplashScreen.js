import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
} from 'react-native';

class SplashScreen extends Component {

  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    this.props.navigator.resetTo({
      id: 'MainView'
    });
  }



  render() {

    return (
      <View style={styles.container}>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'blue',
    flexDirection: 'column',
    padding: 20,
    flex: 1,
  },
});

module.exports = SplashScreen
