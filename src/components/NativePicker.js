import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Platform,
  Picker,
} from 'react-native';

import ModalPicker  from 'react-native-modal-picker';
import transGeneral from '../translations/errors';

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
    var picker = <ModalPicker
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
      <View style={styles.container}>
        {picker}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent:'space-around',
    paddingRight:10,
    paddingTop:10,
    padding:5,
  },
  modalPicker:{
    borderWidth:0,
  }
});

module.exports = NativePicker
