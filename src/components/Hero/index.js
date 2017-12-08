import React, { Component } from 'react';
import { Image, View, Text, Platform, TouchableHighlight, TouchableNativeFeedback } from 'react-native';
import styles from './styles';

class Hero extends Component {
  constructor(props) {
    super(props);
  }

  navToEvent = () => {
    this.props.navigation.navigate('EventDetailView', {
      eventUrl: this.props.eventUrl
    })
  }

  render() {
    const {imageUrl, date, place, headline} = this.props
    let pic = {
      uri: imageUrl
    };

    const HeroContent = (
      <View style={styles.heroWrapper}>
        <Image source={pic} style={styles.heroImage} resizeMode="cover"/>
        <View style={styles.heroOverlay}>
          <Text style={styles.heroDate}>{date}</Text>
          <Text style={styles.heroPlace}>{place}</Text>
          <Text style={styles.heroHeadline}>{headline}</Text>
        </View>
        <Image source={require('./../../img/main-hero-decoration.png')}  resizeMode={'cover'} style={styles.heroDecoration}/>
      </View>
    )

    return (
      Platform.select({
        ios: (
          <TouchableHighlight onPress={this.navToEvent}>
            {HeroContent}
          </TouchableHighlight>
        ),
        android: (
          <TouchableNativeFeedback onPress={this.navToEvent}>
            {HeroContent}
          </TouchableNativeFeedback>
        )

      })
    );
  }
}

export default Hero
