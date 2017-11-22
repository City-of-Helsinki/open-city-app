import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  TextInput,
  Animated
} from 'react-native';

import NativePicker            from '../../components/NativePicker';
import transSendServiceRequest from '../../translations/sendServiceRequest';
import styles                  from './styles';

class SendServiceRequestForm extends Component {

  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <Animated.View style={[styles.container, this.props.hideAnimation]}>
        <View style={styles.enableLocationView}>
          <Text style={styles.helpText}>{transSendServiceRequest.geoTagTitle}</Text>
          <View style={styles.checkboxContainer}>
            <Text style={[styles.checkboxLabel, styles.textFont]}>{transSendServiceRequest.geoTagLabel}</Text>
            <View style={styles.checkboxViewContainer}>
              <TouchableWithoutFeedback onPress={this.props.onCheckboxClick.bind(this)}>
                <View style={styles.checkboxView}>
                  {this.props.checkboxImage}
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </View>
        <View style={styles.categoryView}>
          <Text style={[styles.helpText, styles.categoryText]}>{transSendServiceRequest.category}</Text>
          <NativePicker
            style={styles.picker}
            data={this.props.pickerData}
            defaultItem={this.props.selectedCategory}
            selectedItem={this.props.selectedCategory}
            itemChange={(item)=> this.props.onPickerItemChange(item)} />
        </View>
        <View style={styles.titleView}>
          <TextInput
            style={styles.titleText}
            defaultValue={this.props.defaultTitle}
            onChangeText={(text)=> this.props.onTitleChange(text)}
            placeholder={transSendServiceRequest.inputTitlePlaceholder}
            autoCapitalize={'sentences'} />
        </View>
        <View style={styles.descriptionView}>
          <TextInput
            style={[styles.descriptionText, {height: Math.max(135, this.props.descriptionHeight)}]}
            multiline={true}
            defaultValue={this.props.defaultDescription}
            onChange={(event)=>this.props.onDescriptionChange(event)}
            placeholder={transSendServiceRequest.inputDescriptionPlaceholder}
            autoCapitalize={'sentences'} />
        </View>
      </Animated.View>
    );
  }
}

module.exports = SendServiceRequestForm
