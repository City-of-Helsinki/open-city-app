import React, {
  Component,
  View,
  Text,
  StyleSheet
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  subject: {
    fontSize: 24,
    marginBottom: 24
  },
  summary: {
    fontSize: 16
  }
});

class IssueDetail extends Component {
  render() {
    const issue = this.props.issue;

    return (
      <View style={styles.container}>
        <Text style={styles.subject}>{issue.subject}</Text>
        <Text style={styles.summary}>{issue.summary}</Text>
      </View>
    );
  }
}

export default IssueDetail;
