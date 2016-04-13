import React, {
  Component,
  View,
  Text,
  StyleSheet,
  Dimensions,
  InteractionManager
} from 'react-native';

import MapView from 'react-native-maps';
import { forEach } from 'lodash';

import NavBar from '../NavBar/NavBar';
import ActivityIndicator from '../ActivityIndicator';
import ServiceRequestForm from './ServiceRequestForm';

import translationsGeneral from '../../translations/general';
import translationsServiceRequest from '../../translations/serviceRequest';

import { mapStyles as styles } from './styles';

import { findServiceRequests } from '../../helpers/service-request';

const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class ServiceRequestMap extends Component {
  constructor() {
    super();

    translationsGeneral.setLanguage('fi');
    translationsServiceRequest.setLanguage('fi');

    this.watchID = null;
    this.position = null;

    this.state = {
      loading: false,
      position: null,
      region: null,
      renderMap: false,
      serviceRequests: null
    };
  }

  /**
   *
   */
  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      position => {
        if (position) {
          this.setState({ position });
        }
      },
      error => alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );

    this.watchID = navigator.geolocation.watchPosition(position => {
      if (position) {
        this.position = position;
      }
    });
  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        renderMap: true
      });
    });
  }

  /**
   *
   * @param nextProps
   * @param nextState
   */
  componentWillUpdate(nextProps, nextState) {
    if (!this.state.position && nextState.position) {
      this.loadServiceRequests(nextState.position);
    }
  }

  /**
   *
   */
  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);

  }

  /**
   *
   * @param position
   * @param reset
   */
  loadServiceRequests(position) {
    if (!this.state.isLoading && position) {
      this.setState({
        isLoading: true
      });

      findServiceRequests({
        lat: position.coords.latitude,
        lon: position.coords.longitude,
        radius: 100//,
        //status: 'open'
      })
        .then(result => {
          console.log('findServiceRequests result:', result);

          if (result.data) {
            this.setState({
              serviceRequests: result.data,
              isLoading: false
            });
          }
        })
        .catch(err => alert(err));
    }
  }

  /**
   *
   * @param coordinates
   */
  onMapRegionChange(coordinates) {
    this.loadServiceRequests({
      coords: { latitude: coordinates.latitude, longitude: coordinates.longitude }
    });
  }

  /**
   *
   * @returns {XML}
   */
  renderMap() {
    if (!this.state.renderMap && this.state.position) {
      return (
        <View style={styles.map}>
          <ActivityIndicator style={styles.mapLoader}/>
        </View>
      );
    }

    return (
      <View style={styles.mapContainer}>
        <MapView.Animated
          style={styles.map}
          showsUserLocation={true}
          followUserLocation={false}
          onRegionChangeComplete={this.onMapRegionChange.bind(this)}
        >
          {this.renderMapMarkers()}
        </MapView.Animated>
      </View>
    );
  }

  /**
   *
   * @returns {*}
   */
  renderMapMarkers() {
    if (!this.state.serviceRequests) {
      return null;
    }

    let markers = [];

    forEach(this.state.serviceRequests, (serviceRequest, i) => {
      if (!serviceRequest.lat) {
        return;
      }

      markers.push((
        <MapView.Marker
          key={'map-marker-' + i}
          coordinate={{latitude: serviceRequest.lat, longitude: serviceRequest.long}}
        >
          <MapView.Callout>
              {this.renderMapMarkerTitle(serviceRequest)}
              <View style={{ paddingRight: 40 }}>
                <Text>{serviceRequest.description}</Text>
              </View>
          </MapView.Callout>
        </MapView.Marker>
      ));
    });

    return markers;
  }

  renderMapMarkerTitle(serviceRequest) {
    if (!serviceRequest.address) {
      return null;
    }

    return (
      <Text style={{ marginBottom: 10, fontWeight: 'bold' }}>{serviceRequest.address}</Text>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <NavBar title={{title: translationsServiceRequest.serviceRequestTitle}}
                leftButton={{
                  source: require('../../images/arrow-right.png'),
                  handler: () => {this.props.navigator.pop();}
                }}
                rightButton={{
                  title: '+',
                  handler: () => {this.props.navigator.push({
                    component: ServiceRequestForm
                  });}
                }}
        />
        {this.renderMap()}
      </View>
    );
  }
}

export default ServiceRequestMap;
