import React, { Component } from 'react';
import { ImageBackground, TouchableHighlight, View, Text, FlatList } from 'react-native';
import styles from './styles';

class Hearing extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {imageUrl, headline, onPressItem} = this.props
    let pic = {
      uri: imageUrl
    };
    return (
      <TouchableHighlight onPress={onPressItem} style={styles.hearingWrapper}>
        <ImageBackground source={pic} style={styles.hearingImage} resizeMode="cover">
          <View style={styles.hearingOverlay}>
            <Text style={styles.hearingHeadline}>{headline}</Text>
          </View>
        </ImageBackground>
      </TouchableHighlight>
    );
  }
}

export default Hearing
