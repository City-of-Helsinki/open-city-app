import React, { Component } from 'react';
import { ImageBackground, TouchableHighlight, TouchableNativeFeedback, View, Text, FlatList, Platform } from 'react-native';
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

    const HearingContent = (
      <View>
        <ImageBackground source={pic} style={styles.hearingImage} resizeMode="cover" />
        <View style={styles.hearingOverlay}>
          <Text style={styles.hearingHeadline}>{headline}</Text>
        </View>
      </View>
    )



    return (
      Platform.select({
        ios: (
          <TouchableHighlight onPress={onPressItem} style={styles.hearingWrapper}>
            {HearingContent}
          </TouchableHighlight>
        ),
        android: (
          <TouchableNativeFeedback onPress={onPressItem} style={styles.hearingWrapper}>
            {HearingContent}
          </TouchableNativeFeedback>
        )
      })

    );
  }
}

export default Hearing
