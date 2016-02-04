import React, {
  Component,
  StatusBarIOS,
  Text,
  View,
  PropTypes,
} from 'react-native';

import styles from './styles';

const ButtonShape = {
  title: PropTypes.string.isRequired,
  style: PropTypes.object,
  handler: PropTypes.func
};

const TitleShape = {
  title: PropTypes.string.isRequired,
  tintColor: PropTypes.string
};

const StatusBarShape = {
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

class NavBar extends Component {
  componentDidMount() {
    customizeStatusBar(this.props.statusBar);
  }

  componentWillReceiveProps(props) {
    customizeStatusBar(this.props.statusBar);
  }

  static getButtonElement(data = {}, style) {
    if (React.isValidElement(data)) {
      return <View style={styles.navBarButton}>{data}</View>;
    }

    let NavBarButton = require('./NavBarButton');

    return <NavBarButton
      title={data.title}
      style={[data.style, style ]}
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
          {NavBar.getButtonElement(this.props.leftButton, {marginLeft: 8})}
          {NavBar.getButtonElement(this.props.rightButton, {marginRight: 8})}
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
    style: 'default',
    hidden: false,
    hideAnimation: 'slide',
    showAnimation: 'slide'
  },
  title: {
    title: ''
  }
};

export default NavBar;