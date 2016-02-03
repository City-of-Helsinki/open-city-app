import React, {
  Component,
  View,
  Text,
  ListView,
  StyleSheet
} from 'react-native';

import IssueRow from '../IssueRow/IssueRow';
import IssueDetail from '../IssueDetail/IssueDetail';

import {findIssuesByLocation} from '../../helpers/issue';
import {calculateBoundingBox, comparePositions} from '../../helpers/map';

const POSITION_UNKNOWN = 'unknown';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1
  }
});

class IssueList extends Component {
  constructor() {
    super();

    this.watchID = null;
    this.previousPosition = null;

    this.state = {
      position: POSITION_UNKNOWN,
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    };
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      position => {
        if (position) {
          this.setState({position: position});
        }
      },
      error => alert(error.message),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );

    this.watchID = navigator.geolocation.watchPosition(position => {
      if (position) {
        this.setState({position: position});
      }
    });
  }

  componentDidUpdate() {
    if (this.hasLocationChanged()) {
      this.updateIssues(this.state.position.coords.latitude, this.state.position.coords.longitude);
      this.previousPosition = this.state.position;
    }
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  hasLocationChanged(){
    return !this.previousPosition || comparePositions(this.previousPosition, this.state.position);
  }

  updateIssues(latitude, longitude) {
    // Nord office coordinates (Runeberginkatu 43)
    latitude = 60.175883;
    longitude = 24.922350;
    // TODO: Use device coordinates
    findIssuesByLocation(calculateBoundingBox(latitude, longitude, 1))
      .then(result => {
        if (result.data.objects) {
          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(result.data.objects)
          });
        }
      })
      .catch(err => alert(err));
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
          renderRow={issue => <IssueRow issue={issue} onPress={this.handlePress.bind(this)}/>}
        />
      </View>
    );
  }
}

export default IssueList;
