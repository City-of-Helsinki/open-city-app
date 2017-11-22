import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  Platform,
  Picker,
} from 'react-native';

import ModalSelector  from 'react-native-modal-selector';
import transGeneral   from '../../translations/general';
import styles         from './styles';

// Returns a native picker for Android or native popup with selection for iOS
class NativePicker extends Component {

  constructor(props, context) {
    super(props);

    transGeneral.setLanguage('fi');
  }

  itemChange(item) {
    this.props.itemChange(item);
  }

  render() {
    var picker = <ModalSelector
                  style={styles.modalPicker}
                  data={this.props.data}
                  initValue={this.props.selectedItem}
                  cancelText={transGeneral.cancel}
                  onChange={(item)=>this.itemChange(item)} />;

    if (Platform.OS === 'android') {
      picker = <Picker
                selectedValue={this.props.selectedItem}
                onValueChange={(item)=>this.itemChange(item)}>
                {this.props.data.map((item) => (
                  <Picker.Item label={item.label} value={item.key} key={item.key} />
                ))}
              </Picker>;
    }

    return (
      <View style={[styles.container, this.props.style]}>
        {picker}
      </View>
    );
  }
}

module.exports = NativePicker
