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

const SIDE_PADDING         = 32;
const TOP_MARGIN           = Platform.OS === 'android' ? 60 : 75;
const BOTTOM_MARGIN        = 100;
const CLOSE_ICON_HEIGHT    = 50;
const CLOSE_ICON_WIDTH     = 50;
const CONTAINER_MAX_HEIGHT = Dimensions.get('window').height - TOP_MARGIN - BOTTOM_MARGIN;

class IssueDetailCallout extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.issueContainer}>
            <View style={styles.subjectView}>
              <Text style={[styles.text, styles.title]}>{this.props.subject}</Text>
            </View>
            <View style={styles.summaryView}>
              <Text style={styles.text}>{this.props.summary}</Text>
            </View>
            <View style={[styles.detail, styles.rowContainer]}>
              <Text style={styles.infoText}>{this.props.distance}m</Text>
              <Text style={styles.infoText}>{this.props.date}</Text>
            </View>
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
    height: CONTAINER_MAX_HEIGHT,
    width: Dimensions.get('window').width - SIDE_PADDING,
    padding: 5,
    backgroundColor: '#fff',
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 5,
  },
  issueContainer: {
    flexDirection: 'column',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subjectView: {
    marginBottom: 20,
    paddingRight: CLOSE_ICON_WIDTH,
  },
  summaryView: {
    marginBottom: 5,
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
  title: {
    fontWeight: 'bold'
  },
  infoText: {
    color: '#888',
  },
});

module.exports = IssueDetailCallout
