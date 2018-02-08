import React, { Component } from 'react';
import { Image } from 'react-native';




const styles = {
  markerImage: {
    height: 22,
    width: 22
  }
}

const MapPin = (props) => {
  return (
    <Image
        source={require('./../../img/marker_pin.png')}
        style={styles.markerImage} />
  )
}

export default MapPin
