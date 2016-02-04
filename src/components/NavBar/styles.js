import React, {
  StyleSheet
} from 'react-native';

import { COLOR_BLUE } from '../../constants/color';

const NAV_BAR_HEIGHT = 39;
const STATUS_BAR_HEIGHT = 20;

export const navBarStyles = StyleSheet.create({
  navBarContainer: {
    backgroundColor: '#ffffff',
    paddingBottom: 29,
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
    fontSize: 16,
    letterSpacing: 0.5,
    color: COLOR_BLUE,
    fontWeight: '300',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 7,
    textAlign: 'center'
  }
});

export const navBarButtonStyles = StyleSheet.create({
  navBarButton: {
    marginTop: 12
  },
  navBarButtonLeft: {
    marginLeft: 8
  },
  navBarButtonRight: {
    marginRight: 8
  },
  navBarButtonText: {
    fontSize: 17,
    letterSpacing: 0.5,
    marginTop: 12
  },
  navBarButtonImage: {
  }
});