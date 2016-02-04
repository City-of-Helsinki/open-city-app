import React from 'react-native';
import styles from './styles';

const {
  Image,
  TouchableOpacity,
  View,
  PropTypes,
  StyleSheet
  } = React;

var NavBarImageButton = React.createClass({
  propTypes: {
    style: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array
    ]),
    tintColor: PropTypes.string,
    handler: PropTypes.func
  },

  /**
   * Set property default values.
   * @returns {object}
   */
  getDefaultProps: function() {
    return {
      style: {},
      title: '',
      handler: function() {
        return {};
      }
    };
  },

  /**
   * Render method.
   * @returns {XML}
   */
  render: function() {
    return (
      <TouchableOpacity onPress={this.props.handler}>
        <View style={this.props.style}>

        </View>
      </TouchableOpacity>
    );
  }
});

module.exports = NavBarImageButton;