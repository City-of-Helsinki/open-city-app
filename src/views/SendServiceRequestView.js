import React, { Component, } from 'react';
import rebound from 'rebound';
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
  NativeModules,
  DeviceEventEmitter,
  UIManager,
  LayoutAnimation,
  ScrollView
} from 'react-native';

// External modules
import MapView        from 'react-native-maps';
import Drawer         from 'react-native-drawer';
import ImagePicker    from 'react-native-image-picker';
import ImageResizer   from 'react-native-image-resizer';
import Toast          from 'react-native-simple-toast';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import Spinner        from 'react-native-loading-spinner-overlay';
// Components
import FloatingActionButton from '../components/FloatingActionButton';
import NativePicker         from '../components/NativePicker';
import Navbar               from '../components/Navbar';
import Menu                 from '../components/Menu';
import Thumbnail            from '../components/Thumbnail';
import showAlert            from '../components/Alert';
import makeRequest          from '../util/requests';
import serviceRequestModels from '../util/models';
import Global               from '../util/globals';
import Config               from '../config';

// Translations
import transSendServiceRequest from '../translations/sendServiceRequest';
import transError              from '../translations/errors';

// Images
import checkboxIcon     from '../img/check.png';
import sendEnabledIcon  from '../img/send_enabled.png';
import sendDisabledIcon from '../img/send_disabled.png';
import markerIcon       from '../img/location_marker.png';
import checkIcon        from '../img/check.png';
import backIcon         from '../img/back.png';

const BUTTON_ICON_HEIGHT     = 40;
const BUTTON_ICON_WIDTH      = 40;
const ZOOM                   = 6;
const MARKER_IMAGE_SIZE      = 35;
const SEND_BUTTON_IMAGE_SIZE = 40;
const MAP_HEIGHT             = 140;


class SendServiceRequestView extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      // Initialize the marker with the center coordinates from region of the map being shown
      region: {
        latitude: this.props.route.mapRegion.latitude,
        longitude: this.props.route.mapRegion.longitude,
        latitudeDelta: this.props.route.mapRegion.latitudeDelta/ZOOM,
        longitudeDelta: this.props.route.mapRegion.longitudeDelta/ZOOM
      },
      markerPosition:{
        latitude: this.props.route.mapRegion.latitude,
        longitude: this.props.route.mapRegion.longitude
      },
      sendEnabled: false,
      pickerData: [{label: '', key: ''}],
      selectedCategory: '',
      selectedServiceCode: '',
      locationEnabled: true,    // Whether geo tag will be added to the service request
      descriptionHeight: 0,     // Height of the description textinput which will changed based on text changes
      titleText: '',
      descriptionText: '',
      image: {source: null, name: null},
      imageData: null,
      spinnerVisible: false,
    };

    transSendServiceRequest.setLanguage('fi');
    transError.setLanguage('fi');

    Global.isMainView = false;
    Global.navigatorRef = this.props.navigator;

    if (Platform.OS === 'android') { UIManager.setLayoutAnimationEnabledExperimental(true) }
  }

  componentWillMount() {
    this.fetchServices();
    this.initializeSpringAnimation();
  }

  initializeSpringAnimation() {
    this.springSystem     = new rebound.SpringSystem();
    this.scrollSpring     = this.springSystem.createSpring();
    var springConfig      = this.scrollSpring.getSpringConfig();
    springConfig.tension  = 200;
    springConfig.friction = 25;

    this.scrollSpring.addListener({
      onSpringUpdate: () => {
        this.setState({scale: this.scrollSpring.getCurrentValue()});
      },
    });
  }

  fetchServices() {
    var url     = Config.OPEN311_SERVICE_LIST_URL + Config.OPEN311_SERVICE_LIST_LOCALE + 'fi';
    var headers = {'Accept': 'application/json', 'Content-Type': 'application/json'};

    makeRequest(url, 'GET', headers, null, null)
    .then(result => {
      this.parseServiceList(result);
    }, err => {
      showAlert(transError.networkErrorTitle, transError.networkErrorMessage, transError.networkErrorButton);
    });
  }

  // Create an array for picker with all services
  parseServiceList(data) {
    var services = [];
    for (var i=0; i < data.length; i++) {

      // Exclude blacklisted categories
      if (Config.SERVICE_BLACKLIST.indexOf(parseInt(data[i].service_code)) === -1) {
        services.push({label: data[i].service_name, key: data[i].service_code});
      }
    }
    var item = services[0]
    this.setState({
      pickerData: services,
      selectedCategory: item.label,
      selectedServiceCode: item.key,
    });
  }

  onSendButtonClick() {
    if (this.state.descriptionText.length >= Config.OPEN311_DESCRIPTION_MIN_LENGTH &&
        this.state.descriptionText.length <= Config.OPEN311_DESCRIPTION_MAX_LENGTH) {
      this.sendServiceRequest();
    }
  }

  sendServiceRequest() {
    this.setState({ spinnerVisible: true });
    var url     = Config.OPEN311_SEND_SERVICE_URL;
    var method  = 'POST';
    var headers = {'Content-Type': 'multipart/form-data', 'Accept': 'application/json'};
    var data    = new FormData();

    data.append('api_key', Config.OPEN311_SEND_SERVICE_API_KEY);
    data.append('service_code', this.state.selectedServiceCode);
    data.append('description', this.state.descriptionText);
    data.append('title', this.state.titleText !== null ? this.state.titleText : '');

    if (this.state.locationEnabled &&
        this.state.markerPosition.latitude !== null &&
        this.state.markerPosition.longitude !== null) {
      data.append('lat', this.state.markerPosition.latitude);
      data.append('long', this.state.markerPosition.longitude);
    }

    if (this.state.imageData !== null) {

      const file = {
        uri: this.state.imageData.uri,
        isStored: true,
      }

      if(Platform.OS === 'ios') {
        data.append('media', {
          ...file, name: this.state.imageData.fileName
        });
      } else {
        data.append('media', {
          ...file, name: this.state.imageData.fileName,
          type: 'image/jpeg',
        });
      }
    }

    makeRequest(url, method, headers, data)
    .then(result => {

      if ('service_request_id' in result[0]) {
        serviceRequestModels.insert(result[0]['service_request_id'])
      }
      this.setState({ spinnerVisible: false });
      Toast.show(transSendServiceRequest.feedbackSent);
      this.props.navigator.pop();
    }, error => {
      this.setState({ spinnerVisible: false });
      showAlert(transError.networkErrorTitle, transError.networkErrorMessage, transError.networkErrorButton);
    });
  }

  navToServiceRequestListView() {
    this.props.navigator.push({
      id: 'ServiceRequestListView',
    });
  }

  onAddAttachmentClick() {
    var options = {
      title: '',
      cancelButtonTitle: transSendServiceRequest.imagePickerCancelButton,
      takePhotoButtonTitle: transSendServiceRequest.imagePickerPictureButton,
      chooseFromLibraryButtonTitle: transSendServiceRequest.imagePickerLibraryButton,
      mediaType: 'photo'
    };

    ImagePicker.showImagePicker(options, (response) => {
      var source   = null;
      var fileName = null;

      if (response.error) {
        showAlert(transError.attachmentErrorTitle, transError.attachmentErrorMessage, transError.attachmentError);
      } else if (response.didCancel) {
        source = null;
      } else {

        if (Platform.OS === 'ios') {
          source = {uri: response.uri.replace('file://', ''), isStatic: true};
        } else {
          source = {uri: response.uri, isStatic: true};
        }

        // Compress Image size
        ImageResizer.createResizedImage(response.uri, Config.IMAGE_MAX_HEIGHT, Config.IMAGE_MAX_WIDTH, Config.IMAGE_FORMAT, Config.IMAGE_QUALITY).then((resizedImageUri) => {
            var resizedSource = {uri: resizedImageUri, isStatic: true}

            response.path = resizedImageUri
            response.uri = resizedImageUri;
            this.setState({
              image: {source: resizedSource, name: response.fileName},
              imageData: response
            });

            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

        }).catch((err) => {
          showAlert(transError.feedbackImageErrorTitle, transError.feedbackImageErrorMessage, transError.feedbackImageErrorButton)
        });
      }
    });
  }

  onCheckboxClick() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    this.setState({
      locationEnabled: !this.state.locationEnabled,
    });
  }

  // Update marker position after dragging marker and center map on marker.
  updateMarkerPos(location) {
    this.markerPosition = location

    var markerRegion = {
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: this.props.route.mapRegion.latitudeDelta/ZOOM,
      longitudeDelta: this.props.route.mapRegion.longitudeDelta/ZOOM
    }
  }

  // Set marker position by long clicking the map. Center map on marker.
  setMarkerPos(location) {
    var markerRegion = {
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: this.props.route.mapRegion.latitudeDelta/ZOOM,
      longitudeDelta: this.props.route.mapRegion.longitudeDelta/ZOOM
    }

    this.setState({markerPosition: location})
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

  removeThumbnail() {
    this.setState({ image: {source: null, fileName: null}, imageData: null })
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }

  onDescriptionChange(event) {
    if (event.nativeEvent.text.length < Config.OPEN311_DESCRIPTION_MAX_LENGTH) {
      this.setState({
        descriptionText: event.nativeEvent.text,
        // Change the height of description view based on the length of the text
        descriptionHeight: event.nativeEvent.contentSize.height
      });
    }

    // Enable/Disable send button depending on the description text length
    if (event.nativeEvent.text.length >= Config.OPEN311_DESCRIPTION_MIN_LENGTH &&
        event.nativeEvent.text.length <= Config.OPEN311_DESCRIPTION_MAX_LENGTH) {
      // Add animation only if the icon is going to change
      if (!this.state.sendEnabled) {
        this.addSpringAnimation(0.1, 1);
      }
      this.setState({
        sendEnabled: true,
      });
    } else {
      // Add animation only if the icon is going to change
      if (this.state.sendEnabled) {
        this.addSpringAnimation(0.1, 1);
      }
      this.setState({
        sendEnabled: false,
      });
    }
  }

  // Add opacity to container when drawer is opened
  drawerTweenHandler(ratio) {
    this.refs.shadowOverlay.setNativeProps({
       opacity: Math.max((1 - ratio), 0.5),
       backgroundColor: Global.COLOR.BLACK
    });

    return { }
  }

  addSpringAnimation(currentValue, endValue) {
    this.scrollSpring.setCurrentValue(currentValue);
    this.scrollSpring.setEndValue(endValue);
  }

  render() {
    var showThumbnail = this.state.image.source !== null;
    var checkboxImage = this.state.locationEnabled ?
      <Image style={styles.checkboxImage} source={checkboxIcon} /> : null;
    return (
      <Drawer
        ref={(ref) => {
          this._drawer = ref;
          Global.menuRef = ref;
        }}
        type={'overlay'}
        openDrawerOffset={0.25}
        closedDrawerOffset={0}
        tapToClose={true}
        acceptTap={true}
        captureGestures={'open'}
        onOpen={()=> Global.menuOpen = true}
        onClose={()=> Global.menuOpen = false}
        tweenHandler={(ratio) => this.drawerTweenHandler(ratio)}
        content={
          <Menu
            mapView={()=>{this.props.navigator.pop()}}
            sendServiceRequestView={()=>{this.navToServiceRequestListView(this._drawer)}}
            onMenuClick={()=>this._drawer.close()}/>
        }>
        <Navbar
          leftIcon={backIcon}
          onLeftButtonClick={()=>this.props.navigator.pop()}
          rightIcon={this.state.sendEnabled ? sendEnabledIcon : sendDisabledIcon}
          iconAnimationStyle={{transform: [{scaleX: this.state.scale}, {scaleY: this.state.scale}]}}
          onRightButtonClick={this.onSendButtonClick.bind(this)}
          header={transSendServiceRequest.sendServiceRequestViewTitle} />
        <View style={styles.container}>
          <Spinner visible={this.state.spinnerVisible} />
          <ScrollView style={styles.scrollView}>
            <View style={styles.innerContainer}>
            {this.state.locationEnabled &&
              <View style={styles.mapView}>
                <MapView
                  ref='map'
                  style={styles.map}
                  region={this.state.region}
                  showsUserLocation={false}
                  followUserLocation={false}
                  toolbarEnabled={false}
                  onLongPress={(e) => this.setMarkerPos(e.nativeEvent.coordinate)}
                  onRegionChangeComplete={(e) => this.centerMarker(e)}
                  >
                  <MapView.Marker.Animated draggable
                    ref='marker'
                    coordinate={this.state.region}
                    onDragEnd={(e) => this.updateMarkerPos(e.nativeEvent.coordinate)}>
                  <Image // This image hides the default marker
                    source={markerIcon}
                    style={{height: 0, width: 0}} />
                  </MapView.Marker.Animated>
                </MapView>
                <Image
                  source={markerIcon}
                  style={styles.markerImage} />
              </View>
            }
              <View style={styles.contentContainer}>
                <View style={styles.enableLocationView}>
                  <Text style={styles.helpText}>{transSendServiceRequest.geoTagTitle}</Text>
                  <View style={styles.checkboxContainer}>
                    <Text style={[styles.checkboxLabel, styles.textFont]}>{transSendServiceRequest.geoTagLabel}</Text>
                    <View style={styles.checkboxViewContainer}>
                      <TouchableWithoutFeedback onPress={this.onCheckboxClick.bind(this)}>
                        <View style={styles.checkboxView}>
                          {checkboxImage}
                        </View>
                      </TouchableWithoutFeedback>
                    </View>
                  </View>
                </View>
                <View style={styles.categoryView}>
                  <Text style={[styles.helpText, styles.categoryText]}>{transSendServiceRequest.category}</Text>
                  <NativePicker
                    style={styles.picker}
                    data={this.state.pickerData}
                    defaultItem={this.state.selectedCategory}
                    selectedItem={this.state.selectedCategory}
                    itemChange={(item)=> {
                      this.setState({
                        selectedCategory: Platform.OS === 'ios' ? item.label : item,
                        selectedServiceCode: Platform.OS === 'ios' ? item.key : item,
                      });
                    }} />
                </View>
                <View style={styles.titleView}>
                  <TextInput
                    style={styles.titleText}
                    onChangeText={(text)=> { this.setState({titleText: text }) }}
                    placeholder={transSendServiceRequest.inputTitlePlaceholder} />
                </View>
                <View style={styles.descriptionView}>
                  <TextInput
                    style={[styles.descriptionText, {height: Math.max(135, this.state.descriptionHeight)}]}
                    multiline={true}
                    onChange={(event)=>this.onDescriptionChange(event)}
                    placeholder={transSendServiceRequest.inputDescriptionPlaceholder} />
                </View>
              </View>
            </View>
          </ScrollView>
          <View style={styles.attachmentContainer}>
            {this.state.image.source === null &&
            <TouchableWithoutFeedback onPress={this.onAddAttachmentClick.bind(this)}>
              <View style={styles.attachmentButton}>
                <Text style={styles.attachmentButtonText}>{transSendServiceRequest.addAttachment}</Text>
              </View>
            </TouchableWithoutFeedback>
            }
            {this.state.image.source !== null &&
              <View style={styles.thubmnailView}>
                <Thumbnail
                  show={showThumbnail}
                  imageSource={this.state.image.source}
                  imageHeight={62}
                  imageWidth={62}
                  imageClickAction={()=>this.removeThumbnail()} />
              </View>
            }
          </View>
          {Platform.OS === 'ios' && <KeyboardSpacer />}
        </View>
      </Drawer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: Global.COLOR.LIGHT_GREY
  },
  mapView: {
    flexDirection: 'row',
    height: MAP_HEIGHT
  },
  map: {
    flex: 1,
  },
  markerImage: {
    position: 'absolute',
    height: MARKER_IMAGE_SIZE,
    width: MARKER_IMAGE_SIZE,
    top: 35,
    left: (Dimensions.get('window').width / 2) - (MARKER_IMAGE_SIZE / 2)
  },
  scrollView: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    flex: 1,
  },
  enableLocationView: {
    marginBottom: 4,
  },
  checkboxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkboxViewContainer: {
    height: 32,
    width: 32,
  },
  checkboxView: {
    height: 32,
    width: 32,
    borderRadius: 3,
    backgroundColor: Global.COLOR.BLUE,
  },
  checkboxLabel: {
    color: Global.COLOR.BLACK,
    flexWrap: 'wrap',
    flex: 1,
    fontSize: 16,
  },
  checkboxImage: {
    height: 32,
    width: 32,
  },
  picker: {
    ...Platform.select({
      ios: {
        marginLeft: 0,
        marginBottom: 8,
      },
      android: {
        marginLeft: -8, // Align picker text with rest of the content
      },
    }),
  },
  categoryText: {
    ...Platform.select({
      ios: {
        marginBottom: 4,
      },
      android: {
        marginBottom: -8, // Align picker text with rest of the content
      },
    }),
  },
  helpText: {
    color: Global.COLOR.STEEL_GREY,
    fontSize: 12,
    fontWeight: 'bold'
  },
  titleView: {
    alignSelf: 'center',
    width: Dimensions.get('window').width - 32
  },
  titleText: {
    backgroundColor: Global.COLOR.WARM_GREY_10,
    height: 40,
    padding: 8,
  },
  descriptionView: {
    flexDirection: 'column',
    marginTop: 8,
  },
  descriptionText: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: Global.COLOR.WARM_GREY_10,
    textAlignVertical: 'top',
    padding: 8,
  },
  attachmentContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopColor: Global.COLOR.GREY,
  },
  attachmentButton: {
    flex: 1,
    height: 46,
    backgroundColor: Global.COLOR.BLUE,
    alignItems: 'center',
    justifyContent: 'center',
    // Shadow
    ...Platform.select({
      ios: {
        shadowColor: Global.COLOR.BLACK,
        shadowOffset: {width: 1, height: 2},
        shadowOpacity: 0.5,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      }
    }),
  },
  attachmentButtonText: {
    color: Global.COLOR.WHITE,
    fontSize: 16,
    fontWeight: 'bold'
  },
  thubmnailView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

module.exports = SendServiceRequestView
