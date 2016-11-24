import React, { Component } from 'react';
import {
  View,
  Image,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';

import removeIcon from './../img/remove.png';

// Return a thumbnail image with a close button place on the top right corner
class Thumbnail extends Component {

  constructor(props, context) {
    super(props);
  }

  render() {
    return (
      <View>
        {this.props.show &&
        <TouchableWithoutFeedback onPress={this.props.imageClickAction}>
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
              </Image>
              <Image
                style={styles.removeImage}
                source={removeIcon} />
            </View>
          </TouchableWithoutFeedback>
        }
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
  removeImage: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: 24,
    width: 24,
  }
});

module.exports = Thumbnail
