import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
  Platform,
  BackAndroid,
  ScrollView
} from 'react-native';

import Drawer                from 'react-native-drawer'
import FloatingActionButton  from '../../components/FloatingActionButton';
import Navbar                from '../../components/Navbar';
import Menu                  from '../../components/Menu';
import ServiceRequestListRow from '../../components/ServiceRequestListRow';
import showAlert             from '../../components/Alert';
import Spinner               from '../../components/Spinner';
import makeRequest           from '../../util/requests';
import Util                  from '../../util/util';
import Global                from '../../util/globals';
import Config                from '../../config';
import plusIcon              from '../../img/plus.png'
import markerIcon            from '../../img/marker_pin.png'
import menuIcon              from '../../img/menu.png'
import transList             from '../../translations/list';
import transError            from '../../translations/errors';
import styles                from './styles';

class ServiceRequestListView extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      serviceRequestList: [],      // All objects to be shown
      isLoading: true,             // Show/hide spinner
      showAppFeedbackModal: false, // Show/hide modal for giving feedback
    };


    transList.setLanguage('fi');
    transError.setLanguage('fi');

    Global.isMainView = false;
    Global.navigatorRef = this.props.navigator;
  }

  componentDidMount() {
    this.fetchServiceRequests();
  }

  componentWillUnmount() {
    Global.listItemMonth = null;
  }

  fetchServiceRequests() {
    var timeSpan = Util.getTimeSpan();
    var parameters = '?start_date=' + timeSpan.startDate + '&end_date=' + timeSpan.endDate
                   + Config.OPEN311_SERVICE_REQUESTS_EXTENSIONS_POSTFIX;
    var url = Config.OPEN311_SERVICE_REQUESTS_URL + parameters;
    var headers = {'Accept': 'application/json', 'Content-Type': 'application/json'};

    makeRequest(url, 'GET', headers, null, null)
    .then(result => {
      var serviceRequestList = Util.parseServiceRequestList(result, null);
      this.setState({
        isLoading: false,
        serviceRequestList: serviceRequestList,
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

  navToMapView() {
    this.props.navigator.pop();
  }

  navToAppFeedbackView(drawer) {
    drawer.close();
    this.props.navigator.push({
      id: 'AppFeedbackView'
    });
  }

  navToSendServiceRequestView() {
    this.props.navigator.push({
      id: 'SendServiceRequestView',
      mapRegion: this.props.route.mapRegion, // Sets default region for the map in feedback view
    });
  }

  // When a single item is clicked, navigate to the detail view
  navToServiceRequestDetailView(item) {
    this.props.navigator.push({
      id: 'ServiceRequestDetailView',
      data: item
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
            rightIcon={markerIcon}
            onRightButtonClick={()=>this.navToMapView()}
            header={transList.viewTitle} />
          {this.state.isLoading &&
            <Spinner color={'black'} visible={this.state.isLoading} />
          }
          <View
            style={
              [styles.contentContainer, {
                flex: this.state.isLoading ? 0 : 1 // Hide while loading
              }]
            }>
            <ScrollView>
              <View style={styles.serviceRequestContainer}>
                {this.state.serviceRequestList.map((item) => (
                  <ServiceRequestListRow
                    image={item.media_url}
                    title={item.title}
                    distance={item.distance}
                    date={item.date}
                    description={item.description}
                    agency={item.agency}
                    extendedData={item.extendedData}
                    statusNotes={item.status_notes}
                    onItemClick={this.navToServiceRequestDetailView.bind(this, item)} />
                ))}
              </View>
            </ScrollView>
          </View>
          <FloatingActionButton
            icon={plusIcon}
            onButtonClick={()=>this.navToSendServiceRequestView(this)} />
        </View>
      </Drawer>
    );
  }
}

module.exports = ServiceRequestListView
