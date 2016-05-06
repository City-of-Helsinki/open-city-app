import React, {
  Component,
  TouchableWithoutFeedback,
  View,
  Text,
  StyleSheet,
  Image
} from 'react-native';

import NavBar from './NavBar/NavBar';
import IssueList from './Issue/IssueList';
import ServiceRequestMap from './ServiceRequest/ServiceRequestMap';

import translationsGeneral from '../translations/general';
import translationsIssue from '../translations/issue';
import translationsServiceRequest from '../translations/serviceRequest';

import {
    COLOR_BLUE
} from '../constants/color';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  issuesButton: {
    flex: 1,
    backgroundColor: '#39A795',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopColor: COLOR_BLUE,
    borderTopWidth: 4
  },
  serviceRequestButton: {
    flex: 1,
    backgroundColor: '#287467',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

class StartScreen extends Component {
  constructor() {
    super();

    translationsGeneral.setLanguage('fi');
    translationsIssue.setLanguage('fi');
    translationsServiceRequest.setLanguage('fi');

    this.state = {};
  }

  componentDidMount() {
    console.log(this.props, this.refs);
  }

  onIssuesPress() {
    this.props.navigator.push({
      component: IssueList
    });
  }

  onFeedbackPress() {
    this.props.navigator.push({
      component: ServiceRequestMap
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <NavBar title={{title: translationsGeneral.startScreenTitle}}/>
        <TouchableWithoutFeedback onPress={this.onIssuesPress.bind(this)}>
          <View style={styles.issuesButton}>
            <Text>{translationsIssue.issueListTitle}</Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={this.onFeedbackPress.bind(this)}>
          <View style={styles.serviceRequestButton}>
            <Text>{translationsServiceRequest.serviceRequestTitle}</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

export default StartScreen;
