import React, {
  Component,
  Text,
  Image,
  TouchableOpacity,
  View,
  PropTypes,
} from 'react-native';

import {navBarButtonStyles as styles} from './styles';

class NavBarButton extends Component {
  /**
   * Render method for text.
   * @returns {XML}
   */
  renderText() {
    if (!this.props.title) {
      return null;
    }

    return (
      <Text style={[styles.navBarButtonText, { color: this.props.tintColor }]}>
        {this.props.title}
      </Text>
    )
  }

  /**
   * Render method for image.
   * @returns {*}
   */
  renderImage() {
    if (!this.props.source) {
      return null;
    }

    return (<Image source={this.props.source} style={styles.navBarButtonImage}/>)
  }

  /**
   * Render method.
   * @returns {XML}
   */
  render() {
    return (
      <TouchableOpacity onPress={this.props.handler} style={[styles.navBarButton, this.props.style]}>
        {this.renderText()}
        {this.renderImage()}
      </TouchableOpacity>
    );
  }
}

NavBarButton.propTypes = {
  style: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
  ]),
  tintColor: PropTypes.string,
  title: PropTypes.string,
  source: PropTypes.number,
  handler: PropTypes.func
};

NavBarButton.defaultProps = {
  style: {},
  title: '',
  image: null,
  handler: () => {
    return {};
  }
};

module.exports = NavBarButton;