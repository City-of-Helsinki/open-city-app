import React, {
  Component,
  TouchableWithoutFeedback,
  View,
  Text,
  StyleSheet
} from 'react-native';

import {getIssuePosition, getIssueAddressText, getIssueCategoryColor} from '../../helpers/issue';
import {calculateDistance} from '../../helpers/map';

import {rowStyles as styles} from './styles';

class IssueRow extends Component {
  constructor() {
    super();

    this.distance = null;
  }

  componentWillMount() {
    this.setState({
      distance: calculateDistance(this.props.position.coords, getIssuePosition(this.props.issue))
    });
  }

  handlePress(event) {
    this.props.onPress(this.props.issue);
  }

  render() {
    const distance = this.state.distance;

    return (
      <TouchableWithoutFeedback onPress={this.handlePress.bind(this)}>
        <View style={[styles.container, {borderLeftColor: getIssueCategoryColor(this.props.issue)}]}>
          <Text style={styles.subject}>{this.props.issue.subject}</Text>
          <Text style={styles.address}>{getIssueAddressText(this.props.issue)}</Text>
          <Text style={styles.distance}>{Math.round(distance * 10)  / 10} km</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default IssueRow;
