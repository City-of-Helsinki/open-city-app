import React, { Component }   from 'react';
import { Image, View, Text }  from 'react-native';
import FastImage              from 'react-native-fast-image';

import styles                 from './styles';

class Hero extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {imageUrl, date, place, headline} = this.props
    let pic = {
      uri: imageUrl,
      priority: FastImage.priority.high
    };
    return (
      <View style={styles.heroWrapper}>
        <FastImage source={pic} style={styles.heroImage} resizeMode="cover"/>
        <View style={styles.heroOverlay}>
          <Text style={styles.heroDate}>{date}</Text>
          <Text style={styles.heroPlace}>{place}</Text>
          <Text style={styles.heroHeadline}>{headline}</Text>
        </View>
      </View>
    );
  }
}

export default Hero
