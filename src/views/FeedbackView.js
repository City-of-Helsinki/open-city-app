import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  BackAndroid,
  Dimensions,
  Platform,
  Animated
} from 'react-native';

// External modules
import MapView     from 'react-native-maps';
import Drawer      from 'react-native-drawer';
import ImagePicker from 'react-native-image-picker';

// Components
import FloatingActionButton from '../components/FloatingActionButton';
import NativePicker         from '../components/NativePicker';
import Navbar               from '../components/Navbar';
import Menu                 from '../components/Menu';
import Thumbnail            from '../components/Thumbnail';
import showAlert            from '../components/Alert';
import Config               from '../config';
import makeRequest          from '../util/requests';

// Translations
import transFeedback from '../translations/feedback';
import transError    from '../translations/errors';

// Images
import sendEnabledIcon  from '../img/send.png';
import sendDisabledIcon from '../img/send_disabled.png';
import markerIcon       from '../img/location_marker.png';
import attachmentIcon   from '../img/attachment.png';
import locationOnIcon   from '../img/location_on.png';
import locationOffIcon  from '../img/location_off.png';

var navigator;
const DEFAULT_CATEGORY       = 'Muu';
const BUTTON_ICON_HEIGHT     = 40;
const BUTTON_ICON_WIDTH      = 40;
const DESCRIPTION_MIN_LENGTH = 10;
const DESCRIPTION_MAX_LENGTH = 5000;

class FeedbackView extends Component {

  constructor(props, context) {
    super(props, context);


    navigator = this.props.navigator;
    this.state = {

      // Initialize the marker with the center coordinates from region of the map being shown
      markerPosition:{ latitude: this.props.route.mapRegion.latitude,
        longitude: this.props.route.mapRegion.longitude},
      sendEnabled: false,
      pickerData: [],
      region: {latitude: this.props.route.mapRegion.latitude,
              longitude: this.props.route.mapRegion.longitude,
              latitudeDelta: this.props.route.mapRegion.latitudeDelta/2,
              longitudeDelta: this.props.route.mapRegion.longitudeDelta/2},
      selectedCategory: '',
      locationEnabled: true,
      descriptionText: '',
      titleText: '',
      image: {source: null, name: null},
    };


    //this.refs.map.animateToRegion(region)
    transFeedback.setLanguage('fi');
    transError.setLanguage('fi');
  }

  componentWillMount() {
    this.fetchServices();
    this.setState({
      pickerData: [{label: '', key: ''}],
    });
  }

  fetchServices() {
    var url     = Config.OPEN311_SERVICE_LIST_URL + Config.OPEN311_SERVICE_LIST_LOCALE + 'fi';
    var headers = {'Accept': 'application/json', 'Content-Type': 'application/json'};

    makeRequest(url, 'GET', headers, null)
    .then(result => {
      this.parseServiceList(result);
    }, err => {
      showAlert(transError.networkErrorTitle, transError.networkErrorMessage, transError.networkErrorButton);
    });
  }

  parseServiceList(data) {
    var services = [];
    for (var i=0; i < data.length; i++) {
      services.push({label: data[i].service_name, key: data[i].service_code});
    }

    this.setState({
      pickerData: services,
    });
  }

  sendFeedback() {
    var url     = Config.OPEN311_SEND_SERVICE_URL;
    var method  = 'POST';
    var headers = {'Content-Type': 'multipart/form-data', 'Accept': 'application/json'};
    var body    = new FormData();

    body.append('api_key', Config.OPEN311_SEND_SERVICE_API_KEY);
    body.append('service_code', this.state.selectedCategory);
    body.append('description', this.state.descriptionText);
    if (this.state.locationEnabled &&
        this.state.markerPosition.latitude !== null &&
        this.state.markerPosition.longitude !== null) {
      body.append('lat', this.markerLatitude);
      body.append('long', this.markerLongitude);
    }

    console.log(this.state.image.source)
    console.log(this.state.image.name)
    if (this.state.image.source !== null) {
      var file = {
        uri: this.state.image.source.uri,
        type: 'image/jpeg',
        name: this.state.image.name
      };
      body.append('media', file);
    }

    if (this.state.titleText !== '') {
      body.append('title', this.state.titleText);
    }
    console.log(body)

    makeRequest(url, method, headers, body)
    .then(result => {
      this.props.navigator.resetTo({
        id: 'MainView',
      });
    }, error => {
      console.log('error')
      console.log(error)
      showAlert(transError.networkErrorTitle, transError.networkErrorMessage, transError.networkErrorButton);
    });
  }

  onLocationIconClick() {
    this.setState({
      locationEnabled: !this.state.locationEnabled,
    });
  }

  navToIssueListView() {
    this.props.navigator.push({
      id: 'IssueListView',
    });
  }

  onAttachmentIconClick() {
    var options = {
      title: transFeedback.imagePickerTitle,
      cancelButtonTitle: transFeedback.imagePickerCancelButton,
      takePhotoButtonTitle: transFeedback.imagePickerPictureButton,
      chooseFromLibraryButtonTitle: transFeedback.imagePickerLibraryButton,
      mediaType: 'photo'
    };
    ImagePicker.showImagePicker(options, (response) => {
      var source   = null;
      var fileName = null;

      if (response.error) {
        showAlert(transError.attachmentErrorTitle, transError.attachmentErrorMessage, transError.attachmentErrorOk);
      } else if (response.didCancel) {
        source = null;
      } else {
        const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};

        this.setState({
          image: {source: source, name: response.fileName}
        });
      }

    });
  }

  // Update marker position after dragging marker and center map on marker.
  updateMarkerPos(location) {
    this.markerPosition = location

    var markerRegion = {
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: this.props.route.mapRegion.latitudeDelta,
      longitudeDelta: this.props.route.mapRegion.longitudeDelta
    }

    this.refs.map.animateToRegion(markerRegion)

  }

  // Set marker position by long clicking the map. Center map on marker.
  setMarkerPos(location) {
    var markerRegion = {
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: this.props.route.mapRegion.latitudeDelta/2,
      longitudeDelta: this.props.route.mapRegion.longitudeDelta/2
    }

    this.setState({markerPosition: location})

    this.refs.map.animateToRegion(markerRegion)
  }

  render() {
    var showThumbnail = this.state.image.source !== null;
    var locationIcon  = this.state.locationEnabled ? locationOffIcon : locationOnIcon;
    var mapView       = this.state.locationEnabled ?
                        <View style={styles.mapContainer}>
                          <MapView
                            ref='map'
                            style={styles.map}
                            region={this.state.region}
                            showsUserLocation={false}
                            followUserLocation={false}
                            toolbarEnabled={false}
                            onLongPress={(e) => this.setMarkerPos(e.nativeEvent.coordinate)}
                            onRegionChangeComplete={(e) => this.state.region=e}
                            >
                            <MapView.Marker.Animated draggable
                              ref='marker'
                              image={markerIcon}
                              coordinate={this.state.markerPosition}
                              onDragEnd={(e) => this.updateMarkerPos(e.nativeEvent.coordinate)} />
                          </MapView>
                        </View> : null;
    var sendIcon = this.state.sendEnabled ? sendEnabledIcon : sendDisabledIcon;

    return (
      <Drawer
        ref={(ref) => this._drawer = ref}
        type="overlay"
        openDrawerOffset={0.25}
        closedDrawerOffset={0}
        tapToClose={true}
        acceptTap={true}
        captureGestures={'open'}
        content={
          <Menu
            mapView={()=>{this.props.navigator.pop()}}
            feedbackView={()=>{this.navToIssueListView(this._drawer)}}
            onMenuClick={()=>this._drawer.close()}/>
        }>
        <View style={styles.container}>
          <Navbar
            onMenuClick={()=>this._drawer.open()}
            header={transFeedback.feedbackViewTitle}/>
        {mapView}
        <View style={styles.feedbackContainer}>
          <View style={styles.categoryContainer}>
            <View style={styles.categoryTextView}>
              <Text style={styles.categoryText}>{transFeedback.category}</Text>
            </View>
            <NativePicker
              data={this.state.pickerData}
              defaultItem={this.state.selectedCategory}
              selectedItem={this.state.selectedCategory}
              itemChange={(item)=>this.setState({ selectedCategory: item })}/>
          </View>

          <TextInput
            style={styles.titleInput}
            placeholder={transFeedback.inputTitlePlaceholder}
            name="title"
            onChangeText={(text)=> {this.setState({titleText: text})}}
          />

          <View style={styles.contentContainer}>
            <TextInput
              style={styles.contentInput}
              placeholder={transFeedback.inputContentPlaceholder}
              name="content"
              multiline={true}
              onChangeText={(text)=> {
                var sendEnabled = text.length >= DESCRIPTION_MIN_LENGTH && text.length <= DESCRIPTION_MAX_LENGTH;
                this.setState({
                  sendEnabled: sendEnabled,
                  descriptionText: text,
                });
              }}
            />
            <View style={styles.bottomContainer}>
                <View style={styles.buttonView}>
                  <TouchableWithoutFeedback onPress={this.onAttachmentIconClick.bind(this)}>
                    <Image
                      source={attachmentIcon}
                      style={styles.icon} />
                  </TouchableWithoutFeedback>
                  <TouchableWithoutFeedback onPress={this.onLocationIconClick.bind(this)}>
                    <Image
                      source={locationIcon}
                      style={styles.icon} />
                  </TouchableWithoutFeedback>
                  <Thumbnail
                    show={showThumbnail}
                    imageSource={this.state.image.source}
                    imageHeight={100}
                    imageWidth={100}
                    imageClickAction={()=>this.setState({ image: {source: null, fileName: null} })} />
                </View>
            </View>
          </View>

        </View>
          <FloatingActionButton
            icon={sendIcon}
            onButtonClick={()=>{if(this.state.sendEnabled) {this.sendFeedback(this)}}} />
        </View>
      </Drawer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
  },
  mapContainer: {
    flex: 0.35,
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  map: {
    flex: 1,
  },
  feedbackContainer: {
    flex: 0.65,
    backgroundColor: '#EEEEEE',
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryText: {
    marginLeft: 15,
    fontSize: 16,
  },
  bottomContainer:{
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingLeft: 5,
    height: 100,
  },
  titleInput: {
    flex: 0.1,
    paddingLeft: 10,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
    backgroundColor: 'white',
    fontSize: 16,
  },
  contentContainer: {
    flex: 0.53,
    backgroundColor: 'white',
    flexDirection: 'column',
    shadowColor: 'black',
    shadowOpacity: 0.8,
    shadowOffset: {
      height: 0,
      width: 0
    },
    shadowRadius:1,
    paddingLeft: 10,
    margin: 10,
    marginTop: 0,
    margin: 10,
  },
  contentInput: {
    flex: 1,
  },
  buttonView: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'flex-end',
  },
  icon: {
    height: BUTTON_ICON_HEIGHT,
    width: BUTTON_ICON_WIDTH,
    marginRight: 5,
  }
});

BackAndroid.addEventListener('hardwareBackPress', function() {
  if (navigator) {
      navigator.pop();
      return true;
  }
  return false;
});

module.exports = FeedbackView
