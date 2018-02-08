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
import LocationActions from '../../redux/location/actions';

import AuthActions          from '../../redux/auth/actions';
import MapView, { Marker, Callout }  from 'react-native-maps';
import Drawer               from 'react-native-drawer'
import Geolib               from 'geolib';
import OverlaySpinner       from 'react-native-loading-spinner-overlay';
import Realm                from 'realm';
import Navbar               from '../../components/Navbar';
import NavButton            from '../../components/NavButton';
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
import transMain            from '../../translations/mainView';
import plusIcon             from '../../img/plus.png';
import menuIcon             from '../../img/menu.png';
import listIcon             from '../../img/list.png';
import styles               from './styles';
import customMapStyles      from '../../styles/map';
import {HEADER_LOGO}        from '../../styles/common';
import MapPin               from '../../components/MapPin';

// Default region set as Helsinki
const DEFAULT_LATITUDE           = 60.1680574;
const DEFAULT_LONGITUDE          = 24.9339746;
const DEFAULT_LATITUDE_DELTA     = 0.02208;
const DEFAULT_LONGITUDE_DELTA    = 0.01010;

class MainView extends Component {

  static navigationOptions = ({navigation}) => {
    return {
      headerTitle: (
        <Image
          style={HEADER_LOGO}
          resizeMode="contain"
          source={require('./../../img/city-logo.png')}
        />
      ),
      headerLeft: (
        <View />
      ),
      headerRight: (
        <NavButton
          icon={listIcon}
          onPress={()=> {
            navigation.navigate('ServiceRequestListView', {
              mapRegion: {
                latitude: DEFAULT_LATITUDE,
                longitude: DEFAULT_LONGITUDE,
                latitudeDelta: DEFAULT_LATITUDE_DELTA,
                longitudeDelta: DEFAULT_LONGITUDE_DELTA,
              }
            })
          }}
        />
      ),
      tabBarLabel: transMain.tabBarLabel,
      tabBarIcon: ({ tintColor }) => (
        <Image
          source={require('./../../img/icon-edit.png')}
          style={[styles.icon, {tintColor: tintColor}]}
        />
      ),
    }
  };

  constructor(props, context) {
    super(props, context);

    var serviceRequests = (this.props.navigation.state.params && this.props.navigation.state.params.serviceRequests) ? this.props.navigation.state.params.serviceRequests : [];
    this.state = {
      serviceRequests: [],       // Data to be shown on the map as markers
      region: this.props.region,
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
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
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
        region: this.props.region,
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

  // Fetch details of a single serviceRequest
  fetchServiceRequestDetails(serviceRequest) {
    var url = Config.OPEN311_SERVICE_REQUEST_BASE_URL + serviceRequest.id + Config.OPEN311_SERVICE_REQUEST_PARAMETERS_URL;
    var headers = {'Accept': 'application/json', 'Content-Type': 'application/json'};

    makeRequest(url, 'GET', headers, null, null)
    .then(result => {
      var data = Util.parseServiceRequestDetails(result, this.props.userPosition);
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
    if (this.props.userPosition.latitude !== null && this.props.userPosition.longitude !== null) {
      mapRegion.latitude = this.props.userPosition.latitude;
      mapRegion.longitude = this.props.userPosition.longitude;
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
        region: this.props.region,
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
        userPosition={this.props.userPosition}
        onClick={()=>this.onPopupClick(this.state.popupData.id)}
        onClose={()=>this.setState({showPopup: false})}
        isLoading={this.state.isLoading}
        />
      : null;

    return (

        <View
          style={styles.container}
          ref='shadowOverlay'>

          <View style={styles.mapContainer}>

          <MapView
            ref={ref=> this.mapView = ref}
            style={styles.map}
            customMapStyle={customMapStyles}
            region={this.state.region}
            showsUserLocation={true}
            followUserLocation={false}
            toolbarEnabled={false}
            onPress={this.onMapViewClick.bind(this)}
            onRegionChangeComplete={this.onMapRegionChange.bind(this)}>
            {this.state.serviceRequests.map(serviceRequest => (
              <Marker
                key={serviceRequest.id}
                coordinate={serviceRequest.coordinates}
                onPress={()=> this.showServiceRequestDetailPopup(serviceRequest)}>
                <MapPin />
                <Callout tooltip={true}>
                  <EmptyMarkerCallout />
                </Callout>
              </Marker>
            ))}
          </MapView>

          </View>
          {serviceRequestDetailPopup}
          {!this.state.showPopup && // When popup is displayed hide FAB because Google Maps toolbar
            <FloatingActionButton   // shows up after a marker is clicked
              icon={plusIcon}
              onButtonClick={()=>this.navToSendServiceRequestView(this)} />}
        </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    showWebView: state.auth.showWebView,
    url: state.auth.url,
    region: state.location.region,
    userPosition: state.location.userPosition
  };
}

function mapDispatchToProps(dispatch) {
  return {
    authActions: bindActionCreators(AuthActions, dispatch),
    locationActions: bindActionCreators(LocationActions, dispatch)
  }
}

const ConnectedMainView = connect(mapStateToProps, mapDispatchToProps)(MainView);

export default ConnectedMainView;
