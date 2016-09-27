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
import Util    from './../util/util';

import closeIcon from './../img/close.png';

const SIDE_PADDING         = 32;
const TOP_MARGIN           = Platform.OS === 'android' ? 60 : 75;
const BOTTOM_MARGIN        = 320;
const CLOSE_ICON_HEIGHT    = 42;
const CLOSE_ICON_WIDTH     = 42;
const CONTAINER_MAX_HEIGHT = Dimensions.get('window').height - TOP_MARGIN - BOTTOM_MARGIN;

const F_RECEIVED = 'Palaute vastaanotettu';
const F_INPROCESS = 'Palaute käsittelyssä';
const F_PROCESSED = 'Palaute käsitelty';

class IssueDetailMarkerView extends Component {
  constructor(props, context) {
    super(props, context);
    this.issueDetails;
  }

  componentWillMount() {
    this.issueDetails = Util.parseIssueDetails(this.props.data, this.props.userPosition);

    console.log('done parse')
    console.log(this.issueDetails.extendedData)
  }

  render() {
    var extendedItems = null;

    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.issueContainer}>
            <View style={styles.subjectView}>
              <Text style={[styles.text, styles.title]}>{this.issueDetails.title}</Text>
            </View>
            <View style={styles.summaryView}>
              <Text style={styles.text}>{this.issueDetails.description}</Text>
            </View>
            <View style={[styles.detail, styles.rowContainer]}>
              <Text style={styles.infoText}>{this.issueDetails.distance}m</Text>
              <Text style={styles.infoText}>{this.issueDetails.date}</Text>
            </View>
          </View>
          <View style={styles.extendedDataContainer}>
            {this.issueDetails.extendedData.map((item) => (
              <View style={styles.extendedDataItemContainer}>
                <View style={[styles.detail, styles.rowContainer]}>
                  <Text style={styles.detailText}>{item.agency}</Text>
                  <Text style={styles.detailText}>{item.date}</Text>
                </View>
              </View>
            ))}
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
    top: Dimensions.get('window').height / 4,
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
  extendedDataContainer: {
    flexDirection: 'column',
    alignItems: 'stretch',
    marginTop: 20,
  },
  detailText: {
    fontSize: 12,
  },
});

module.exports = IssueDetailMarkerView
