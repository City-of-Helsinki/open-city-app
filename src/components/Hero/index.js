import React, { Component } from 'react';
import { AppRegistry, Image, View, Text } from 'react-native';
import styles from './styles';

export default class Hero extends Component {
  render() {
    let pic = {
      uri: this.props.imageUrl
    };
    return (
      <View style={styles.heroWrapper}>
        <Image source={pic} style={styles.heroImage} resizeMode="cover"/>
        <View style={styles.heroOverlay}>
          <Text style={styles.heroDate}>{this.props.date}</Text>
          <Text style={styles.heroPlace}>{this.props.place}</Text>
          <Text style={styles.heroHeadline}>{this.props.headline}</Text>
        </View>
      </View>
    );
  }
}

module.exports = Hero
