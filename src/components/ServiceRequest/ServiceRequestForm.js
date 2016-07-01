import React, { Component, PropTypes } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableWithoutFeedback,
  ScrollView,
  Picker,
  Alert
} from 'react-native';

import _ from 'lodash';

import dismissKeyboard from 'dismissKeyboard';

import NavBar from '../NavBar/NavBar';
import ActivityIndicator from '../ActivityIndicator';

import translationsGeneral from '../../translations/general';
import translationsServiceRequest from '../../translations/serviceRequest';

import {createServiceRequest} from '../../helpers/service-request';
import {findServices} from '../../helpers/service';

import {formStyles as styles} from './styles';

import ImagePicker from 'react-native-image-picker';

class ServiceRequestForm extends Component {
  /**
   * @constructor
   */
  constructor() {
    super();

    translationsServiceRequest.setLanguage('fi');

    this.imagePickerOptions = {
      cancelButtonTitle: translationsGeneral.cancel,
      takePhotoButtonTitle: translationsServiceRequest.takePhoto, // specify null or empty string to remove this button
      chooseFromLibraryButtonTitle: translationsServiceRequest.chooseFromLibrary, // specify null or empty string to remove this button
      cameraType: 'back', // 'front' or 'back'
      mediaType: 'photo', // 'photo' or 'video'
      durationLimit: 10, // video recording max time in seconds
      allowsEditing: true, // Built in functionality to resize/reposition the image after selection
      noData: false, // photos only - disables the base64 `data` field from being generated (greatly improves performance on large photos)
      storageOptions: { // if this key is provided, the image will get saved in the documents directory on ios, and the pictures directory on android (rather than a temporary directory)
        skipBackup: true, // ios only - image will NOT be backed up to icloud
        path: 'images' // ios only - will save image at /Documents/images rather than the root
      }
    };

    this.state = {
      position: null,
      imageSource: null,
      imageData: null,
      description: '',
      address: '',
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      services: null,
      service_code: null
    };
  }

  /**
   *
   */
  componentWillMount() {
    this.setState({
      isLoading: true
    });

    findServices({ locale: 'fi_FI' })
      .then(result => {
        console.log('findServices result:', result);

        if (result.data) {
          this.setState({
            services: result.data,
            service_code: result.data[0].service_code,
            isLoading: false
          });
        }
      })
      .catch(err => {
        console.log('findServices error:', err);
        alert(err);
      });
  }

  /**
   *
   */
  addImageButtonPress() {
    if (!this.state.imageSource) {
      this.imagePickerOptions.customButtons = undefined;
    } else {
      this.imagePickerOptions.customButtons = {};
      this.imagePickerOptions.customButtons[translationsServiceRequest.removePhoto] = 'removePhoto';
    }

    ImagePicker.showImagePicker(this.imagePickerOptions, (response) => {
      console.log('ImagePicker.showImagePicker - ', response);

      if (!response.didCancel && !response.error) {
        if (response.customButton === 'removePhoto') {
          this.setState({imageSource: null});
        } else {
          let imageSource = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};
          this.setState({
            imageSource: imageSource,
            imageData: response
          });
        }
      }
    });
  }

  /**
   *
   */
  sendServiceRequest() {
    if (this.state.service_code && this.state.description) {
      let params = {
        service_code: this.state.service_code,
        description: this.state.description,
        lat: _.get(this.props, 'position.coords.latitude', null),
        long: _.get(this.props, 'position.coords.longitude', null),
        address_string: this.state.address,
        email: this.state.email,
        first_name: this.state.firstName,
        last_name: this.state.lastName,
        phone: this.state.phone
      };

      if (_.get(this.state, 'imageData', null)) {
        params.media = this.state.imageData;
      }

      createServiceRequest(params)
        .then(result => {
          if (result.data) {
            this.props.navigator.pop();
          }
        })
        .catch(err => {
          console.log('createServiceRequest', err);
          alert(err);
        });
    } else {
      Alert.alert(
        translationsGeneral.errorTitle,
        translationsServiceRequest.formRequiredError,
      )
    }
  }

  /**
   *
   * @returns {XML}
   */
  renderAddImageButton() {
    let content = (
      <View style={[styles.button, styles.addImageButton]}>
        <Text
          style={[styles.buttonText, styles.addImageButtonText]}>{translationsServiceRequest.addImageButtonText}</Text>
      </View>
    );

    if (this.state.imageSource) {
      content = (
        <Image source={this.state.imageSource} style={styles.addImageButtonImage}/>
      )
    }

    return (
      <TouchableWithoutFeedback onPress={this.addImageButtonPress.bind(this)}>
        {content}
      </TouchableWithoutFeedback>
    )
  }

  renderServicesPicker() {
    if (!this.state.services) {
      return null;
    }

    let items = [];

    _.forEach(this.state.services, (service) => {
      items.push((
        <Picker.Item label={service.service_name} value={service.service_code} key={'service-'+service.service_code}/>
      ))
    });

    return (
      <Picker
        selectedValue={this.state.service_code}
        onValueChange={(service_code) => this.setState({service_code: service_code})}>
        {items}
      </Picker>
    );
  }

  /**
   * @returns {XML}
   */
  render() {
    return (
      <View style={styles.container}>
        <NavBar title={{title: translationsServiceRequest.serviceRequestFormTitle}}
                leftButton={{
                  source: require('../../images/arrow-right.png'),
                  handler: () => {this.props.navigator.pop();}
                }}
        />
        <View style={styles.divider}/>
        <ScrollView
          style={styles.scroller}
          rejectResponderTermination={false}
          keyboardShouldPersistTaps={true}
          automaticallyAdjustContentInsets={false}
        >
          <TouchableWithoutFeedback onPress={()=> dismissKeyboard()}>
            <View style={styles.form}>
              {this.renderAddImageButton()}
              {this.renderServicesPicker()}
              <View style={styles.inputWrapper}>
                <Text style={[styles.label]}>{translationsServiceRequest.description} <Text
                  style={styles.required}>*</Text></Text>
                <TextInput
                  onChangeText={(description) => this.setState({description})}
                  value={this.state.description}
                  style={[styles.input, styles.inputMultiline]}
                  multiline={true}
                />
              </View>
              <View style={styles.inputWrapper}>
                <Text style={[styles.label]}>{translationsServiceRequest.address}</Text>
                <TextInput
                  onChangeText={(address) => this.setState({address})}
                  value={this.state.address}
                  style={[styles.input]}
                />
              </View>
              <View style={styles.inputWrapper}>
                <Text style={[styles.label]}>{translationsServiceRequest.email}</Text>
                <TextInput
                  onChangeText={(email) => this.setState({email})}
                  value={this.state.email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={[styles.input]}
                />
              </View>
              <View style={styles.inputWrapper}>
                <Text style={[styles.label]}>{translationsServiceRequest.firstName}</Text>
                <TextInput
                  onChangeText={(firstName) => this.setState({firstName})}
                  value={this.state.firstName}
                  style={[styles.input]}
                />
              </View>
              <View style={styles.inputWrapper}>
                <Text style={[styles.label]}>{translationsServiceRequest.lastName}</Text>
                <TextInput
                  onChangeText={(lastName) => this.setState({lastName})}
                  value={this.state.lastName}
                  style={[styles.input]}
                />
              </View>
              <View style={styles.inputWrapper}>
                <Text style={[styles.label]}>{translationsServiceRequest.phone}</Text>
                <TextInput
                  onChangeText={(phone) => this.setState({phone})}
                  value={this.state.phone}
                  keyboardType="phone-pad"
                  style={[styles.input]}
                />
              </View>
              <TouchableWithoutFeedback onPress={this.sendServiceRequest.bind(this)}>
                <View style={[styles.button, styles.sendServiceRequestButton]}>
                  <Text
                    style={[styles.buttonText, styles.sendServiceRequestButtonText]}>{translationsServiceRequest.sendServiceRequestButtonText}</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </View>
    );
  }
}

export default ServiceRequestForm;
