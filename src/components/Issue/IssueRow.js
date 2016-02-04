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

    this.state = {
      distance: null
    };
  }

  componentWillMount() {
    const position = getIssuePosition(this.props.issue);

    if (position) {
      this.setState({
        distance: calculateDistance(this.props.position.coords, position)
      });
    }
  }

  handlePress(event) {
    this.props.onPress(this.props.issue);
  }

  renderDistance() {
    if (!this.state.distance) {
      return null;
    }

    return (<Text style={styles.distance}>{Math.round(this.state.distance * 10)  / 10} km</Text>);
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={this.handlePress.bind(this)}>
        <View style={[styles.container, {borderLeftColor: getIssueCategoryColor(this.props.issue)}]}>
          <Text style={styles.subject}>{this.props.issue.subject}</Text>
          <Text style={styles.address}>{getIssueAddressText(this.props.issue)}</Text>
          {this.renderDistance()}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default IssueRow;
