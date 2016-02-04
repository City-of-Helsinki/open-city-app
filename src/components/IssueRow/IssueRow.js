import React, {
  Component,
  TouchableWithoutFeedback,
  View,
  Text,
  StyleSheet
} from 'react-native';

import {getIssueAddressText, getIssueCategoryColor} from '../../helpers/issue';
import {calculateDistance} from '../../helpers/map';

const defaultContainerStyle = {
  borderLeftColor: '#39A795',
  borderLeftWidth: 4,
  borderBottomColor: '#DFDEDE',
  borderBottomWidth: 1,
  padding: 20
};

const styles = StyleSheet.create({
  container: defaultContainerStyle,
  subject: {
    color: '##4E4D4D',
    fontSize: 18,
    marginBottom: 10
  },
  address: {
    color: '#A7A7A7',
    fontSize: 18,
    marginBottom: 10
  },
  distance: {
    color: '#D7D7D7',
    fontSize: 14
  }
});

function containerStyle(stripeColor) {
  return {
    ...defaultContainerStyle,
    ...{borderLeftColor: stripeColor}
  }
}

class IssueRow extends Component {
  constructor() {
    super();

    this.distance = null;
  }

  componentWillMount() {
    this.distance = calculateDistance(this.props.position.coords, {
      latitude: this.props.issue.geometries[0].coordinates[1],
      longitude: this.props.issue.geometries[0].coordinates[0]
    });
  }

  handlePress(event) {
    this.props.onPress(this.props.issue);
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={this.handlePress.bind(this)}>
        <View style={containerStyle(getIssueCategoryColor(this.props.issue))}>
          <Text style={styles.subject}>{this.props.issue.subject}</Text>
          <Text style={styles.address}>{getIssueAddressText(this.props.issue)}</Text>
          <Text style={styles.distance}>{Math.round(this.distance * 10)  / 10} km</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default IssueRow;
