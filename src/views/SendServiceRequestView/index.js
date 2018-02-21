import React, { Component, } from 'react';
import rebound from 'rebound';
import {
  View,
  Image,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  BackAndroid,
  Platform,
  Animated,
  NativeModules,
  DeviceEventEmitter,
  UIManager,
  LayoutAnimation,
  ScrollView
} from 'react-native';

import MapView                      from 'react-native-maps';
import ImagePicker                  from 'react-native-image-picker';
import ImageResizer                 from 'react-native-image-resizer';
import Toast                        from 'react-native-simple-toast';
import KeyboardSpacer               from 'react-native-keyboard-spacer';
import Spinner                      from 'react-native-loading-spinner-overlay';
import FloatingActionButton         from '../../components/FloatingActionButton';
import NativePicker                 from '../../components/NativePicker';
import Navbar                       from '../../components/Navbar';
import NavButton                    from '../../components/NavButton';
import Thumbnail                    from '../../components/Thumbnail';
import showAlert                    from '../../components/Alert';
import SendServiceRequestMap        from '../../components/SendServiceRequestMap';
import SendServiceRequestForm       from '../../components/SendServiceRequestForm';
import SendServiceRequestAttachment from '../../components/SendServiceRequestAttachment';
import makeRequest                  from '../../util/requests';
import serviceRequestModels         from '../../util/models';
import Global                       from '../../util/globals';
import Util                         from '../../util/util';
import Config                       from '../../config';
import transSendServiceRequest      from '../../translations/sendServiceRequest';
import transError                   from '../../translations/errors';
import checkboxIcon                 from '../../img/check.png';
import sendEnabledIcon              from '../../img/send_enabled.png';
import sendDisabledIcon             from '../../img/send_disabled.png';
import markerIcon                   from '../../img/location_marker.png';
import checkIcon                    from '../../img/check.png';
import backIcon                     from '../../img/back.png';
import styles                       from './styles';
import {HEADER_LOGO}                from '../../styles/common';



const ZOOM = 6;


class SendServiceRequestView extends Component {

  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state;
    const sendButton = (
      <NavButton
        icon={params.sendEnabled ? sendEnabledIcon : sendDisabledIcon}
        onPress={params.handleSend ?  params.handleSend : () => null}
      />
    )
    return {
      headerTitle: (
        <Image
          style={HEADER_LOGO}
          resizeMode="contain"
          source={require('./../../img/city-logo.png')}
        />
      ),
      headerRight: sendButton
    }
  };

  constructor(props, context) {
    super(props, context);

    // Set initial variables depending on whether the user has visited this view before or not
    var initialRegion    = Global.sendServiceRequestData.region !== null ? Global.sendServiceRequestData.region : this.props.navigation.state.params.mapRegion;
    var initialMarker    = Global.sendServiceRequestData.markerPosition !== null ? Global.sendServiceRequestData.markerPosition : this.props.navigation.state.params.markerPosition;
    var initialImageData = Global.sendServiceRequestData.imageData !== null ? Global.sendServiceRequestData.imageData : null;

    this.state = {
      // Initialize the marker with the center coordinates from region of the map being shown
      region: initialRegion,
      markerPosition: initialMarker,
      sendEnabled: this.enableSend(),
      pickerData: [{label: '', key: ''}],
      selectedCategory: '',
      selectedServiceCode: Global.sendServiceRequestData.selectedServiceCode,
      locationEnabled: Global.sendServiceRequestData.locationEnabled,    // Whether geo tag will be added to the service request
      descriptionHeight: Global.sendServiceRequestData.descriptionHeight, // Height of the description textinput which will changed based on text changes
      titleText: Global.sendServiceRequestData.title,
      descriptionText: Global.sendServiceRequestData.description,
      imageData: initialImageData,
      image: Global.sendServiceRequestData.image,
      spinnerVisible: false,
      feedbackSent: false,
      fullScreenMap: false,
      scale: 1,                 // Used for animation
      scrollEnabled: true,      // Determines whether vertical scrolling is allowed
                                // This is used for allowing map scrolling inside a ScrollView on Android
    };

    transSendServiceRequest.setLanguage('fi');
    transError.setLanguage('fi');

    Global.isMainView = false;

    this.mapSpringVal = new Animated.Value(1);
    this.contentSpringVal = new Animated.Value(1);

    if (Platform.OS === 'android') { UIManager.setLayoutAnimationEnabledExperimental(true) }
  }

  componentWillMount() {
    this.fetchServices();
    this.initializeSpringAnimation();
  }

  componentWillUnmount() {

    if (this.state.feedbackSent) {
      this.clearForm();
    } else {
      this.saveForm();
    }
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
    var default_service = null;

    for (var i=0; i < data.length; i++) {

      // Exclude blacklisted categories
      if (Config.SERVICE_BLACKLIST.indexOf(parseInt(data[i].service_code)) === -1) {
        // If user returned to this view check, set previous service as the default service
        if (parseInt(data[i].service_code) === parseInt(Global.sendServiceRequestData.selectedServiceCode)) {
          default_service = {label: data[i].service_name, key: data[i].service_code};
        // If the service matches the default service defined in global settings, set it as the default
        } else if (parseInt(data[i].service_code) === Config.DEFAULT_SERVICE_CATEGORY && !Util.isNumeric(Global.sendServiceRequestData.selectedServiceCode)) {
          default_service = {label: data[i].service_name, key: data[i].service_code};
        } else {
          services.push({label: data[i].service_name, key: data[i].service_code});
        }
      }
    }

    // Add default service in the beginning of the array
    if (default_service !== null) {
      services.unshift(default_service);
    }

    this.setState({
      pickerData: services,
      selectedCategory: services[0].label,
      selectedServiceCode: services[0].key,
    });
  }

  enableSend() {
    if (Global.sendServiceRequestData.description.length >= Config.OPEN311_DESCRIPTION_MIN_LENGTH &&
        Global.sendServiceRequestData.description.length <= Config.OPEN311_DESCRIPTION_MAX_LENGTH) {
      return true;
    }
    return false;
  }

  onSendButtonClick() {
    if (this.state.descriptionText.length >= Config.OPEN311_DESCRIPTION_MIN_LENGTH &&
        this.state.descriptionText.length <= Config.OPEN311_DESCRIPTION_MAX_LENGTH) {
      this.sendServiceRequest();
    } else {
      showAlert(transError.descriptionLengthErrorTitle, transError.descriptionLengthErrorMessage, transError.descriptionErrorButton);
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

      this.setState({
        spinnerVisible: false,
        feedbackSent: true
      });

      Toast.show(transSendServiceRequest.feedbackSent);
      this.props.navigation.goBack();
    }, error => {
      this.setState({ spinnerVisible: false });
      showAlert(transError.networkErrorTitle, transError.networkErrorMessage, transError.networkErrorButton);
    });
  }

  navToServiceRequestListView() {
    this.props.navigation.navigate('ServiceRequestListView')
  }

  clearForm() {
    Global.sendServiceRequestData.title = '';
    Global.sendServiceRequestData.description = '';
    Global.sendServiceRequestData.descriptionHeight = 0;
    Global.sendServiceRequestData.region = null;
    Global.sendServiceRequestData.markerPosition = null;
    Global.sendServiceRequestData.imageData = null;
    Global.sendServiceRequestData.image = {source: null, name: null};
    Global.sendServiceRequestData.selectedServiceCode = '';
    Global.sendServiceRequestData.locationEnabled = true;
  }

  saveForm() {
    Global.sendServiceRequestData.title = this.state.titleText;
    Global.sendServiceRequestData.description = this.state.descriptionText;
    Global.sendServiceRequestData.descriptionHeight = this.state.descriptionHeight;
    Global.sendServiceRequestData.region = this.state.region;
    Global.sendServiceRequestData.markerPosition = this.state.markerPosition;
    Global.sendServiceRequestData.imageData = this.state.imageData;
    Global.sendServiceRequestData.image = this.state.image;
    Global.sendServiceRequestData.selectedServiceCode = this.state.selectedServiceCode;
    Global.sendServiceRequestData.locationEnabled = this.state.locationEnabled;
  }

  onAddAttachmentClick = () => {
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
        ImageResizer.createResizedImage(response.uri, Config.IMAGE_MAX_HEIGHT, Config.IMAGE_MAX_WIDTH, Config.IMAGE_FORMAT, Config.IMAGE_QUALITY).then((resizeImageData) => {
            var resizedSource = {uri: resizeImageData.uri, isStatic: true}

            response.path = resizeImageData.uri
            response.uri = resizeImageData.uri;
            this.setState({
              image: {source: resizedSource, name: response.fileName},
              imageData: response
            });

            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

        }).catch((error) => {
          showAlert(transError.feedbackImageErrorTitle, transError.feedbackImageErrorMessage, transError.feedbackImageErrorButton)
        });
      }
    });
  }

  onCheckboxClick = () => {
    if (this.state.locationEnabled) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    } else {
      mapValues = {
        start: this.state.locationEnabled ? 1 : 0,
        end: this.state.locationEnabled ? 0 : 1,
      };
      this.mapSpringVal.setValue(mapValues.start);
      Animated.spring(this.mapSpringVal, {
        toValue: mapValues.end,
        bounciness: 6,
      }).start();
    }

    this.setState({
      locationEnabled: !this.state.locationEnabled,
    });
  }


  // Update marker position after dragging marker and center map on marker.
  // Call hideCallout to hide Google Maps toolbar
  updateMarkerPos(location, marker) {
    marker.hideCallout();
    this.markerPosition = location;
    var markerRegion = {
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: this.props.navigation.state.params.mapRegion.latitudeDelta/ZOOM,
      longitudeDelta: this.props.navigation.state.params.mapRegion.longitudeDelta/ZOOM
    }
  }

  // Set marker position by long clicking the map. Center map on marker.
  setMarkerPos(location) {
    var markerRegion = {
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: this.props.navigation.state.params.mapRegion.latitudeDelta/ZOOM,
      longitudeDelta: this.props.navigation.state.params.mapRegion.longitudeDelta/ZOOM
    }

    this.setState({markerPosition: location})
  }

  centerMarker = (region) => {
    var location = {
      latitude: region.latitude,
      longitude: region.longitude,
    };

    this.setState({
      markerPosition: location,
      region: region
    });
  }

  onPickerItemChange = (item) => {
    this.setState({
      selectedCategory: Platform.OS === 'ios' ? item.label : item,
      selectedServiceCode: Platform.OS === 'ios' ? item.key : item,
    });
  }

  removeThumbnail = () => {
    this.setState({ image: {source: null, fileName: null}, imageData: null })
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }

  onContentSizeChange = (event) => {
    this.setState({
      // Change the height of description view based on the length of the text
      descriptionHeight: event.nativeEvent.contentSize.height
    })
  }

  onDescriptionChange = (event) => {
    if (event.nativeEvent.text.length < Config.OPEN311_DESCRIPTION_MAX_LENGTH) {
      this.setState({
        descriptionText: event.nativeEvent.text
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

  onTitleChange = (text) => {
    this.setState({
      titleText: text
    });
  }

  onRegionChange = (e) => {
    this.setState({
      region: e
    });
  }

  addSpringAnimation(currentValue, endValue) {
    this.scrollSpring.setCurrentValue(currentValue);
    this.scrollSpring.setEndValue(endValue);
  }

  setFullScreenMap = (value) => {
    // Invoke map change with animation only if value changes
    if (value !== this.state.fullScreenMap) {
      navValues = {
        start: this.state.fullScreenMap ? 0 : 1,
        end: this.state.fullScreenMap ? 1 : 0,
      };
      mapValues = {
        start: this.state.fullScreenMap ? 0.3 : 0.3,
        end: this.state.fullScreenMap ? 1 : 1,
      };
      this.mapSpringVal.setValue(mapValues.start);
      this.contentSpringVal.setValue(navValues.start);
      Animated.spring(this.mapSpringVal, {
        toValue: mapValues.end,
        bounciness: 6,
      }).start();
      Animated.spring(this.contentSpringVal, {
        toValue: navValues.end,
        bounciness: 6,
      }).start();
      this.setState({
        fullScreenMap: value
      });
    }
  }

  onDoneClick() {
    this.setFullScreenMap(false);
  }

  render() {
    var showThumbnail = this.state.image.source !== null;
    var checkboxImage = this.state.locationEnabled ?
      <Image style={styles.checkboxImage} source={checkboxIcon} /> : null;
    return (
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <ScrollView style={styles.scrollView}>
            <View style={styles.innerContainer}>
              <SendServiceRequestMap
                fullScreenMap={this.state.fullScreenMap}
                region={this.state.region}
                onRegionChange={this.onRegionChange}
                onRegionChangeComplete={this.centerMarker}
                markerIcon={markerIcon}
                updateMarkerPos={this.updateMarkerPos}
                setFullScreenMap={this.setFullScreenMap}
                onDoneClick={this.onDoneClick}
                locationEnabled={this.state.locationEnabled}
                animation={{transform: [{scaleY: this.mapSpringVal}]}} />
              {!this.state.fullScreenMap &&
              <SendServiceRequestForm
                locationEnabled={this.state.locationEnabled}
                onCheckboxClick={this.onCheckboxClick}
                pickerData={this.state.pickerData}
                selectedCategory={this.state.selectedCategory}
                onTitleChange={this.onTitleChange}
                descriptionHeight={this.state.descriptionHeight}
                onDescriptionChange={this.onDescriptionChange}
                onContentSizeChange={this.onContentSizeChange}
                onPickerItemChange={this.onPickerItemChange}
                checkboxImage={checkboxImage}
                defaultTitle={this.state.titleText}
                defaultDescription={this.state.descriptionText}
                hideAnimation={{transform: [{scaleY: this.contentSpringVal}]}}/>
              }
            </View>
          </ScrollView>
          {!this.state.fullScreenMap &&
            <SendServiceRequestAttachment
              onAddAttachmentClick={this.onAddAttachmentClick}
              thumbnailImageSource={this.state.image.source}
              removeThumbnail={this.removeThumbnail}
              showThumbnail={showThumbnail}
              hideAnimation={{transform: [{scaleY: this.contentSpringVal}]}} />
          }
          {Platform.OS === 'ios' && <KeyboardSpacer />}
        </View>
      </View>
    );
  }
}


module.exports = SendServiceRequestView
