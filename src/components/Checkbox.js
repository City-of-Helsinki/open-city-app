import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback
} from 'react-native';

// Display the correct activity indicator depending on the users platform
class Checkbox extends Component {

  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={this.props.onSelect}>
          <View>
            { this.props.selected &&
              <Text>X</Text> }
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 20,
    width: 20,
    borderWidth: 3,
    borderColor: '#212121'
  },
  innerContainer: {
    color: 'red',
  }
});

module.exports = Checkbox
