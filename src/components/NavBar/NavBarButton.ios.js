import React from 'react-native';

const {
  Text,
  TouchableOpacity,
  View,
  PropTypes,
  StyleSheet
  } = React;

const styles = StyleSheet.create({
  navBarButton: {
    marginTop: 12
  },
  navBarButtonText: {
    fontSize: 17,
    letterSpacing: 0.5,
    marginTop: 12
  }
});

var NavBarButton = React.createClass({
  propTypes: {
    style: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array
    ]),
    tintColor: PropTypes.string,
    title: PropTypes.string,
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
          <Text style={[styles.navBarButtonText, { color: this.props.tintColor }]}>
            {this.props.title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
});

module.exports = NavBarButton;