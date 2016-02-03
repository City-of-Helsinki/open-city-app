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
          // Nord office coordinates (Runeberginkatu 43)
          position.coords.latitude = 60.175883;
          position.coords.longitude = 24.922350;
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
      this.updateIssues(this.state.position.coords);
      this.previousPosition = this.state.position;
    }
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  hasLocationChanged(){
    return !this.previousPosition || comparePositions(this.previousPosition, this.state.position);
  }

  updateIssues(coords) {
    console.log(calculateBoundingBox(coords, 1));
    findIssuesByLocation(calculateBoundingBox(coords, 1))
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
    const position = this.state.position;

    return (
      <View style={styles.container}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={issue => <IssueRow issue={issue} position={position} onPress={this.handlePress.bind(this)}/>}
        />
      </View>
    );
  }
}

export default IssueList;
