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
} from 'react-native';

import Spinner from 'react-native-loading-spinner-overlay';
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import makeRequest          from '../util/requests';
import issueModels          from '../util/models';

import showAlert from '../components/Alert';
import Thumbnail            from '../components/Thumbnail';
import Config    from '../config';

import closeIcon from './../img/close.png';
import attachmentIcon   from '../img/attachment.png';


import transFeedback from '../translations/appFeedback';
import transError    from '../translations/errors';

const MODAL_HEIGHT           = 300;
const SIDE_PADDING           = 32;
const CLOSE_ICON_HEIGHT      = 32;
const CLOSE_ICON_WIDTH       = 32;
const BUTTON_ICON_HEIGHT     = 40;
const BUTTON_ICON_WIDTH      = 40;
const APP_FEEDBACK_TITLE = ""

class AppFeedbackView extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      feedbackText: '',
      imageData: null,
      image: {source: null, name: null},
    };

    transFeedback.setLanguage('fi');
    transError.setLanguage('fi');
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
      console.log(data)
      console.log(result)
      this.props.onClose()

    }, error => {
      console.log(data)
      this.props.onClose()
      console.log(error)
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
        showAlert(transError.attachmentErrorTitle, transError.attachmentErrorMessage, transError.attachmentError);
      } else if (response.didCancel) {
        source = null;
      } else {

        if (Platform.OS === 'ios') {
          source = {uri: response.uri.replace('file://', ''), isStatic: true};
        } else {
          source = {uri: response.uri, isStatic: true};
        }
        ImageResizer.createResizedImage(response.uri, 800, 600, 'JPEG', 20).then((resizedImageUri) => {
            NativeModules.RNImageToBase64.getBase64String(resizedImageUri, (err, base64) => {
              var resizedSource = {uri: resizedImageUri, isStatic: true}
              response.data = base64;
              response.path = resizedImageUri
              response.uri = resizedImageUri;
              this.setState({
                image: {source: resizedSource, name: response.fileName},
                imageData: response
              });
            })
        }).catch((err) => {
          showAlert(transError.feedbackImageErrorTitle, transError.feedbackImageErrorMessage, transError.feedbackImageErrorButton)
        });
      }
    });
  }

  render() {
    var showThumbnail = this.state.image.source !== null;

    return (
      <View>
        <Modal
          animationType={'fade'}
          transparent={true}
          visible={this.props.visible}
          onRequestClose={this.props.onClose}>
          <View style={styles.modalContainer}>
            <View style={styles.contentContainer}>
              <Text style={styles.text}>{transFeedback.appFeedbackViewTitle}</Text>
              <TextInput
                style={styles.contentInput}
                placeholder={transFeedback.feedbackInputPlaceholder}
                multiline={true}
                onChangeText={(text)=> {
                  this.setState({
                    feedbackText: text,
                  });
                }} />

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
                      imageClickAction={()=>this.setState({ image: {source: null, fileName: null}, imageData: null })} />
                  </View>

                  <View style={styles.buttonView}>
                    <TouchableWithoutFeedback onPress={this.onAttachmentIconClick.bind(this)}>
                      <Image
                        source={attachmentIcon}
                        style={styles.icon} />
                    </TouchableWithoutFeedback>
                  </View>
                  <TouchableWithoutFeedback onPress={this.onSendButtonClick.bind(this)}>
                    <View style={styles.sendButtonView}>
                      <Text style={styles.sendButtonText}>{transFeedback.sendButtonText}</Text>
                    </View>
                  </TouchableWithoutFeedback>
                </View>

            </View>
            <TouchableWithoutFeedback onPress={this.props.onClose}>
              <Image
                source={closeIcon}
                style={styles.closeIcon}/>
            </TouchableWithoutFeedback>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    position: 'absolute',
    top: MODAL_HEIGHT / 2 + 10,
    right: SIDE_PADDING / 2 + 5,
    height: CLOSE_ICON_HEIGHT,
    width: CLOSE_ICON_WIDTH,
  },
  contentContainer: {
    shadowOpacity: 0.8,
    shadowOffset: {
      height: 0,
      width: 0
    },
    height: MODAL_HEIGHT,
    width: Dimensions.get('window').width - SIDE_PADDING,
    backgroundColor: '#EEEEEE',
    padding: 20,
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
    flexDirection: 'column',
    position: 'absolute',
    bottom:0,
    left:0,
    right:0,
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
    marginBottom: 10,
  },
  thumbnailWrapper: {
    position: 'absolute',
    left: 10,
    bottom: 65,
  }
});

module.exports = AppFeedbackView
