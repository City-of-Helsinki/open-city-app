import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableHighlight,
  TouchableNativeFeedback,
  Platform,
  Dimensions,
  Modal
} from 'react-native';

import Navbar             from '../components/Navbar';
import Spinner            from '../components/Spinner';
import backIcon           from '../img/back.png';

const VERTICAL_MARGIN   = 60;
const HORIZONTAL_MARGIN = 30;

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
          onLeftButtonClick={()=>this.props.navigator.pop()}
          header={''} />
        <View style={styles.photoViewContainer}>
            <Image
              source={{uri: this.props.route.imageUrl}}
              style={styles.photoView} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    flexDirection: 'column',
  },
  photoViewContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  photoView: {
    ...Platform.select({
      android: {
        height: Dimensions.get('window').height - 55 // Take Navbar into account,
      },
      ios: {
        height: Dimensions.get('window').height - 70 // Take Navbar and statusbar into account,
      }
    }),
    width: Dimensions.get('window').width,
  }
});


module.exports = ImageView;
