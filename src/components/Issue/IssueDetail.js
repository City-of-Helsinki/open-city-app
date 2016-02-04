import React, {
  Component,
  View,
  Text,
  StyleSheet
} from 'react-native';

import NavBar from '../NavBar/NavBar';
import NavBarImageButton from '../NavBar/NavBarImageButton';

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
        <NavBar
          title={{ title: 'PÄÄTÖKSET' }}
          leftButton={
            <NavBarImageButton
              source={require('../../images/arrow-right.png')}
              handler={(event) => {this.props.navigator.pop();}}
              />
          }
        />
        <Text style={styles.subject}>{issue.subject}</Text>
        <Text style={styles.summary}>{issue.summary}</Text>
      </View>
    );
  }
}

export default IssueDetail;
