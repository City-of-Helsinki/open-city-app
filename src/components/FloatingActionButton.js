import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';

const BUTTON_WIDTH         = 70;
const BUTTON_HEIGHT        = 70;
const BUTTON_BORDER_RADIUS = 35;

class FloatingActionButton extends Component {

  constructor(props, context) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={this.props.buttonAction}>
          <View style={styles.buttonView}>
            <Text style={styles.floatingActionButtonText}>uus</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: BUTTON_WIDTH,
    height: BUTTON_HEIGHT,
    borderRadius: BUTTON_BORDER_RADIUS,
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonView: {
    width: BUTTON_WIDTH,
    height: BUTTON_HEIGHT,
    borderRadius: BUTTON_BORDER_RADIUS,
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingActionButtonText: {
    fontSize: 16,
  },
});


module.exports = FloatingActionButton
