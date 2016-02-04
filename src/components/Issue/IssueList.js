import React, {
  Component,
  View,
  Text,
  ListView,
  StyleSheet
} from 'react-native';

import NavBar from '../NavBar/NavBar';
import IssueRow from '../Issue/IssueRow';
import IssueDetail from '../Issue/IssueDetail';

import {findIssues} from '../../helpers/issue';
import {calculateBoundingBox, comparePositions} from '../../helpers/map';

const PAGE_SIZE = 20;

import {listStyles as styles} from './styles';

class IssueList extends Component {
  constructor() {
    super();

    this.watchID = null;

    this.state = {
      position: null,
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      pageNumber: 0
    };
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      position => {
        if (position) {
          this.setState({position});
        }
      },
      error => alert(error.message),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );

    this.watchID = navigator.geolocation.watchPosition(position => {
      if (position) {
        this.setState({position});
      }
    });
  }

  componentWillUpdate(nextProps, nextState) {
    if ((!this.state.position && nextState.position) || comparePositions(this.state.position, nextState.position)) {
      this.loadIssues(nextState.position);
    }
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  loadIssues(position) {
    if (position) {
      findIssues({
        bbox: calculateBoundingBox(position.coords, 1),
        offset: PAGE_SIZE * (this.state.pageNumber - 1),
        limit: PAGE_SIZE
      })
        .then(result => {
          if (result.data.objects) {
            this.setState({
              dataSource: this.state.dataSource.cloneWithRows(result.data.objects),
              pageNumber: this.state.pageNumber + 1
            });
          }
        })
        .catch(err => alert(err));
    }
  }

  handlePress(issue) {
    this.props.navigator.push({
      component: IssueDetail,
      passProps: {
        issue: issue,
        position: this.state.position
      }
    });
  }

  render() {
    const position = this.state.position;

    return (
      <View style={styles.container}>
        <NavBar title={{title: 'PÄÄTÖKSET'}}/>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={issue => <IssueRow issue={issue} position={position} onPress={this.handlePress.bind(this)} />}
          renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={styles.separator} />}
          onEndReached={this.loadIssues.bind(this)}
          style={styles.list}
        />
      </View>
    );
  }
}

export default IssueList;
