import React, {
  Component,
  TouchableWithoutFeedback,
  View,
  Text,
  StyleSheet
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  subject: {
    fontSize: 20
  }
});

class IssueRow extends Component {
  handlePress(event) {
    this.props.onPress(this.props.issue);
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={this.handlePress.bind(this)}>
        <View style={styles.container}>
          <Text style={styles.subject}>{this.props.issue.subject}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default IssueRow;
