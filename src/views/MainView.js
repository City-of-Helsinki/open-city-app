import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  Platform,
  LayoutAnimation,
  BackAndroid,
  Dimensions
} from 'react-native';

import Navbar               from './../components/Navbar';
import Menu                 from './../components/Menu';
import FloatingActionButton from './../components/FloatingActionButton';
import showAlert            from './../components/Alert';
import EmptyMarkerCallout   from './../components/EmptyMarkerCallout';
import MarkerPopup          from './../components/MarkerPopup';
import Config               from './../config.json';
import makeRequest          from './../util/requests';
import Util                 from './../util/util';
import Global               from './../util/globals';
import Models               from './../util/models';
import MapView              from 'react-native-maps';
import Drawer               from 'react-native-drawer'
import Geolib               from 'geolib';
import OverlaySpinner       from 'react-native-loading-spinner-overlay';
import Realm                from 'realm';
import transMap             from '../translations/map';
import transError           from '../translations/errors';
import plusIcon             from '../img/plus.png';
import menuIcon             from '../img/menu.png';
import listIcon             from '../img/list.png';

// Default region set as Helsinki
const DEFAULT_LATITUDE           = 60.1680574;
const DEFAULT_LONGITUDE          = 24.9339746;
const DEFAULT_LATITUDE_DELTA     = 0.02208;
const DEFAULT_LONGITUDE_DELTA    = 0.01010;
const MARKER_IMAGE_SIZE          = 28;

class MainView extends Component {

  constructor(props, context) {
    super(props, context);

    var serviceRequests = typeof this.props.route.serviceRequests !== 'undefined' ? this.props.route.serviceRequests : [];
    this.state = {
      serviceRequests: serviceRequests,       // Data to be shown on the map as markers
      region: {             // Coordinates for the visible area of the map
        latitude: DEFAULT_LATITUDE,
        longitude: DEFAULT_LONGITUDE,
        latitudeDelta: DEFAULT_LATITUDE_DELTA,
        longitudeDelta: DEFAULT_LONGITUDE_DELTA,
      },
      userPosition: {       // The position of the user
        latitude: null,
        longitude: null,
      },
      showPopup: false,     // Show/hide the popup which displays the details of a selected serviceRequest
      isLoading: false,     // Show/hide loading spinner
      popupData: null,      // The data which will be passed to a child component and displayed in the popup
    }

    // Details with default data for marker popups
    this.serviceRequestDetails = {
      title: '',
      description:'',
      extendedData:[],
      agency: '',
      distance: 0,
      date: '',
      media_url: null
    };

    transMap.setLanguage('fi');
    transError.setLanguage('fi');

    Global.mainViewRef = this;
  }

  componentWillMount() {
    if (this.state.serviceRequests.length < 1) {
      this.fetchServiceRequests();
    }
  }

  // Fetch a fixed amount of serviceRequests from Open311 API
  fetchServiceRequests() {
    var url = Config.OPEN311_SERVICE_REQUESTS_URL;
    var headers = {'Accept': 'application/json', 'Content-Type': 'application/json'};

    makeRequest(url, 'GET', headers, null, null)
    .then(result => {
      var serviceRequests = Util.parseServiceRequests(result, Models.fetchAllServiceRequests());
      this.setState({
        serviceRequests: serviceRequests
      });
    }, error => {
      if (error.message === Config.TIMEOUT_MESSAGE) {
        showAlert(transError.serviceNotAvailableErrorTitle,
          transError.serviceNotAvailableErrorMessage, transError.serviceNotAvailableErrorButton);
      } else {
        showAlert(transError.networkErrorTitle, transError.networkErrorMessage,
          transError.networkErrorButton);
      }
    });
  }

  componentDidMount() {
    this.geoLocation();
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  // Fetch users position and set the region of the map accordingly
  geoLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        var region = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: DEFAULT_LATITUDE_DELTA,
          longitudeDelta: DEFAULT_LONGITUDE_DELTA,
        };
        var userPosition = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }
        this.setState({
          region: region,
          userPosition: userPosition
        });
      },
      (error) => {
      },
      {
        enableHighAccuracy: Config.GPS_HIGH_ACCURACY,
        timeout: Config.GPS_TIMEOUT,
        maximumAge: Config.GPS_MAXIMUM_AGE
      }
    );
    this.watchID = navigator.geolocation.watchPosition((position) => {
        var region = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: DEFAULT_LATITUDE_DELTA,
          longitudeDelta: DEFAULT_LONGITUDE_DELTA,
        };
        var userPosition = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }
        this.setState({
          region: region,
          userPosition: userPosition
        });
    });
  }

  // Fetch details of a single serviceRequest
  fetchServiceRequestDetails(serviceRequest) {
    var url = Config.OPEN311_SERVICE_REQUEST_BASE_URL + serviceRequest.id + Config.OPEN311_SERVICE_REQUEST_PARAMETERS_URL;
    var headers = {'Accept': 'application/json', 'Content-Type': 'application/json'};

    makeRequest(url, 'GET', headers, null, null)
    .then(result => {
      var data = Util.parseServiceRequestDetails(result, this.state.userPosition);
      this.setState({
        isLoading: false,
        popupData: data,
      });
    }, error => {
      if (error.message === Config.TIMEOUT_MESSAGE) {
        showAlert(transError.serviceNotAvailableErrorTitle,
          transError.serviceNotAvailableErrorMessage, transError.serviceNotAvailableErrorButton);
      } else {
        showAlert(transError.networkErrorTitle, transError.networkErrorMessage,
          transError.networkErrorButton);
      }
    });
  }

  navToSendServiceRequestView() {
    var mapRegion = {
      latitude: DEFAULT_LATITUDE,
      longitude: DEFAULT_LONGITUDE,
      latitudeDelta: DEFAULT_LATITUDE_DELTA,
      longitudeDelta: DEFAULT_LONGITUDE_DELTA,
    };

    // If users position has been located it will be set as the region for feedback view
    if (this.state.userPosition.latitude !== null && this.state.userPosition.longitude !== null) {
      mapRegion.latitude = this.state.userPosition.latitude;
      mapRegion.longitude = this.state.userPosition.longitude;
    }

    this.props.navigator.push({
      id: 'SendServiceRequestView',
      mapRegion: mapRegion, // Sets default region for the map in feedback view
    });
  }

  navToServiceRequestListView(drawer) {
    drawer.close();
    this.props.navigator.push({
      id: 'ServiceRequestListView',
      userPosition: this.state.userPosition,
    });
  }

  navToAppFeedbackView(drawer) {
    drawer.close();
    this.props.navigator.push({
      id: 'AppFeedbackView'
    });
  }

  // Open a detailed view of the selected serviceRequest
  showServiceRequestDetailPopup(serviceRequest) {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({
      showPopup:true,
      popupData: serviceRequest,
      isLoading: true
    });
  }

  // Hide popup when map is clicked
  onMapViewClick() {
    if (this.state.showPopup) {
      this.setState({
        region: this.state.region,
        showPopup: false,
      });
    }
  }

  // Keep track of mapview region in order for the map not to reset after
  // closing popup which causes UI to refresh
  onMapRegionChange(region) {
    this.setState({
      region: region
    });
  }

  onPopupClick(id) {
    this.props.navigator.push({
      id: 'ServiceRequestDetailView',
      serviceRequestID: id
    });
  }

  // Add opacity to container when drawer is opened
  drawerTweenHandler(ratio) {
    this.refs.shadowOverlay.setNativeProps({
       opacity: Math.max((1 - ratio), 0.5),
       backgroundColor: Global.COLOR.BLACK
    });

    return { }
  }

  render() {
    // Initialize Popup which will be shown when a marker is clicked
    var serviceRequestDetailPopup = this.state.showPopup ?
      <MarkerPopup
        data={this.state.popupData}
        userPosition={this.state.userPosition}
        onClick={()=>this.onPopupClick(this.state.popupData.id)}
        isLoading={this.state.isLoading}
        />
      : null;

    return (
      <Drawer
        ref={(ref) => {
          this._drawer = ref;
          Global.menuRef = ref;
        }}
        type={'overlay'}
        openDrawerOffset={Global.OPEN_DRAWER_OFFSET}
        closedDrawerOffset={0}
        tapToClose={true}
        acceptTap={true}
        captureGestures={'open'}
        onOpen={()=> Global.menuOpen = true}
        onClose={()=> Global.menuOpen = false}
        tweenHandler={(ratio) => this.drawerTweenHandler(ratio)}
        content={
          <Menu
            mapView={()=>{this._drawer.close()}}
            onMenuClick={()=>this._drawer.close()}
            onAppFeedbackClick={()=>this.navToAppFeedbackView(this._drawer)} />
        }>

        <View
          style={styles.container}
          ref='shadowOverlay'>
          <Navbar
            leftIcon={menuIcon}
            onLeftButtonClick={()=>this._drawer.open()}
            rightIcon={listIcon}
            onRightButtonClick={()=>this.navToServiceRequestListView(this._drawer)}
            header={transMap.mapViewTitle} />
          <View style={styles.mapContainer}>
            <MapView
              ref={ref=> this.mapView = ref}
              style={styles.map}
              region={this.state.region}
              showsUserLocation={true}
              followUserLocation={false}
              toolbarEnabled={false}
              onPress={this.onMapViewClick.bind(this)}
              onRegionChangeComplete={this.onMapRegionChange.bind(this)}>
              {this.state.serviceRequests.map(serviceRequest => (
                <MapView.Marker
                  coordinate={serviceRequest.coordinates}
                  onPress={()=> this.showServiceRequestDetailPopup(serviceRequest)}>
                  <Image
                    source={serviceRequest.markerImage}
                    style={styles.markerImage} />
                  <MapView.Callout tooltip={true}>
                    <EmptyMarkerCallout />
                  </MapView.Callout>
                </MapView.Marker>
              ))}
            </MapView>
          </View>
          {serviceRequestDetailPopup}
          {!this.state.showPopup && // When popup is displayed hide FAB because Google Maps toolbar
            <FloatingActionButton   // shows up after a marker is clicked
              icon={plusIcon}
              onButtonClick={()=>this.navToSendServiceRequestView(this)} />}
        </View>
      </Drawer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: Global.COLOR.LIGHT_GREY,
  },
  mapContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  map: {
    flex: 1,
  },
  markerImage: {
    height: MARKER_IMAGE_SIZE,
    width: MARKER_IMAGE_SIZE,
  }
});

BackAndroid.addEventListener('hardwareBackPress', function() {

  // Close menu if it's open otherwise exit the app
  if (Global.menuOpen && Global.menuRef !== null) {
    Global.menuRef.close();
    return true;
  } else if (Global.mainViewRef && Global.mainViewRef.state.showPopup) {
    Global.mainViewRef.setState({ showPopup:false });
    return true;
  } else if (Global.isMainView) {
    BackAndroid.exitApp();
  }

  return false;
});

module.exports = MainView
