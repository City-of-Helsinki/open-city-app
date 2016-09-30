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
  Animated,
  NativeModules
} from 'react-native';

// External modules
import MapView     from 'react-native-maps';
import Drawer      from 'react-native-drawer';
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';

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
import ownLocationIcon  from '../img/own_loc.png';

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
      selectedServiceCode: '',
      locationEnabled: true,
      descriptionText: '',
      titleText: '',
      image: {source: null, name: null},
      imageData: null,
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
    body.append('service_code', this.state.selectedServiceCode);
    body.append('description', this.state.descriptionText);
    if (this.state.locationEnabled &&
        this.state.markerPosition.latitude !== null &&
        this.state.markerPosition.longitude !== null) {
      body.append('lat', this.state.markerPosition.latitude);
      body.append('long', this.state.markerPosition.longitude);
    }


    if (this.state.imageData !== null) {


      const file = {
        name:this.state.image.name,
        width: this.state.imageData.width,
        height: this.state.imageData.height,
        isStored: true,

      }
      body.append('media_url', this.state.imageData)
      if(Platform.OS === 'ios') {
        body.append('media', {
          ...file, name: this.state.imageData.fileName
        });
      } else {
        body.append('media', {
          ...file, type:'image/jpeg', name: this.state.imageData.fileName
        });
      }

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

  onFocusButtonClick() {
      var markerRegion = {
        latitude: this.props.route.mapRegion.latitude,
        longitude: this.props.route.mapRegion.longitude,
        latitudeDelta: this.props.route.mapRegion.latitudeDelta/2,
        longitudeDelta: this.props.route.mapRegion.longitudeDelta/2
      }

      this.refs.map.animateToRegion(markerRegion)
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
      alert(Object.keys(response))
      if (response.error) {
        showAlert(transError.attachmentErrorTitle, transError.attachmentErrorMessage, transError.attachmentErrorOk);
      } else if (response.didCancel) {
        source = null;
      } else {
        if (Platform.OS === 'ios') {
          source = {uri: response.uri.replace('file://', ''), isStatic: true};
        } else {
          source = {uri: response.uri, isStatic: true};
        }
        ImageResizer.createResizedImage(response.uri, 800, 600, 'JPEG', 50).then((resizedImageUri) => {
            NativeModules.RNImageToBase64.getBase64String(resizedImageUri, (err, base64) => {
              var resizedSource = {uri: resizedImageUri, isStatic: true}
              response.data = base64;
              response.uri = resizedImageUri;
              this.setState({
                image: {source: resizedSource, name: response.fileName},
                imageData: response
              });
            })
        }).catch((err) => {
          alert(err)
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
      latitudeDelta: this.props.route.mapRegion.latitudeDelta*20,
      longitudeDelta: this.props.route.mapRegion.longitudeDelta*20
    }

    //this.refs.map.animateToRegion(markerRegion)

  }

  // Set marker position by long clicking the map. Center map on marker.
  setMarkerPos(location) {
    var markerRegion = {
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: this.props.route.mapRegion.latitudeDelta*20,
      longitudeDelta: this.props.route.mapRegion.longitudeDelta*20
    }

    this.setState({markerPosition: location})

    //this.refs.map.animateToRegion(markerRegion)
  }

  centerMarker(region) {
    var latitude = region.latitude;
    var longitude = region.longitude;

    var location = {
      latitude: latitude,
      longitude: longitude,
    }

    this.setState({markerPosition: location, region:region})
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
                            onRegionChange={(e) => this.centerMarker(e)}
                            //onRegionChangeComplete={(e) => this.state.region=e}
                            >
                            <MapView.Marker.Animated draggable
                              ref='marker'
                              image={markerIcon}
                              coordinate={this.state.region}
                              onDragEnd={(e) => this.updateMarkerPos(e.nativeEvent.coordinate)} />
                          </MapView>
                          <TouchableWithoutFeedback onPress={this.onFocusButtonClick.bind(this)}>
                            <Image
                              source={ownLocationIcon}
                              style={styles.focusIcon} />
                          </TouchableWithoutFeedback>
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
              itemChange={(item)=>this.setState({ selectedCategory: item.label, selectedServiceCode: item.key })}/>
          </View>

          <View
            style={styles.titleWrapper}>
            <TextInput
              style={styles.titleInput}
              placeholder={transFeedback.inputTitlePlaceholder}
              name="title"
              onChangeText={(text)=> {this.setState({titleText: text})}}
            />
          </View>

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
            <View style={[styles.bottomContainer,
              showThumbnail
                ? { height: 150 }
                : { height: 50 },]}>

              <View style={styles.thumbnailWrapper}>
                <Thumbnail
                  show={showThumbnail}
                  imageSource={this.state.image.source}
                  imageHeight={100}
                  imageWidth={100}
                  imageClickAction={()=>this.setState({ image: {source: null, fileName: null} })} />
              </View>

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
    flex: 0.3,
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  map: {
    flex: 1,
  },
  feedbackContainer: {
    flex: 0.7,
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
    paddingLeft: 5,
    flexDirection: 'column',
  },
  titleWrapper: {
    shadowColor: 'black',
    shadowOpacity: 0.8,
    shadowOffset: {
      height: 0,
      width: 0
    },
    shadowRadius:1,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
  },
  titleInput: {
    height: 40,
    paddingLeft: 10,
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
    alignItems: 'flex-end',
    position: 'absolute',
    bottom:0,
    left:0
  },
  icon: {
    height: BUTTON_ICON_HEIGHT,
    width: BUTTON_ICON_WIDTH,
    marginRight: 5,
  },
  focusIcon: {
    height:BUTTON_ICON_HEIGHT,
    width:BUTTON_ICON_WIDTH,
    position: 'absolute',
    bottom: 10,
    right: 10
  },
  thumbnailWrapper: {
    position: 'absolute',
    left: 0,
    bottom: 45,
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
