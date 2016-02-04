import React, {
  Component,
  View,
  Text,
  StyleSheet
} from 'react-native';

import {getIssueCategoryColor} from '../../helpers/issue';
import {calculateDistance} from '../../helpers/map';

const defaultContentStyle = {
  borderTopColor: '#39A795',
  borderTopWidth: 4,
  padding: 10
};

const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  top: {
    padding: 10
  },
  content: defaultContentStyle,
  subject: {
    color: '##4E4D4D',
    fontSize: 18,
    marginBottom: 10
  },
  distance: {
    color: '#D7D7D7',
    fontSize: 14
  },
  summary: {
    color: '#A7A7A7',
    fontSize: 18
  }
});

function contentStyle(stripeColor) {
  return {
    ...defaultContentStyle,
    ...{borderTopColor: stripeColor}
  }
}

class IssueDetail extends Component {
  componentWillMount() {
    this.distance = calculateDistance(this.props.position.coords, {
      latitude: this.props.issue.geometries[0].coordinates[1],
      longitude: this.props.issue.geometries[0].coordinates[0]
    });
  }

  render() {
    const issue = this.props.issue;

    return (
      <View style={styles.container}>
        <View style={styles.top}>
          <Text style={styles.subject}>{issue.subject}</Text>
          <Text style={styles.distance}>{Math.round(this.distance * 10)  / 10} km</Text>
        </View>
        <View style={contentStyle(getIssueCategoryColor(this.props.issue))}>
          <Text style={styles.summary}>{issue.summary}</Text>
        </View>
      </View>
    );
  }
}

export default IssueDetail;
