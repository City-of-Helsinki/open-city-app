import React, { Component } from 'react';
import { ImageBackground, TouchableHighlight, TouchableNativeFeedback, View, Text, FlatList, Platform } from 'react-native';
import styles from './styles';

class Card extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {imageUrl, headline, onPressItem} = this.props
    let pic = {
      uri: imageUrl
    };

    const CardContent = (
      <View>
        <ImageBackground source={pic} style={styles.cardImage} resizeMode="cover" />
        <View style={styles.cardOverlay}>
          <Text style={styles.cardHeadline}>{headline}</Text>
        </View>
      </View>
    )



    return (
      Platform.select({
        ios: (
          <TouchableHighlight onPress={onPressItem} style={styles.cardWrapper}>
            {CardContent}
          </TouchableHighlight>
        ),
        android: (
          <TouchableNativeFeedback onPress={onPressItem} style={styles.cardWrapper}>
            {CardContent}
          </TouchableNativeFeedback>
        )
      })

    );
  }
}

export default Card
