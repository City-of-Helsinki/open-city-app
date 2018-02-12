import React, { PureComponent } from 'react';
import { ImageBackground, TouchableHighlight, TouchableNativeFeedback, View, Text, FlatList, Platform } from 'react-native';
import styles from './styles';

class Card extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const {imageUrl, headline, onPressItem} = this.props
    let pic = {
      uri: imageUrl
    };
    let overlayStyle = this.props.overlayStyle || {}
    let textStyle = this.props.textStyle || {}

    const CardContent = (
      <View>
        <ImageBackground source={pic} style={styles.cardImage} resizeMode="cover" />
        <View style={[styles.cardOverlay, overlayStyle]}>
          <Text numberOfLines={3} style={[styles.cardHeadline, textStyle]}>{headline}</Text>
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
          <TouchableNativeFeedback onPress={onPressItem}>
            <View style={styles.cardWrapper}>
              {CardContent}
            </View>
          </TouchableNativeFeedback>
        )
      })

    );
  }
}

export default Card
