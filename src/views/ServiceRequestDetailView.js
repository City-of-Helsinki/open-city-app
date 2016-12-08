import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  Platform,
  BackAndroid,
  ScrollView,
  Dimensions,
  TouchableWithoutFeedback,
  Modal
} from 'react-native';

import Drawer           from 'react-native-drawer'
import MapView          from 'react-native-maps';
import Navbar           from './../components/Navbar';
import Spinner          from './../components/Spinner';
import Menu             from './../components/Menu';
import showAlert        from './../components/Alert';
import makeRequest      from './../util/requests';
import Util             from './../util/util';
import Global           from './../util/globals';
import Config           from './../config';
import ImageView        from './ImageView';
import backIcon         from '../img/back.png';
import markerIcon       from '../img/location_marker.png';
import transError       from '../translations/errors';

// Margin for the view containing status notes about the service request
const RESPONSE_VIEW_OFFSET = 32;

// Zoom for the map showing service request location
const LATITUDE_DELTA       = 0.00680;
const LONGITUDE_DELTA      = 0.00340;

// Display information about a single service request
class ServiceRequestDetailView extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      isLoading: typeof this.props.route.serviceRequestID !== 'undefined', // Spinner wont be set if data is passed as a prop
      data: '',
    };

    transError.setLanguage('fi');

    Global.isMainView = false;
    Global.navigatorRef = this.props.navigator;
  }

  // When navigating from map the details need to be fetched from the API, when navigating from
  // ServiceRequestListView data is passed as a prop
  componentDidMount() {
    if (typeof this.props.route.serviceRequestID !== 'undefined') {
      this.fetchServiceRequestDetails(this.props.route.serviceRequestID);
    } else {
      this.setState({
        data: this.props.route.data
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
            onPress={()=>this.props.navigator.push({id: 'ImageView', imageUrl: image})}>
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
        <Navbar
          leftIcon={backIcon}
          onLeftButtonClick={()=>this.props.navigator.pop()}
          header={viewTitle} />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: Global.COLOR.LIGHT_GREY,
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  horizontalScrollView: {
    marginTop: 16,
  },
  map: {
    height: 96,
    width: 192,
    marginLeft: 8
  },
  markerIcon: {
    height: 32,
    width: 32
  },
  image: {
    height: 96,
    width: 96,
    marginLeft: 8,
    marginRight: 8,
  },
  descriptionView: {
    width: Dimensions.get('window').width,
    padding: 16,
  },
  titleText: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
    color: Global.COLOR.BLACK
  },
  descriptionText: {
    fontSize: 14,
    color: Global.COLOR.BLACK
  },
  responseView: {
    width: Dimensions.get('window').width - RESPONSE_VIEW_OFFSET,
    alignSelf: 'flex-end',
    backgroundColor: Global.COLOR.LIGHT_BLUE,
    padding: 16,
    borderLeftWidth: 2,
    borderLeftColor: Global.COLOR.BLUE
  },
  responseText: {
    fontSize: 12,
    color: Global.COLOR.BLUE
  },
  statusView: {
    width: Dimensions.get('window').width,
    padding: 16,
  },
  statusText: {
    fontSize: 14,
    color: Global.COLOR.WARM_GREY,
    flexWrap: 'wrap',
    flex: 1
  },
  extendedDataItemContainer: {
    flexDirection: 'column',
  },
  extendedDataItemView: {
    flex: 1,
  }
});

module.exports = ServiceRequestDetailView
