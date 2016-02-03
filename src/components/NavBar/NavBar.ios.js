import React from 'react-native';

const NAV_BAR_HEIGHT = 39;
const STATUS_BAR_HEIGHT = 20;

var {
  StatusBarIOS,
  Text,
  View,
  PropTypes,
  StyleSheet
  } = React;

const styles = StyleSheet.create({
  navBarContainer: {
    backgroundColor: '#ffffff',
    paddingBottom: 5
  },
  statusBar: {
    height: STATUS_BAR_HEIGHT
  },
  navBar: {
    height: NAV_BAR_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  customTitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 7,
    alignItems: 'center'
  },
  navBarTitleText: {
    fontSize: 17,
    letterSpacing: 0.5,
    color: '#333333',
    fontWeight: '500',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 7,
    textAlign: 'center'
  }
});

var ButtonShape = {
  title: PropTypes.string.isRequired,
  style: PropTypes.object,
  handler: PropTypes.func
};

var TitleShape = {
  title: PropTypes.string.isRequired,
  tintColor: PropTypes.string
};

var StatusBarShape = {
  style: PropTypes.oneOf(['light-content', 'default']),
  hidden: PropTypes.bool,
  tintColor: PropTypes.string,
  hideAnimation: PropTypes.oneOf(['fade', 'slide', 'none']),
  showAnimation: PropTypes.oneOf(['fade', 'slide', 'none'])
};

function customizeStatusBar(data) {
  if (data.style) {
    StatusBarIOS.setStyle(data.style, true);
  }
  const animation = data.hidden ?
    (data.hideAnimation || NavBar.defaultProps.statusBar.hideAnimation) :
    (data.showAnimation || NavBar.defaultProps.statusBar.showAnimation);

  StatusBarIOS.setHidden(data.hidden, animation);
}

var NavBar = React.createClass({
  propTypes: {
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
  },

  /**
   * Set property default values.
   * @returns {object}
   */
  getDefaultProps: function() {
    return {
      statusBar: {
        style: 'default',
        hidden: false,
        hideAnimation: 'slide',
        showAnimation: 'slide'
      },
      title: {
        title: ''
      }
    };
  },

  componentDidMount: function() {
    customizeStatusBar(this.props.statusBar);
  },

  componentWillReceiveProps: function(props) {
    customizeStatusBar(this.props.statusBar);
  },

  getButtonElement: function(data = {}, style) {
    if (React.isValidElement(data)) {
      return <View style={styles.navBarButton}>{data}</View>;
    }

    let NavBarButton = require('./NavBarButton');

    return <NavBarButton
      title={data.title}
      style={[data.style, style ]}
      tintColor={data.tintColor}
      handler={data.handler}/>;
  },

  getTitleElement: function(data) {
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
  },

  render: function() {
    var customTintColor = this.props.tintColor ?
    {backgroundColor: this.props.tintColor} : null;

    var statusBar = !this.props.statusBar.hidden ?
      <View style={[styles.statusBar ]}/> : null;

    return (
      <View style={[styles.navBarContainer, this.props.containerStyle, customTintColor ]}>
        {statusBar}
        <View style={[styles.navBar, this.props.style ]}>
          {this.getTitleElement(this.props.title)}
          {this.getButtonElement(this.props.leftButton, {marginLeft: 8})}
          {this.getButtonElement(this.props.rightButton, {marginRight: 8})}
        </View>
      </View>
    );
  }
});

module.exports = NavBar;