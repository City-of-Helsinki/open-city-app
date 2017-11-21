import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableHighlight,
  TouchableNativeFeedback,
  Modal
} from 'react-native';

import Navbar             from '../../components/Navbar';
import Spinner            from '../../components/Spinner';
import backIcon           from '../../img/back.png';
import styles             from './styles';

// Display a full sized image with pinch-to-zoom functionality
class ImageView extends Component {

  constructor(props, context) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <Navbar
          leftIcon={backIcon}
          onLeftButtonClick={()=>this.props.navigation.goBack()}
          header={''} />
        <View style={styles.photoViewContainer}>
            <Image
              source={{uri: this.props.navigation.state.params.imageUrl}}
              style={styles.photoView} />
        </View>
      </View>
    );
  }
}

module.exports = ImageView;
