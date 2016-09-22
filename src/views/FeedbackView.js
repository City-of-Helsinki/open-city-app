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
  Platform
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

// Translations
import transFeedback from '../translations/feedback';
import transError    from '../translations/errors';

// Images
import sendIcon        from '../img/send.png';
import markerIcon      from '../img/location_marker.png';
import attachmentIcon  from '../img/attachment.png';
import locationOnIcon  from '../img/location_on.png';
import locationOffIcon from '../img/location_off.png';

var navigator;
const DEFAULT_CATEGORY   = 'Muu';
const BUTTON_ICON_HEIGHT = 40;
const BUTTON_ICON_WIDTH  = 40;

class FeedbackView extends Component {
  constructor(props, context) {
    super(props, context);

    navigator = this.props.navigator;

    this.state = {
      // Initialize the marker with the center coordinates from region of the map being shown
      markerPosition: {
        latitude: this.props.route.mapRegion.latitude,
        longitude: this.props.route.mapRegion.longitude
      },
      pickerData: [DEFAULT_CATEGORY],
      selectedCategory: DEFAULT_CATEGORY,
      locationEnabled: true,
      imageSource: null,
    };

    transFeedback.setLanguage('fi');
    transError.setLanguage('fi');
  }

  componentWillMount() {
    //fetch categories
    this.setState({
      pickerData: [DEFAULT_CATEGORY, 'xx'],
    });
  }

  sendFeedback() {
    alert('lähetysx')
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
      var source = null;

      if (response.error) {
        showAlert(transError.attachmentErrorTitle, transError.attachmentErrorMessage, transError.attachmentErrorOk);
      } else if (response.didCancel) {
        source = null;
      } else {
        // You can display the image using either data...
        const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};

        // or a reference to the platform specific asset location
        if (Platform.OS === 'android') {
          const source = {uri: response.uri, isStatic: true};
        } else {
          const source = {uri: response.uri.replace('file://', ''), isStatic: true};
        }

        this.setState({
          imageSource: source
        });
      }
    });
  }

  render() {
    var showThumbnail = this.state.imageSource !== null;
    var locationIcon  = this.state.locationEnabled ? locationOffIcon : locationOnIcon;
    var mapView       = this.state.locationEnabled ?
                        <View style={styles.mapContainer}>
                          <MapView
                            style={styles.map}
                            region={this.props.route.mapRegion}
                            showsUserLocation={false}
                            followUserLocation={false}
                            toolbarEnabled={false}
                            onMarkerDragEnd={(e) => alert('drag')} >
                            <MapView.Marker draggable
                              image={markerIcon}
                              coordinate={this.state.markerPosition}
                              onDragStart={(e) => alert('sdrag')}
                              onDragEnd={(e) => alert('drag')} />
                          </MapView>
                        </View> : null;

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
              itemChange={(item)=>this.setState({ selectedCategory: item })}/>
          </View>

          <TextInput
            style={styles.titleInput}
            placeholder={transFeedback.inputTitlePlaceholder}
            name="title"
          />

          <View style={styles.contentContainer}>
            <TextInput
              style={styles.contentInput}
              placeholder={transFeedback.inputContentPlaceholder}
              name="content"
              multiline={true}
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
                    imageSource={this.state.imageSource}
                    imageHeight={100}
                    imageWidth={100}
                    imageClickAction={()=>this.setState({ imageSource: null })} />
                </View>
            </View>
          </View>

        </View>
          <FloatingActionButton
            icon={sendIcon}
            onButtonClick={()=>this.sendFeedback(this)} />
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
    fontSize: 16,
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
