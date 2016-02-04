import React, {
  Component,
  View,
  Text,
  MapView,
  StyleSheet
} from 'react-native';

import {getIssueCategoryColor} from '../../helpers/issue';
import {calculateDistance} from '../../helpers/map';

const defaultContainerStyle = {
  borderTopColor: '#39A795',
  borderTopWidth: 4,
  marginTop: 80
};

const styles = StyleSheet.create({
  container: defaultContainerStyle,
  map: {
    height: 200
  },
  top: {
    padding: 15
  },
  subject: {
    color: '##4E4D4D',
    fontSize: 18,
    marginBottom: 10
  },
  distance: {
    color: '#D7D7D7',
    fontSize: 14
  },
  content: {
    padding: 15,
    paddingTop: 0
  },
  summary: {
    color: '#A7A7A7',
    fontSize: 18
  }
});

function containerStyle(stripeColor) {
  return {
    ...defaultContainerStyle,
    ...{borderTopColor: stripeColor}
  }
}

class IssueDetail extends Component {
  componentWillMount() {
    this.position = {
      latitude: this.props.issue.geometries[0].coordinates[1],
      longitude: this.props.issue.geometries[0].coordinates[0]
    };
    this.distance = calculateDistance(this.props.position.coords, this.position);
  }

  render() {
    const issue = this.props.issue;

    return (
      <View style={containerStyle(getIssueCategoryColor(this.props.issue))}>
        <MapView
          style={styles.map}
          region={{
            latitude: this.position.latitude,
            longitude: this.position.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01
          }}
          annotations={[
            {
              latitude: this.position.latitude,
              longitude: this.position.longitude
            }
          ]}
        />
        <View style={styles.top}>
          <Text style={styles.subject}>{issue.subject}</Text>
          <Text style={styles.distance}>{Math.round(this.distance * 10) / 10} km</Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.summary}>{issue.summary}</Text>
        </View>
      </View>
    );
  }
}

export default IssueDetail;
