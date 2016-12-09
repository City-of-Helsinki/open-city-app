import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Dimensions,
  TouchableWithoutFeedback,
  TextInput,
  Animated
} from 'react-native';

import Global                  from '../util/globals';
import NativePicker            from '../components/NativePicker';
import transSendServiceRequest from '../translations/sendServiceRequest';

class SendServiceRequestForm extends Component {

  constructor(props, context) {
    super(props, context);
  }

  render() {
    console.log('prop title', this.props.selectedCategory)
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
            placeholder={transSendServiceRequest.inputTitlePlaceholder} />
        </View>
        <View style={styles.descriptionView}>
          <TextInput
            style={[styles.descriptionText, {height: Math.max(135, this.props.descriptionHeight)}]}
            multiline={true}
            defaultValue={this.props.defaultDescription}
            onChange={(event)=>this.props.onDescriptionChange(event)}
            placeholder={transSendServiceRequest.inputDescriptionPlaceholder} />
        </View>
      </Animated.View>
    );
  }
}

module.exports = SendServiceRequestForm

const styles = StyleSheet.create({
  container: {
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
});