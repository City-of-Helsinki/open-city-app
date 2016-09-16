import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';

class Menu extends Component {

  constructor(props, context) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={this.props.mapView}>
          <View style={styles.buttonView}>
            <Text style={styles.menuText}>Kartta viewiin</Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={this.props.FeedbackView}>
          <View style={styles.buttonView}>
            <Text style={styles.menuText}>Toiseen viewiin</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 50,
  },
  buttonView: {
    marginBottom: 30,
    borderColor: 'black',
    borderWidth: 2,
  },
  menuText: {
    fontSize: 16,
  },
});


module.exports = Menu
