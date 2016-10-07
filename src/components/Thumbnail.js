import React, { Component } from 'react';
import {
  View,
  Image,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';

import removeIcon from '../img/close_image.png';

const CONTAINER_PADDING  = 10;
const REMOVE_ICON_HEIGHT = 20;
const REMOVE_ICON_WIDTH  = 20;

// Return a thumbnail image with a close button place on the top right corner
class Thumbnail extends Component {

  constructor(props, context) {
    super(props);
  }

  render() {
    var content = this.props.show ?
                  <View style={[styles.container, {
                    height: this.props.imageHeight,
                    width: this.props.imageWidth
                  }]}>
                    <Image
                      source={this.props.imageSource}
                      style={{
                        height: this.props.imageHeight,
                        width: this.props.imageWidth
                      }} >
                    <TouchableWithoutFeedback onPress={this.props.imageClickAction}>
                      <Image
                        source={removeIcon}
                        style={styles.removeIcon} />
                    </TouchableWithoutFeedback>
                    </Image>
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
  }
});

module.exports = Thumbnail
