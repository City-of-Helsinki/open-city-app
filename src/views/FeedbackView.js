import React, { Component, } from 'react';
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
  Keyboard,
  DeviceEventEmitter,
  UIManager,
  LayoutAnimation,
  AsyncStorage
} from 'react-native';

// External modules
import MapView     from 'react-native-maps';
import Drawer      from 'react-native-drawer';
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import Toast from 'react-native-simple-toast';
import KeyboardSpacer from 'react-native-keyboard-spacer';


// Components
import FloatingActionButton from '../components/FloatingActionButton';
import NativePicker         from '../components/NativePicker';
import Navbar               from '../components/Navbar';
import Menu                 from '../components/Menu';
import Thumbnail            from '../components/Thumbnail';
import showAlert            from '../components/Alert';
import AppFeedbackModal     from './AppFeedbackView';
import Config               from '../config';

import makeRequest          from '../util/requests';
import issueModels          from '../util/models';
import Global               from '../util/globals';

// Translations
import transFeedback from '../translations/feedback';
import transError    from '../translations/errors';

// Images
import sendEnabledIcon  from '../img/send.png';
import sendDisabledIcon from '../img/send_disabled.png';
import markerIcon       from '../img/blue_marker.png';
import attachmentIcon   from '../img/attachment.png';
import locationOnIcon   from '../img/location_on.png';
import locationOffIcon  from '../img/location_off.png';
import ownLocationIcon  from '../img/own_loc.png';

var navigator;

const DEFAULT_CATEGORY       = 'Muu';
const BUTTON_ICON_HEIGHT     = 40;
const BUTTON_ICON_WIDTH      = 40;
const DESCRIPTION_MIN_LENGTH = 10;
const ZOOM                   = 6;
const DESCRIPTION_MAX_LENGTH = 5000;
const MARKER_IMAGE_SIZE      = 35;
var isFeedbackSent = false;

var _keyboardWillShowSubscription;
var _keyobardWillHideSubscription;

class FeedbackView extends Component {

  constructor(props, context) {
    super(props, context);

    navigator = this.props.navigator;
    this.state = {
      visibleHeight: Dimensions.get('window').height,
      keyboardVisible: false,
      // Initialize the marker with the center coordinates from region of the map being shown
      markerPosition:{ latitude: this.props.route.mapRegion.latitude,
        longitude: this.props.route.mapRegion.longitude},
      sendEnabled: false,
      pickerData: [],
      region: {latitude: this.props.route.mapRegion.latitude,
              longitude: this.props.route.mapRegion.longitude,
              latitudeDelta: this.props.route.mapRegion.latitudeDelta/ZOOM,
              longitudeDelta: this.props.route.mapRegion.longitudeDelta/ZOOM},
      selectedCategory: '',
      selectedServiceCode: '',
      locationEnabled: true,
      descriptionText: '',
      titleText: '',
      image: {source: null, name: null},
      imageData: null,
      showAppFeedbackModal: false, // Show/hide modal for giving feedback
    };

    //this.refs.map.animateToRegion(region)
    transFeedback.setLanguage('fi');
    transError.setLanguage('fi');

    Global.isMainView = false;

    if (Platform.OS === 'android') {
      console.log("!!!!!!!!!!!!!!!!!!!!!PLATFOOOOORM")

      UIManager.setLayoutAnimationEnabledExperimental(true) }
  }

  componentDidMount() {
    //Keyboard.addListener('keyboardDidShow', this.keyboardWillShow.bind(this));
    //Keyboard.addListener('keyboardDidHide', this.keyboardWillHide.bind(this));
    //this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardWillShow.bind(this))
    //this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardWillHide.bind(this))
  }

  componentWillMount() {
    this.fetchServices();
    this.setState({
      pickerData: [{label: '', key: ''}],
    });


    var keys = ['descriptionText', 'titleText', 'serviceCode', 'selectedCategory', 'imageData', 'image', 'locationEnabled']

    AsyncStorage.multiGet(keys, (err, stores) => {

      var sendEnabled = false;
      var selectedCategory = "";
      var titleText = "";
      var selectedServiceCode = "";
      var descriptionText = "";
      console.log("!!!!!!!!!!!1111!!!!!!!!!!")
      console.log(Platform)
      console.log(Platform.OS)

      if (Platform.OS === 'android') {
        console.log("IS ANDROID")
      }
      console.log(stores)

      console.log(selectedCategory + " / " + selectedServiceCode + " / " + descriptionText + " / " + sendEnabled)
      if(stores[0][1]) {
        if(stores[3][1]) {
        sendEnabled = stores[0][1].length >= Config.OPEN311_DESCRIPTION_MIN_LENGTH &&
                        stores[0][1].length <= Config.OPEN311_DESCRIPTION_MAX_LENGTH &&
                        stores[3][1].length > 0;
        }

        descriptionText = stores[0][1];
      }
      if(stores[1][1]) {
        titleText = stores[1][1]
      }
      if(stores[2][1]) {
        selectedServiceCode = stores[2][1]
      }

      if(stores[3][1]) {
        selectedCategory = stores[3][1];
      }

        this.setState({
          descriptionText: stores[0][1],
          titleText: titleText,
          selectedServiceCode: selectedServiceCode,
          selectedCategory: selectedCategory,
          sendEnabled: sendEnabled,
        })


     });



  }

  componentWillUnmount () {
    var keyvalues = [['descriptionText', this.state.descriptionText],
     ['titleText', this.state.titleText],
     ['serviceCode', this.state.selectedServiceCode],
     ['selectedCategory', this.state.selectedCategory]]

     if(!this.isFeedbackSent) {
       AsyncStorage.multiSet(keyvalues, (err) => {
        });
      }

      //Keyboard.removeAllListeners('keyboardDidShow');
      //Keyboard.removeAllListeners('keyboardDidHide');

      //this.keyboardDidShowListener.remove()
      //this.keyboardDidHideListener.remove()

  }

  keyboardWillShow (e) {
    console.log("KEYBOARD SHOWING")
    let newSize = Dimensions.get('window').height - e.endCoordinates.height
    if(Platform.OS === 'android') {
      console.log("android")
      newSize = newSize + 180
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)

    this.setState({
      visibleHeight: newSize,
      keyboardVisible: true,
    })

  }

  keyboardWillHide (e) {
    console.log("KEYBOARD HIDING")
    this.setState({
      visibleHeight: Dimensions.get('window').height,
      keyboardVisible: false,
    })
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
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

  parseServiceList(data) {
    var services = [];
    for (var i=0; i < data.length; i++) {

      // Exclude blacklisted categories
      if (Config.SERVICE_BLACKLIST.indexOf(parseInt(data[i].service_code)) === -1) {
        services.push({label: data[i].service_name, key: data[i].service_code});
      }
    }

    this.setState({
      pickerData: services,
    });
  }


  sendFeedback() {
    var url     = Config.OPEN311_SEND_SERVICE_URL;
    var method  = 'POST';
    var headers = {'Content-Type': 'multipart/form-data', 'Accept': 'application/json'};
    var data    = new FormData();

    data.append('api_key', Config.OPEN311_SEND_SERVICE_API_KEY);
    data.append('service_code', this.state.selectedServiceCode);
    data.append('description', this.state.descriptionText);

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
      data.append('media_url', this.state.imageData)
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

    if (this.state.titleText !== null) {
      data.append('title', this.state.titleText);
    } else {
      data.append('title', '');
    }

    console.log(data)
    //makeRequest(url, method, headers, data)
    makeRequest(url + 'requests.json?extensions=media,citysdk', method, headers, data)
    .then(result => {

      if ('service_request_id' in result[0]) {
        issueModels.insert(result[0]['service_request_id'])
      }
      var keys = ['descriptionText', 'titleText', 'serviceCode', 'selectedCategory', 'imageData', 'image', 'locationEnabled']

      AsyncStorage.multiRemove(keys, (err) => {
       });
       this.isFeedbackSent = true;
       Toast.show(transFeedback.feedbackSent);

      this.props.navigator.resetTo({
        id: 'MainView',
      });
    }, error => {
      alert(error)
      //showAlert(transError.networkErrorTitle, transError.networkErrorMessage, transError.networkErrorButton);
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
        latitudeDelta: this.props.route.mapRegion.latitudeDelta/ZOOM,
        longitudeDelta: this.props.route.mapRegion.longitudeDelta/ZOOM
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
      title: '',
      cancelButtonTitle: transFeedback.imagePickerCancelButton,
      takePhotoButtonTitle: transFeedback.imagePickerPictureButton,
      chooseFromLibraryButtonTitle: transFeedback.imagePickerLibraryButton,
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
        ImageResizer.createResizedImage(response.uri, Config.IMAGE_MAX_HEIGHT,
          Config.IMAGE_MAX_WIDTH, Config.IMAGE_FORMAT, Config.IMAGE_QUALITY).then((resizedImageUri) => {
            var resizedSource = {uri: resizedImageUri, isStatic: true}

            response.path = resizedImageUri
            response.uri = resizedImageUri;
            this.setState({
              image: {source: resizedSource, name: response.fileName},
              imageData: response
            });

            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)


        }).catch((err) => {
          showAlert(transError.feedbackImageErrorTitle, transError.feedbackImageErrorMessage, transError.feedbackImageErrorButton)
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
      latitudeDelta: this.props.route.mapRegion.latitudeDelta/ZOOM,
      longitudeDelta: this.props.route.mapRegion.longitudeDelta/ZOOM
    }

    //this.refs.map.animateToRegion(markerRegion)

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

  onAppFeedbackModalClick(drawer) {
    drawer.close();
    this.setState({
      showAppFeedbackModal: true,
    });
  }

  onAppFeedbackModalClose() {
    this.setState({
      showAppFeedbackModal: false,
    });
  }

  removeThumbnail() {
    this.setState({ image: {source: null, fileName: null}, imageData: null })
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)

  }

  render() {
    var showThumbnail = this.state.image.source !== null;

    var keyboardVisible = this.state.keyboardVisible;
    var locationIcon  = this.state.locationEnabled ? locationOffIcon : locationOnIcon;
    var mapView       = this.state.locationEnabled ?
                        <View style={[styles.mapContainer, keyboardVisible ? {flex: 0.001,} : {flex: 0.3}]}>
                          <MapView
                            ref='map'
                            style={styles.map}
                            region={this.state.region}
                            showsUserLocation={false}
                            followUserLocation={false}
                            toolbarEnabled={false}
                            onLongPress={(e) => this.setMarkerPos(e.nativeEvent.coordinate)}
                            //onRegionChange={(e) => this.centerMarker(e)}
                            onRegionChangeComplete={(e) => this.centerMarker(e)}
                            >
                            <MapView.Marker.Animated draggable
                              ref='marker'
                              coordinate={this.state.region}
                              onDragEnd={(e) => this.updateMarkerPos(e.nativeEvent.coordinate)}>
                              <Image
                                source={markerIcon}
                                style={{height:MARKER_IMAGE_SIZE, width: MARKER_IMAGE_SIZE}} />
                            </MapView.Marker.Animated>
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
        content={
          <Menu
            mapView={()=>{this.props.navigator.pop()}}
            feedbackView={()=>{this.navToIssueListView(this._drawer)}}
            appFeedbackView={()=>{this.onAppFeedbackModalClick(this._drawer)}}
            onMenuClick={()=>this._drawer.close()}/>
        }>

        <View style={[styles.container, {height: this.state.visibleHeight}]}>
          <Navbar
            onMenuClick={()=>this._drawer.open()}
            header={transFeedback.feedbackViewTitle}/>
        {mapView}
        <View style={[styles.feedbackContainer]}>
          <View style={styles.categoryContainer}>
            <View style={styles.categoryTextView}>
              <Text style={[styles.categoryText, styles.textFont]}>{transFeedback.category}</Text>
            </View>
            <NativePicker
              data={this.state.pickerData}
              defaultItem={this.state.selectedCategory}
              selectedItem={this.state.selectedCategory}
              itemChange={(item)=>{
                if(this.state.descriptionText) {
                  var sendEnabled = this.state.descriptionText.length >= Config.OPEN311_DESCRIPTION_MIN_LENGTH &&
                                  this.state.descriptionText.length <= Config.OPEN311_DESCRIPTION_MAX_LENGTH;
                }
                this.setState(
                  { selectedCategory: (Platform.OS === 'ios') ? item.label : item,
                    selectedServiceCode:  (Platform.OS === 'ios') ? item.key : item,
                    sendEnabled: sendEnabled,
                  })
                }
              }/>
          </View>

          <View
            style={styles.titleWrapper}>
            <TextInput
              style={[styles.titleInput, styles.textFont]}
              placeholder={transFeedback.inputTitlePlaceholder}
              name="title"
              value={this.state.titleText}
              onChangeText={(text)=> {this.setState({titleText: text})}}
            />
          </View>

          <View style={[styles.contentContainer, {marginBottom: (this.state.keyboardVisible) ? Dimensions.get('window').height / 3.5 : 0}]}>
            <TextInput
              style={[styles.contentInput, styles.textFont]}
              placeholder={transFeedback.inputContentPlaceholder}
              name="content"
              multiline={true}
              value={this.state.descriptionText}
              onChangeText={(text)=> {
                var sendEnabled = text.length >= Config.OPEN311_DESCRIPTION_MIN_LENGTH &&
                                  text.length <= Config.OPEN311_DESCRIPTION_MAX_LENGTH &&
                                  this.state.selectedCategory.length > 0;
                this.setState({
                  sendEnabled: sendEnabled,
                  descriptionText: text,
                });
              }}
            />
            <View style={styles.horizontalContainer}>
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

              <View style={[styles.thumbnailWrapper]}>
                <Thumbnail
                  show={showThumbnail}
                  imageSource={this.state.image.source}
                  imageHeight={55}
                  imageWidth={55}
                  imageClickAction={()=>this.removeThumbnail()} />
              </View>
            </View>


            <FloatingActionButton
              style={styles.FAB}
              icon={sendIcon}
              onButtonClick={()=>{if(this.state.sendEnabled) {this.sendFeedback(this)}}} />

          </View>

        </View>
          <AppFeedbackModal
            visible={this.state.showAppFeedbackModal}
            onClose={()=>this.onAppFeedbackModalClose(this)} />
          </View>

          <KeyboardSpacer></KeyboardSpacer>
      </Drawer>
    );
  }

//<View style={[{height: (this.state.keyboardVisible) ? (Dimensions.get('window').height - this.state.visibleHeight) : 0}]}></View>
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
  },
  horizontalContainer: {
    flexDirection: 'column',
    flex: 0.3,
    justifyContent: 'center',
    marginTop: 20,
  },
  mapContainer: {
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
    flex: 0.2,
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
    flex: 1,
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
    textAlignVertical: 'top',
    backgroundColor: 'rgba(0,0,0,0)',
  },
  buttonView: {
    flexDirection: 'row',
    alignItems: 'flex-end',

  },
  icon: {
    height: BUTTON_ICON_HEIGHT,
    width: BUTTON_ICON_WIDTH,
    marginRight: 5,
    marginBottom: 30,
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
    left: 100,
    bottom: 20,
  },
  textFont: {
    fontFamily: 'montserrat',
  }

});

BackAndroid.addEventListener('hardwareBackPress', function() {

  // Close menu if it's open otherwise navigate to the previous view
  if (Global.menuOpen && Global.menuRef !== null) {
    Global.menuRef.close();
    return true;
  } else if (navigator) {
    Global.isMainView = true;
    navigator.pop();
    return true;
  }

  return false;
});

module.exports = FeedbackView
