import React, {
  Component,
  TouchableWithoutFeedback,
  View,
  Text,
  StyleSheet
} from 'react-native';

import {getIssueAddressText, getIssueCategoryColor} from '../../helpers/issue';
import {calculateDistance} from '../../helpers/map';

import {rowStyles as styles} from './styles';

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
        <View style={[styles.container, {borderLeftColor: getIssueCategoryColor(this.props.issue)}]}>
          <Text style={styles.subject}>{this.props.issue.subject}</Text>
          <Text style={styles.address}>{getIssueAddressText(this.props.issue)}</Text>
          <Text style={styles.distance}>{Math.round(this.distance * 10)  / 10} km</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default IssueRow;
