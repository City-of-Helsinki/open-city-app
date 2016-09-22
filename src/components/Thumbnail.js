import React, { Component } from 'react';
import {
  View,
  Image,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';

import removeIcon from '../img/close.png';

const CONTAINER_PADDING  = 10;
const REMOVE_ICON_HEIGHT = 20;
const REMOVE_ICON_WIDTH  = 20;
var imageHeight;
var imageWidth;

// Returns a native picker for Android or native popup with selection for iOS
class NativePicker extends Component {

  constructor(props, context) {
    super(props);
    imageHeight = this.props.imageHeight;
    imageWidth  = this.props.imageWidth;
  }

  render() {
    var content = this.props.show ?
                  <View style={styles.container}>
                    <Image
                      source={this.props.imageSource}
                      style={{
                        height: this.props.imageHeight,
                        width: this.props.imageWidth
                      }} />
                    <TouchableWithoutFeedback onPress={this.props.imageClickAction}>
                      <Image
                        source={removeIcon}
                        style={styles.removeIcon} />
                    </TouchableWithoutFeedback>
                  </View> : null;
    return (
      <View>
        {content}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: imageHeight,
    width: imageWidth,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
  },
  removeIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: REMOVE_ICON_HEIGHT,
    width: REMOVE_ICON_WIDTH,
    borderColor: 'red',
    borderWidth: 1,
  }
});

module.exports = NativePicker
