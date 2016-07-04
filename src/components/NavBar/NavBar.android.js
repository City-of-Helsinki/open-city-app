import React, { Component, PropTypes } from 'react';

import {
  Text,
  View,
} from 'react-native';

import {navBarStyles as styles} from './styles';
import {navBarButtonStyles} from './styles';

const ButtonShape = {
  title: PropTypes.string,
  source: PropTypes.number,
  style: PropTypes.object,
  handler: PropTypes.func
};

const TitleShape = {
  title: PropTypes.string.isRequired,
  tintColor: PropTypes.string
};

const StatusBarShape = {
  hidden: PropTypes.bool
};

class NavBar extends Component {
  static getButtonElement(data = {}, type) {
    if (React.isValidElement(data)) {
      return <View style={navBarButtonStyles.navBarButton}>{data}</View>;
    }

    let NavBarButton = require('./NavBarButton');

    return <NavBarButton
      title={data.title}
      source={data.source}
      style={[data.style, type === 'left' ? navBarButtonStyles.navBarButtonLeft : navBarButtonStyles.navBarButtonRight]}
      tintColor={data.tintColor}
      handler={data.handler}/>;
  }

  static getTitleElement(data) {
    if (React.isValidElement(data)) {
      return <View style={styles.customTitle}>{data}</View>;
    }

    const colorStyle = data.tintColor ? {color: data.tintColor} : null;

    return (
      <Text
        style={[styles.navBarTitleText, colorStyle ]}>
        {data.title}
      </Text>
    );
  }

  render() {
    var customTintColor = this.props.tintColor ?
    {backgroundColor: this.props.tintColor} : null;

    var statusBar = !this.props.statusBar.hidden ?
      <View style={[styles.statusBar ]}/> : null;

    return (
      <View style={[styles.navBarContainer, this.props.containerStyle, customTintColor ]}>
        {statusBar}
        <View style={[styles.navBar, this.props.style ]}>
          {NavBar.getTitleElement(this.props.title)}
          {NavBar.getButtonElement(this.props.leftButton, 'left')}
          {NavBar.getButtonElement(this.props.rightButton, 'right')}
        </View>
      </View>
    );
  }
}

NavBar.propTypes = {
  style: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
  ]),
    containerStyle: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
  ]),
    tintColor: PropTypes.string,
    statusBar: PropTypes.shape(StatusBarShape),
    leftButton: PropTypes.oneOfType([
    PropTypes.shape(ButtonShape),
    PropTypes.element
  ]),
    rightButton: PropTypes.oneOfType([
    PropTypes.shape(ButtonShape),
    PropTypes.element
  ]),
    title: PropTypes.oneOfType([
    PropTypes.shape(TitleShape),
    PropTypes.element
  ])
};

NavBar.defaultProps = {
  statusBar: {
    hidden: false
  },
  title: {
    title: ''
  }
};

export default NavBar;
