import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';

const BUTTON_WIDTH         = 72;
const BUTTON_HEIGHT        = 72;
const BUTTON_BORDER_RADIUS = 36;

// Button which will have an absolute position on the bottom right corner
class FloatingActionButton extends Component {

  constructor(props, context) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={this.props.onButtonClick}>
          <View style={styles.buttonView}>
            <Image
              source={this.props.icon}
              style={styles.plusIcon}/>
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
    bottom: 10,
    right: 10,
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
  plusIcon: {
    width: BUTTON_WIDTH,
    height: BUTTON_HEIGHT
  }
});


module.exports = FloatingActionButton
