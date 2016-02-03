import React from 'react-native';

const {
  Image,
  TouchableOpacity,
  View,
  PropTypes,
  StyleSheet
  } = React;

const styles = StyleSheet.create({
  navBarButton: {
    marginTop: 12
  },
  navBarButtonImage: {
  }
});

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
          <Image source={this.props.source} style={styles.navBarButtonImage} />
        </View>
      </TouchableOpacity>
    );
  }
});

module.exports = NavBarImageButton;