import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
  Platform,
  LayoutAnimation,
  BackAndroid,
  AppState
} from 'react-native';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import AuthActions from '../redux/auth/actions';

import MapView              from 'react-native-maps';
import Drawer               from 'react-native-drawer'
import Geolib               from 'geolib';
import OverlaySpinner       from 'react-native-loading-spinner-overlay';
import Realm                from 'realm';
import Navbar               from '../../components/Navbar';
import Menu                 from '../../components/Menu';
import FloatingActionButton from '../../components/FloatingActionButton';
import showAlert            from '../../components/Alert';
import EmptyMarkerCallout   from '../../components/EmptyMarkerCallout';
import MarkerPopup          from '../../components/MarkerPopup';
import Config               from '../../config.json';
import makeRequest          from '../../util/requests';
import Util                 from '../../util/util';
import Global               from '../../util/globals';
import Models               from '../../util/models';
import transMap             from '../../translations/map';
import transError           from '../../translations/errors';
import plusIcon             from '../../img/plus.png';
import menuIcon             from '../../img/menu.png';
import listIcon             from '../../img/list.png';
import styles               from './styles';

// Default region set as Helsinki
const DEFAULT_LATITUDE           = 60.1680574;
const DEFAULT_LONGITUDE          = 24.9339746;
const DEFAULT_LATITUDE_DELTA     = 0.02208;
const DEFAULT_LONGITUDE_DELTA    = 0.01010;

class MainView extends Component {

  constructor(props, context) {
    super(props, context);

    var serviceRequests = (this.props.navigation.state.params && this.props.navigation.state.params.serviceRequests) ? this.props.navigation.state.params.serviceRequests : [];
    this.state = {
      serviceRequests: [],       // Data to be shown on the map as markers
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
    Global.isMainView = true;
  }

  componentWillMount() {
    // Fetch service requests if they haven't been included as props
    if (this.state.serviceRequests.length < 1) {
      this.fetchServiceRequests();
    }
  }

  componentDidMount() {
    this.geoLocation();
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  shouldComponentUpdate() {
    // Set global references after view is popped
    Global.isMainView = true;
    Global.mainViewRef = this;

    return true;
  }

  // Fetch a fixed amount of serviceRequests from Open311 API
  fetchServiceRequests() {
    var url = Config.OPEN311_SERVICE_REQUESTS_URL;
    var headers = {'Accept': 'application/json', 'Content-Type': 'application/json'};

    makeRequest(url, 'GET', headers, null, null)
    .then(result => {
      Global.lastRefreshTimestamp = + new Date();
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

  handleAppStateChange = (newAppState) => {
    // If app is set to the foreground refresh markers if enough time has passed
    if (this.state.appState === 'background' || Util.mapShouldUpdate()) {
      this.fetchServiceRequests();
    }

    Global.appState = newAppState;
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

  getMapRegion() {
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

    return mapRegion;
  }

  navToSendServiceRequestView() {
    this.props.navigation.navigate( 'SendServiceRequestView', {
      mapRegion: this.getMapRegion()
    });
  }

  navToServiceRequestListView(drawer) {
    drawer.close();
    this.props.navigation.navigate('ServiceRequestListView', {
      mapRegion: this.getMapRegion()
    });
  }

  navToAppFeedbackView(drawer) {
    drawer.close();
    this.props.navigation.navigate('AppFeedbackView');
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
    this.props.navigation.navigate('ServiceRequestDetailView', {
      serviceRequestID: id
    });
  }

  // Add opacity to container when drawer is opened
  drawerTweenHandler(ratio) {
    this.refs.shadowOverlay.setNativeProps({
      style: {
       opacity: Math.max((1 - ratio), 0.5),
       backgroundColor: Global.COLOR.BLACK
      }
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
        onClose={()=>this.setState({showPopup: false})}
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
            {this.state.serviceRequests.map(serviceRequest => (
              // This is required for all icons to be rendered properly
              // react-native-maps has issues with rendering icons on Android
              <Image key={serviceRequest.id} source={serviceRequest.markerImage} style={{height: 0, width: 0}}/>
            ))}
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
                  key={serviceRequest.id}
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


function mapStateToProps(state) {
  return {
    showWebView: state.auth.showWebView,
    url: state.auth.url
  };
}

function mapDispatchToProps(dispatch) {
  return {
    authActions: bindActionCreators(AuthActions, dispatch)
  }
}

const ConnectedMainView = connect(mapStateToProps, mapDispatchToProps)(MainView);

export default ConnectedMainView;
