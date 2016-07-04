import React, { Component, PropTypes } from 'react';
import {
  TouchableWithoutFeedback,
  View,
  Text,
  StyleSheet,
  Image
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

    return (
      <View style={styles.distance}>
        <View style={styles.distanceIcon}><Image source={require('../../images/pin.png')} /></View>
        <Text style={styles.distanceText}>{Math.round(this.state.distance * 10)  / 10} km</Text>
      </View>
    );
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
