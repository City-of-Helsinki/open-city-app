import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  TextInput,
  Dimensions,
  Platform,
  TouchableWithoutFeedback,
  ScrollView,
  Modal,
  NativeModules,
  Keyboard,
  UIManager,
  LayoutAnimation,
} from 'react-native';

import Spinner from 'react-native-loading-spinner-overlay';
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import Toast from 'react-native-simple-toast';

import makeRequest          from '../util/requests';
import issueModels          from '../util/models';

import showAlert from '../components/Alert';
import Thumbnail            from '../components/Thumbnail';
import Config    from '../config';

import closeIcon from './../img/close_image.png';
import attachmentIcon   from '../img/attachment.png';


import transFeedback from '../translations/appFeedback';
import transError    from '../translations/errors';

const MODAL_HEIGHT           = 300;
const SIDE_PADDING           = 32;
const CLOSE_ICON_HEIGHT      = 24;
const CLOSE_ICON_WIDTH       = 24;
const BUTTON_ICON_HEIGHT     = 40;
const BUTTON_ICON_WIDTH      = 40;

var _keyboardWillShowSubscription;
var _keyobardWillHideSubscription;

class AppFeedbackView extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      feedbackText: '',
      imageData: null,
      image: {source: null, name: null},
      showThumbnail: false,
      keyboardVisible: false,
    };

    transFeedback.setLanguage('fi');
    transError.setLanguage('fi');

    // Needed for LayoutAnimation to work on android.
    if (Platform.OS === 'android') { UIManager.setLayoutAnimationEnabledExperimental(true) }
  }

  componentWillMount() {
    //this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardWillShow.bind(this))
    //this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardWillHide.bind(this))
  }

  componentWillUnmount () {
    //this.keyboardDidShowListener.remove()
    //this.keyboardDidHideListener.remove()
  }

  keyboardWillShow (e) {
    this.setState({
      keyboardVisible: true,
    })
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
  }

  keyboardWillHide (e) {
    this.setState({
      keyboardVisible: false,
    })
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
  }
  sendFeedback() {
    var url     = Config.OPEN311_SEND_SERVICE_URL;
    var method  = 'POST';
    var headers = {'Content-Type': 'multipart/form-data', 'Accept': 'application/json'};
    var data    = new FormData();
    const DEBUG_SERVICE_CODE = 172;
    data.append('api_key', Config.OPEN311_SEND_SERVICE_API_KEY);
    data.append('service_code', DEBUG_SERVICE_CODE);
    //data.append('service_code', Config.APP_FEEDBACK_SERVICE_CODE);
    data.append('description', this.state.feedbackText);

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


    //makeRequest(url, method, headers, data)
    makeRequest(url + 'requests.json?extensions=media,citysdk', method, headers, data)
    .then(result => {

      this.setState({ image: {source: null, fileName: null}, imageData: null });
      Toast.show(transFeedback.feedbackSentText);
      this.props.onClose()

    }, error => {
      this.setState({ image: {source: null, fileName: null}, imageData: null });
      this.props.onClose()
      showAlert(transError.networkErrorTitle, transError.networkErrorMessage, transError.networkErrorButton);
    });
  }


  onSendButtonClick() {
    if (this.state.feedbackText.length >= Config.OPEN311_DESCRIPTION_MIN_LENGTH &&
        this.state.feedbackText.length <= Config.OPEN311_DESCRIPTION_MAX_LENGTH) {
      this.sendFeedback(this)
    } else {
      // Show an alert informing user that the description text was not valid
      showAlert(transError.feedbackTextLengthErrorTitle, transError.feedbackTextLengthErrorMessage, transError.feedbackErrorButton);
    }
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

        }).catch((err) => {
          showAlert(transError.feedbackImageErrorTitle, transError.feedbackImageErrorMessage, transError.feedbackImageErrorButton)
        });
      }
    });
  }

  render() {
    var showThumbnail = this.state.image.source !== null;
    var keyboardVisible = this.state.keyboardVisible;
    this.showThumbnail = showThumbnail;

    return (
      <View>
        <Modal
          animationType={'fade'}
          transparent={true}
          visible={this.props.visible}
          onRequestClose={this.props.onClose}>
          <View style={[styles.modalContainer,
            (keyboardVisible) ?
            {alignItems: 'flex-start', paddingTop:60}  :
            {alignItems: 'center'}]}>
            <View style={styles.contentContainer}>
              <View style={styles.topContainer}>
                <Text style={[styles.text, styles.textFont]}>{transFeedback.appFeedbackViewTitle}</Text>
                <TouchableWithoutFeedback onPress={this.props.onClose}>
                  <Image
                    source={closeIcon}
                    style={styles.closeIcon}/>
                </TouchableWithoutFeedback>
              </View>
              <View style={styles.textContainer}>
                <TextInput
                  style={styles.contentInput}
                  placeholder={transFeedback.feedbackInputPlaceholder}
                  multiline={true}
                  onChangeText={(text)=> {
                    this.setState({
                      feedbackText: text,
                    });
                  }} />
              </View>

                <View style={[styles.bottomContainer,
                  showThumbnail
                    ? { height: 70 }
                    : { height: 70 },]}>

                  <TouchableWithoutFeedback onPress={this.onAttachmentIconClick.bind(this)}>
                    <Image
                      source={attachmentIcon}
                      style={styles.icon} />
                  </TouchableWithoutFeedback>

                  <View style={styles.thumbnailWrapper}>
                    <Thumbnail
                      show={showThumbnail}
                      imageSource={this.state.image.source}
                      imageHeight={50}
                      imageWidth={50}
                      imageClickAction={()=>this.setState({ image: {source: null, fileName: null}, imageData: null })} />
                  </View>

                  <TouchableWithoutFeedback onPress={this.onSendButtonClick.bind(this)}>
                    <View style={styles.sendButtonView}>
                      <Text style={[styles.sendButtonText, styles.textFont]}>{transFeedback.sendButtonText}</Text>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    height: CLOSE_ICON_HEIGHT,
    width: CLOSE_ICON_WIDTH,
    position:'absolute',
    right:-10,
    top:-10,
  },
  topContainer:{
    flexDirection:'row',
    height: CLOSE_ICON_HEIGHT
  },
  contentContainer: {
    height: MODAL_HEIGHT,
    width: Dimensions.get('window').width - SIDE_PADDING,
    backgroundColor: '#EEEEEE',
    padding: 20,
  },
  textContainer: {
    shadowOpacity: 0.8,
    shadowOffset: {
      height: 0,
      width: 0
    },
    shadowColor: 'black',
    shadowRadius: 1,
    flex: 1,
    backgroundColor: '#EEEEEE',
  },
  sendButtonView: {
    height: 40,
    width: 80,
    position: 'absolute',
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sendButtonText: {
    color: '#607D8B',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomContainer:{
    paddingLeft: 5,
    flexDirection: 'row',
  },
  contentInput: {
    flex: 1,
    textAlignVertical: 'top',
    backgroundColor: '#fff',
  },
  icon: {
    height: BUTTON_ICON_HEIGHT,
    width: BUTTON_ICON_WIDTH,
    marginRight: 25,
    position: 'absolute',
    bottom:0,
  },
  thumbnailWrapper: {
    position:'absolute',
    bottom: 0,
    left: 50,
  },
  textFont: {
    fontFamily: 'montserrat',
  }
});

module.exports = AppFeedbackView
