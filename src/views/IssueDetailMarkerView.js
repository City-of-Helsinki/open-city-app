import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  TextInput,
  Dimensions,
  Platform,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';

import MapView from 'react-native-maps';
import Drawer  from 'react-native-drawer'
import Navbar  from './../components/Navbar';
import Menu    from './../components/Menu';

import closeIcon from './../img/close.png';

const SIDE_PADDING      = 32;
const TOP_MARGIN        = Platform.OS === 'android' ? 60 : 75;
const CLOSE_ICON_HEIGHT = 60;
const CLOSE_ICON_WIDTH  = 60;

class IssueDetailCallout extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.row}>
            <Text style={styles.text}>{this.props.categoryName}</Text>
            <Text style={styles.text}>{this.props.subject}</Text>
            <Text style={styles.text}>{this.props.summary}</Text>
            <Text style={styles.infoText}>{this.props.date}</Text>
            <Text style={styles.infoText}>{this.props.distance}</Text>
          </View>
        </ScrollView>
        <TouchableWithoutFeedback onPress={this.props.onExitClick}>
          <Image
            source={closeIcon}
            style={styles.closeIcon}/>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: TOP_MARGIN,
    left: SIDE_PADDING / 2,
    height: 400,
    width: Dimensions.get('window').width - SIDE_PADDING,
    padding: 5,
    backgroundColor: '#fff',
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 5,
  },
  closeIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
    height: CLOSE_ICON_HEIGHT,
    width: CLOSE_ICON_WIDTH,
  },
  text: {
    color: '#000',
  },
  infoText: {
    color: '#888',
  },
});

module.exports = IssueDetailCallout
