import React, { Component } from 'react';
import rebound from 'rebound';
import {
  View,
  Image,
  Text,
  TextInput,
  Platform,
  TouchableWithoutFeedback,
  ScrollView,
  NativeModules,
  UIManager,
  LayoutAnimation,
  DeviceEventEmitter,
} from 'react-native';

import KeyboardSpacer       from 'react-native-keyboard-spacer';
import Spinner              from 'react-native-loading-spinner-overlay';
import ImagePicker          from 'react-native-image-picker';
import ImageResizer         from 'react-native-image-resizer';
import Toast                from 'react-native-simple-toast';
import makeRequest          from '../../util/requests';
import serviceRequestModels from '../../util/models';
import Global               from '../../util/globals';
import showAlert            from '../../components/Alert';
import Thumbnail            from '../../components/Thumbnail';
import Menu                 from '../../components/Menu';
import Navbar               from '../../components/Navbar';
import Config               from '../../config';
import backIcon             from '../../img/back.png';
import sendEnabledIcon      from '../../img/send_enabled.png';
import sendDisabledIcon     from '../../img/send_disabled.png';
import closeIcon            from '../../img/close.png';
import attachmentIcon       from '../../img/close.png';
import transAppFeedback     from '../../translations/appFeedback';
import transError           from '../../translations/errors';
import styles               from './styles';

// View for sending feedback about the application itself
class AppFeedbackView extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      descriptionText: '',
      titleText: '',
      imageData: null,
      image: {source: null, name: null},
      showThumbnail: false,
      spinnerVisible: false,
      scale: 1, // Used for animations
    };

    transAppFeedback.setLanguage('fi');
    transError.setLanguage('fi');

    Global.isMainView = false;

    // Needed for LayoutAnimation to work on android.
    if (Platform.OS === 'android') { UIManager.setLayoutAnimationEnabledExperimental(true) }
  }

  componentWillMount() {
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

  sendFeedback() {
    this.setState({ spinnerVisible: true });
    var url     = Config.OPEN311_SEND_SERVICE_URL;
    var method  = 'POST';
    var headers = {'Content-Type': 'multipart/form-data', 'Accept': 'application/json'};
    var data    = new FormData();

    data.append('api_key', Config.OPEN311_SEND_SERVICE_API_KEY);
    data.append('service_code', Config.APP_FEEDBACK_SERVICE_CODE);
    data.append('description', this.state.descriptionText);
    data.append('title', this.state.titleText !== null ? this.state.titleText : '');

    // Pick image
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
      this.setState({
        image: {source: null, fileName: null},
        imageData: null,
        spinnerVisible: false,
      });
      Toast.show(transAppFeedback.feedbackSentText);
      this.props.navigation.goBack();
    }, error => {
      this.setState({
        image: {source: null, fileName: null},
        imageData: null,
        spinnerVisible: false,
      });
      showAlert(transError.networkErrorTitle, transError.networkErrorMessage, transError.networkErrorButton);
    });
  }

  onSendButtonClick() {
    if (this.state.descriptionText.length >= Config.OPEN311_DESCRIPTION_MIN_LENGTH &&
        this.state.descriptionText.length <= Config.OPEN311_DESCRIPTION_MAX_LENGTH) {
      this.sendFeedback();
    } else {
      showAlert(transError.descriptionLengthErrorTitle, transError.descriptionLengthErrorMessage, transError.descriptionErrorButton);
    }
  }

  onAddAttachmentClick() {
    var options = {
      title: '',
      cancelButtonTitle: transAppFeedback.imagePickerCancelButton,
      takePhotoButtonTitle: transAppFeedback.imagePickerPictureButton,
      chooseFromLibraryButtonTitle: transAppFeedback.imagePickerLibraryButton,
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

        // Compress image size
        ImageResizer.createResizedImage(response.uri, Config.IMAGE_MAX_HEIGHT,
          Config.IMAGE_MAX_WIDTH, Config.IMAGE_FORMAT, Config.IMAGE_QUALITY).then((resizedImageUri) => {
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

  onDescriptionTextChange(text) {

    // Stop adding text if the limit is reached
    if (text.length < Config.OPEN311_DESCRIPTION_MAX_LENGTH) {
      this.setState({descriptionText: text});
    }

    // Enable send button if the length of the description is within limits
    if (text.length >= Config.OPEN311_DESCRIPTION_MIN_LENGTH &&
        text.length <= Config.OPEN311_DESCRIPTION_MAX_LENGTH) {
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

  removeThumbnail() {
    this.setState({ image: {source: null, fileName: null}, imageData: null })
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }

  addSpringAnimation(currentValue, endValue) {
    this.scrollSpring.setCurrentValue(currentValue);
    this.scrollSpring.setEndValue(endValue);
  }

  render() {
    var showThumbnail = this.state.image.source !== null;

    return (
      <View style={styles.container}>
        <Navbar
          leftIcon={backIcon}
          onLeftButtonClick={()=>this.props.navigation.goBack()}
          rightIcon={this.state.sendEnabled ? sendEnabledIcon : sendDisabledIcon}
          iconAnimationStyle={{transform: [{scaleX: this.state.scale}, {scaleY: this.state.scale}]}}
          onRightButtonClick={this.onSendButtonClick.bind(this)}
          header={transAppFeedback.appFeedbackViewTitle} />
        <View style={styles.innerContainer}>
          <Spinner visible={this.state.spinnerVisible} />
          <ScrollView style={styles.scrollView}>
            <View style={styles.contentContainer}>
              <View style={styles.titleView}>
                <TextInput
                  style={styles.titleText}
                  onChangeText={(text)=> { this.setState({ titleText: text }) }}
                  placeholder={transAppFeedback.titlePlaceholder}
                  autoCapitalize={'sentences'} />
              </View>
              <View style={styles.descriptionView}>
                <TextInput
                  style={styles.descriptionText}
                  multiline={true}
                  onChangeText={(text)=>this.onDescriptionTextChange(text)}
                  placeholder={transAppFeedback.descriptionPlaceholder}
                  autoCapitalize={'sentences'} />
              </View>
            </View>
          </ScrollView>
          <View style={styles.attachmentContainer}>
            {this.state.image.source === null &&
            <TouchableWithoutFeedback onPress={this.onAddAttachmentClick.bind(this)}>
              <View style={styles.attachmentButton}>
                <Text style={styles.attachmentButtonText}>{transAppFeedback.addAttachment}</Text>
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
          {Platform.OS === 'ios' && <KeyboardSpacer/>}
        </View>
      </View>
    );
  }
}



module.exports = AppFeedbackView
