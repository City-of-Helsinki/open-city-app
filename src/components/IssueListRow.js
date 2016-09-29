import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image
} from 'react-native';

import distanceIcon from '../img/location_marker.png';

// If distance is over 500km, something is not right
const MAX_DISTANCE_THRESHOLD = 500000;

class IssueListRow extends Component {

  constructor(props, context) {
    super(props, context);
  }

  render() {
    var image = this.props.image !== null ? <Image /> : null;
    var distance = this.props.distance > 0 && this.props.distance < MAX_DISTANCE_THRESHOLD ?
            <View style={styles.distanceContainer}>
              <Image
                style={styles.distanceIcon}
                source={distanceIcon} />
              <Text>{this.props.distance}m</Text>
            </View> : null;
    return (
      <View style={styles.container}>
        {image}
        <View>
          <Text style={styles.titleText}>{this.props.title}</Text>
        </View>
        <View>
          <Text style={styles.descriptionText}>{this.props.description}</Text>
        </View>
        <View style={styles.infoContainer}>
          <View>
            {distance}
          </View>
          <Text>{this.props.date}</Text>
        </View>
        <View style={styles.extendedDataContainer}>
          {this.props.extendedData.map((item) => (
            <View style={styles.extendedDataItemContainer}>
              <View style={[styles.detail, styles.extendedDataRowContainer]}>
                <Text style={styles.detailText}>{item.agency}</Text>
                <Text style={styles.detailText}>{item.date}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    backgroundColor: '#fff',
    padding: 10,
    shadowColor: 'black',
    shadowOpacity: 0.8,
    shadowOffset: {
      height: 0,
      width: 0
    },
  },
  titleText: {
    color: '#000',
    fontSize: 16,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceIcon: {
    height: 12,
    width: 12,
  },
  extendedDataRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  }

});

module.exports = IssueListRow
