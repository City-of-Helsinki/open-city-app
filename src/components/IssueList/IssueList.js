import React, {
  Component,
  View,
  Text,
  ListView,
  StyleSheet
} from 'react-native';

import IssueRow from '../IssueRow/IssueRow';
import IssueDetail from '../IssueDetail/IssueDetail';

import {findAllIssues} from '../../helpers/issue';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1
  }
});

class IssueList extends Component {
  constructor() {
    super();

    this.state = {
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    };
  }

  componentDidMount() {
    findAllIssues()
      .then(result => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(result.data.objects)
        });
      });
  }

  handlePress(issue) {
    this.props.navigator.push({
      component: IssueDetail,
      passProps: {issue: issue}
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={issue => <IssueRow issue={issue} onPress={this.handlePress.bind(this)} />}
        />
      </View>
    );
  }
}

export default IssueList;
