import {StyleSheet, PixelRatio} from 'react-native';
import {
  COLOR_WHITE,
  COLOR_DARK_GRAY,
  COLOR_GRAY,
  COLOR_LIGHT_GRAY,
  COLOR_LIGHTER_GRAY
} from '../../constants/color';

const pixelRatio = PixelRatio.get();

export const listStyles = StyleSheet.create({
  container: {
    backgroundColor: COLOR_WHITE,
    flex: 1
  },
  separator: {
    borderBottomColor: COLOR_LIGHTER_GRAY,
    borderBottomWidth: 1 / pixelRatio,
    height: 0
  },
  list: {
    borderBottomColor: COLOR_LIGHTER_GRAY,
    borderBottomWidth: 1 / pixelRatio,
    borderRightColor: COLOR_LIGHTER_GRAY,
    borderRightWidth: 1 / pixelRatio,
    borderTopColor: COLOR_LIGHTER_GRAY,
    borderTopWidth: 1 / pixelRatio
  }
});

export const rowStyles = StyleSheet.create({
  container: {
    backgroundColor: COLOR_WHITE,
    borderLeftColor: COLOR_LIGHTER_GRAY,
    borderLeftWidth: 4,
    padding: 20
  },
  subject: {
    color: COLOR_DARK_GRAY,
    fontSize: 18,
    marginBottom: 10
  },
  address: {
    color: COLOR_LIGHT_GRAY,
    fontSize: 18,
    marginBottom: 10
  },
  distance: {
    flexDirection: 'row'
  },
  distanceText: {
    color: COLOR_LIGHTER_GRAY,
    fontSize: 14,
    flex: 1,
    paddingLeft: 3
  },
  distanceIcon: {
    paddingLeft: 2,
    paddingRight: 3,
    paddingTop: 2
  }
});

export const detailStyles = StyleSheet.create({
  container: {
    backgroundColor: COLOR_WHITE,
    flex: 1
  },
  divider: {
    backgroundColor: COLOR_LIGHTER_GRAY,
    height: 4
  },
  scroller: {
  },
  map: {
    height: 200
  },
  mapLoader: {
    flex: 1
  },
  top: {
    padding: 15
  },
  subject: {
    color: COLOR_DARK_GRAY,
    fontSize: 18,
    marginBottom: 10
  },
  distance: {
    flexDirection: 'row'
  },
  distanceText: {
    color: COLOR_LIGHTER_GRAY,
    fontSize: 14,
    flex: 1,
    paddingLeft: 3
  },
  distanceIcon: {
    paddingLeft: 2,
    paddingRight: 3,
    paddingTop: 2
  },
  content: {
    padding: 15
  },
  summary: {
    color: COLOR_GRAY,
    fontSize: 18
  }
});
