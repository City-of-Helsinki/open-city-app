import React from 'react-native';

const NAV_BAR_HEIGHT = 39;
const STATUS_BAR_HEIGHT = 20;

const {
  StyleSheet
  } = React;

module.exports = StyleSheet.create({
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
  navBarButton: {
    marginTop: 12
  },
  navBarButtonText: {
    fontSize: 17,
    letterSpacing: 0.5,
    marginTop: 12
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