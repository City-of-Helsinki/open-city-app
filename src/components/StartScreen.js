import React, {
  Component,
  TouchableWithoutFeedback,
  View,
  Text,
  StyleSheet,
  Image
} from 'react-native';

import IssueList from './Issue/IssueList';
import ServiceRequestMap from './ServiceRequest/ServiceRequestMap';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 21
  },
  issuesButton: {
    flex: 1,
    backgroundColor: '#39A795',
    alignItems: 'center',
    justifyContent: 'center'
  },
  feedbackButton: {
    flex: 1,
    backgroundColor: '#287467',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

class StartScreen extends Component {
  constructor() {
    super();

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
        <TouchableWithoutFeedback onPress={this.onIssuesPress.bind(this)}>
          <View style={styles.issuesButton}>
            <Text>Päätökset</Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={this.onFeedbackPress.bind(this)}>
          <View style={styles.feedbackButton}>
            <Text>Palaute</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

export default StartScreen;
