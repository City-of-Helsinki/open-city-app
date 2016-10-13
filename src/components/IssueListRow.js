import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  LayoutAnimation,
  Dimensions
} from 'react-native';

import distanceIcon from '../img/location_marker.png';
import transList    from '../translations/list';

// If distance is over 500km, something is not right
const MAX_DISTANCE_THRESHOLD = 500000;

class IssueListRow extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      showStatusNotes: false,
    };
    transList.setLanguage('fi');
  }

  showStatusNotesClick() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    this.setState({
      showStatusNotes: !this.state.showStatusNotes,
    });
  }

  render() {
    var image = this.props.image !== null ? <Image style={styles.image} source={{uri: this.props.image}} /> : null;
    var distance = this.props.distance > 0 && this.props.distance < MAX_DISTANCE_THRESHOLD ?
            <View style={styles.distanceContainer}>
              <Image
                style={styles.distanceIcon}
                source={distanceIcon} />
              <Text style={styles.textFont}>{this.props.distance}m</Text>
            </View> : null;
    var statusButtonText = !this.state.showStatusNotes ? transList.showStatusNotes : transList.hideStatusNotes;
    var statusNotes      = this.state.showStatusNotes ?
                           <View>
                             <Text style={[styles.statusNotesText, styles.textFont]}>{this.props.statusNotes}</Text>
                           </View> : null;
    return (
      <View style={styles.container}>
        {image}
        <View style={styles.textContainer}>
          <View>
            <Text style={[styles.titleText, styles.textFont]}>{this.props.title}</Text>
          </View>
          <View>
            <Text style={[styles.descriptionText, styles.textFont]}>{this.props.description}</Text>
          </View>
          <View style={styles.infoContainer}>
            <View>
              {distance}
            </View>
            <Text style={styles.textFont}>{this.props.date}</Text>
          </View>
          <View style={styles.paddingContainer}>
            <View style={styles.statusNotesContainer}>
              {statusNotes}
              <TouchableWithoutFeedback onPress={this.showStatusNotesClick.bind(this)}>
                <View style={styles.statusButtonView}>
                  <Text style={[styles.statusButtonText, styles.textFont]}>{statusButtonText}</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
            <View style={styles.extendedDataContainer}>
              {this.props.extendedData.map((item) => (
                <View style={styles.extendedDataItemContainer}>
                  <View>
                    <Text style={[styles.stateText, styles.textFont]}>{item.state}</Text>
                  </View>
                  <View style={[styles.detail, styles.extendedDataRowContainer]}>
                    <Text style={[styles.detailText, styles.textFont]}>{item.agency}</Text>
                    <Text style={[styles.detailText, styles.textFont]}>{item.date}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    shadowColor: 'black',
    shadowOpacity: 0.8,
    shadowOffset: {
      height: 0,
      width: 0
    },
  },
  textContainer: {
    marginBottom: 10,
    backgroundColor: '#fff',
    padding: 10,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  paddingContainer: {
    paddingLeft: 30,
  },
  image: {
    height: 300,
    width: Dimensions.get('window').width - 20,
  },
  titleText: {
    color: '#212121',
    fontSize: 16,
    fontWeight: 'bold',
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceIcon: {
    height: 12,
    width: 12,
  },
  statusNotesText: {
    fontStyle: 'italic',
  },
  statusButtonView: {
    paddingTop: 5,
    paddingBottom: 5,
  },
  statusButtonText: {
    fontSize: 16,
    textAlign: 'left',
    fontWeight: 'bold',
    color: '#546E7A',
  },
  extendedDataRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  stateText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#212121',
  },
  textFont: {
    fontFamily: 'montserrat',
  },
  detailText: {
    color: '#757575',
  }

});

module.exports = IssueListRow
