import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image
} from 'react-native';

import distanceIcon from '../img/location_marker.png';

class IssueListRow extends Component {

  constructor(props, context) {
    super(props, context);
  }

  render() {
    var image = this.props.image !== null ? <Image /> : null;
    return (
      <View style={styles.container}>
        {image}
        <View>
          <Text>{this.props.title}</Text>
        </View>
        <View>
          <Text>{this.props.description}</Text>
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.distanceContainer}>
            <Image
              style={styles.distanceIcon}
              source={distanceIcon} />
            <Text>{this.props.distance}</Text>
          </View>
          <Text>{this.props.date}</Text>
        </View>
        <View style={styles.extendedDataContainer}>
          {this.props.extendedData.map((item) => (
            <View style={styles.extendedDataItemContainer}>
              <View style={[styles.detail, styles.rowContainer]}>
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
  },

  distanceContainer: {
    flexDirection: 'row',
  },
  distanceIcon: {
    height: 12,
    width: 12,
  }

});

module.exports = IssueListRow
