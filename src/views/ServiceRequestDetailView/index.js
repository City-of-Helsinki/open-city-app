import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  Platform,
  BackAndroid,
  ScrollView,
  TouchableWithoutFeedback
} from 'react-native';

import Drawer           from 'react-native-drawer'
import MapView          from 'react-native-maps';
import Navbar           from './../../components/Navbar';
import NavButton        from './../../components/Navbar';
import Spinner          from './../../components/Spinner';
import Menu             from './../../components/Menu';
import showAlert        from './../../components/Alert';
import makeRequest      from './../../util/requests';
import Util             from './../../util/util';
import Global           from './../../util/globals';
import Config           from './../../config';
import ImageView        from '../ImageView';
import backIcon         from '../../img/back.png';
import markerIcon       from '../../img/location_marker.png';
import transError       from '../../translations/errors';
import styles           from './styles';

// Zoom for the map showing service request location
const LATITUDE_DELTA       = 0.00680;
const LONGITUDE_DELTA      = 0.00340;

// Display information about a single service request
class ServiceRequestDetailView extends Component {

  static navigationOptions = ({navigation}) => {
    return {
      headerTitle: (
        <Image
          style={styles.headerLogo}
          resizeMode="contain"
          source={require('./../../img/city-logo.png')}
        />
      ),
      headerRigh: (
        <View />
      )
    }
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      isLoading: this.props.navigation.state.params.serviceRequestID ? true : false, // Spinner wont be set if data is passed as a prop
      data: '',
    };

    transError.setLanguage('fi');

    Global.isMainView = false;
  }

  // When navigating from map the details need to be fetched from the API, when navigating from
  // ServiceRequestListView data is passed as a prop
  componentDidMount() {
    if (this.props.navigation.state.params.serviceRequestID) {
      this.fetchServiceRequestDetails(this.props.navigation.state.params.serviceRequestID);
    } else {
      this.setState({
        data: this.props.navigation.state.params.data
      });
    }
  }

  // Fetch details of the selected service request
  fetchServiceRequestDetails(id) {
    var url = Config.OPEN311_SERVICE_REQUEST_BASE_URL + id + Config.OPEN311_SERVICE_REQUEST_PARAMETERS_URL;
    var headers = {'Accept': 'application/json', 'Content-Type': 'application/json'};

    makeRequest(url, 'GET', headers, null, null)
    .then(result => {
      var data = Util.parseServiceRequestDetails(result, this.state.userPosition);
      this.setState({
        isLoading: false,
        data: data,
      });
    }, error => {
      this.setState({ isLoading: false });
      if (error.message === Config.TIMEOUT_MESSAGE) {
        showAlert(transError.serviceNotAvailableErrorTitle,
          transError.serviceNotAvailableErrorMessage, transError.serviceNotAvailableErrorButton);
      } else {
        showAlert(transError.networkErrorTitle, transError.networkErrorMessage,
          transError.networkErrorButton);
      }
    });
  }

  setModalVisible(visible) {
    this.setState({
      modalVisible: visible
    });
  }

  render() {
    var viewTitle = this.state.data.date !== null &&
      typeof this.state.data.date !== 'undefined' ?
      this.state.data.date : '';
    var map = null;
    var images = [];

    // Add all images into an array
    if (typeof this.state.data.media_urls !== 'undefined' && this.state.data.media_urls.length > 0) {
      for (var i=0; i < this.state.data.media_urls.length; i++) {
        var image = this.state.data.media_urls[i];
        images.push(
          <TouchableWithoutFeedback
            onPress={()=>this.props.navigation.navigate('ImageView', {
              imageUrl: image})
            }>
            <Image
              source={{uri: this.state.data.media_urls[i]}}
              style={styles.image} />
          </TouchableWithoutFeedback>);
      }
    }

    // If the service request has coordinates, create a mapview with a marker
    if (typeof this.state.data.coordinates !== 'undefined' && this.state.data.coordinates !== null) {
      var region = {
        latitude: this.state.data.coordinates.latitude,
        longitude: this.state.data.coordinates.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      };

      map =  <MapView
              ref={ref=> this.mapView = ref}
              style={styles.map}
              region={region}
              showsUserLocation={false}
              followUserLocation={false}
              toolbarEnabled={false}
              scrollEnabled={false}
              zoomEnabled={false}>
              <MapView.Marker
                coordinate={this.state.data.coordinates}>
                <Image
                  source={markerIcon}
                  style={styles.markerIcon} />
              </MapView.Marker>
            </MapView>
    }

    return (
      <View style={styles.container}>

        <View style={styles.contentContainer}>
          {this.state.isLoading &&
            <Spinner color={'black'} visible={this.state.isLoading} />
          }
          {!this.state.isLoading && this.state.data !== '' &&
          <ScrollView>
            <View style={styles.horizontalScrollView}>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}>
                <Image                      // This hidden image allows the marker icon to be rendered properly
                  source={markerIcon}       // This is an Android issue in react-native-maps
                  style={{height: 0, width: 0}} />
                {map}
                {images}
              </ScrollView>
            </View>
            <View style={styles.descriptionView}>
              <Text style={styles.titleText}>{this.state.data.title}</Text>
              <Text style={styles.descriptionText}>{this.state.data.description}</Text>
            </View>
            {this.state.data.status_notes !== ''&&
              <View style={styles.responseView}>
                <Text style={styles.responseText}>{this.state.data.status_notes}</Text>
              </View>
            }
            <View style={styles.statusView}>
              {this.state.data.extendedData.map((item) => (
                <View style={styles.extendedDataItemContainer}>
                  <View style={styles.extendedDataItemView}>
                    <Text style={styles.statusText}>{item.date} {item.state}</Text>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
          }
        </View>
      </View>
    );
  }
}

module.exports = ServiceRequestDetailView
