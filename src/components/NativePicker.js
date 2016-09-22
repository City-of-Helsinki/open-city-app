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
    this.state = {
      data: [this.props.defaultItem],
      selectedItem: this.props.defaultItem,
    };

    transGeneral.setLanguage('fi');
  }

  componentWillMount() {

    // This is required for ModalPicker which handles data differently
    if (Platform.OS !== 'android') {
      var arr = [];
      for (var i=0; i < this.props.data.length; i++) {
        arr.push({key: this.props.data[i], label: this.props.data[i]});
      }
      this.setState({
        data: arr,
      });
    } else {
      this.setState({
        data: this.props.data,
      });
    }
  }

  itemChange(item) {
    this.setState({
      selectedItem: item,
    });
    this.props.itemChange(item);
  }

  render() {
    var picker = <ModalPicker
                  data={this.state.data}
                  initValue={this.state.selectedItem}
                  cancelText={transGeneral.cancel}
                  onChange={(item)=>this.itemChange(item)} />;

    if (Platform.OS === 'android') {
      picker = <Picker
                selectedValue={this.state.selectedItem}
                onValueChange={(item)=>this.itemChange(item)}>
                {this.state.data.map((item) => (
                  <Picker.Item label={item} value={item} key={item} />
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
  },
});

module.exports = NativePicker
