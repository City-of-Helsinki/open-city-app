import React, {
  Component,
  View,
  Text,
  MapView,
  StyleSheet,
  InteractionManager,
  ActivityIndicatorIOS
} from 'react-native';

import NavBar from '../NavBar/NavBar';

import {getIssuePosition, getIssueCategoryColor} from '../../helpers/issue';
import {calculateDistance} from '../../helpers/map';

import {detailStyles as styles} from './styles';

class IssueDetail extends Component {
  constructor() {
    super();

    this.state = {
      position: null,
      distance: null,
      renderMap: false
    };
  }

  componentWillMount() {
    const position = getIssuePosition(this.props.issue);

    this.setState({
      position,
      distance: calculateDistance(this.props.position.coords, position)
    });

    InteractionManager.runAfterInteractions(() => {
      this.setState({
        renderMap: true
      });
    });
  }

  renderMap() {
    if (!this.state.renderMap) {
      return (
        <View style={styles.map}>
          <ActivityIndicatorIOS style={styles.mapLoader}/>
        </View>
      );
    }

    const {position} = this.state;

    return (
      <MapView
        style={styles.map}
        region={{
            latitude: position.latitude,
            longitude: position.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01
          }}
        annotations={[
            {
              latitude: position.latitude,
              longitude: position.longitude
            }
          ]}
      />
    );
  }

  render() {
    const issue = this.props.issue;
    const {distance} = this.state;

    return (
      <View>
        <NavBar
          title={{ title: 'PÄÄTÖKSET' }}
          leftButton={{
            source: require('../../images/arrow-right.png'),
            handler: (event) => {this.props.navigator.pop();}
          }}
        />
        <View style={[styles.container, {borderTopColor: getIssueCategoryColor(this.props.issue)}]}>
          {this.renderMap()}
          <View style={styles.top}>
            <Text style={styles.subject}>{issue.subject}</Text>
            <Text style={styles.distance}>{Math.round(distance * 10) / 10} km</Text>
          </View>
          <View style={styles.content}>
            <Text style={styles.summary}>{issue.summary}</Text>
          </View>
        </View>
      </View>
    );
  }
}

export default IssueDetail;
