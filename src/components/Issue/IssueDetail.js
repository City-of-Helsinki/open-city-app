import React, {
  Component,
  View,
  Text,
  MapView,
  StyleSheet
} from 'react-native';

import NavBar from '../NavBar/NavBar';
import NavBarButton from '../NavBar/NavBarButton';

import {getIssueCategoryColor} from '../../helpers/issue';
import {calculateDistance} from '../../helpers/map';

import {detailStyles as styles} from './styles';

class IssueDetail extends Component {
  componentWillMount() {
    this.position = {
      latitude: this.props.issue.geometries[0].coordinates[1],
      longitude: this.props.issue.geometries[0].coordinates[0]
    };
    this.distance = calculateDistance(this.props.position.coords, this.position);
  }

  render() {
    const issue = this.props.issue;

    return (
      <View>
        <NavBar
          title={{ title: 'PÄÄTÖKSET' }}
          leftButton={
            <NavBarButton
              source={require('../../images/arrow-right.png')}
              handler={(event) => {this.props.navigator.pop();}}
            />
          }
        />
        <View style={[styles.container, {borderTopColor: getIssueCategoryColor(this.props.issue)}]}>
          <MapView
            style={styles.map}
            region={{
            latitude: this.position.latitude,
            longitude: this.position.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01
          }}
            annotations={[
            {
              latitude: this.position.latitude,
              longitude: this.position.longitude
            }
          ]}
          />
          <View style={styles.top}>
            <Text style={styles.subject}>{issue.subject}</Text>
            <Text style={styles.distance}>{Math.round(this.distance * 10) / 10} km</Text>
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
