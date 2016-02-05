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
    marginBottom: 10,
    lineHeight: 22
  },
  address: {
    color: COLOR_LIGHT_GRAY,
    fontSize: 18,
    marginBottom: 10,
    fontWeight: '300'
  },
  distance: {
    flexDirection: 'row'
  },
  distanceText: {
    color: COLOR_LIGHTER_GRAY,
    fontSize: 14,
    flex: 1,
    paddingLeft: 3,
    fontWeight: '300'
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
    alignItems: 'center',
    height: 200
  },
  mapLoader: {
    flex: 1,
    width: 20
  },
  top: {
    paddingLeft: 17,
    paddingRight: 17,
    paddingTop: 21,
    paddingBottom: 10
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
    paddingLeft: 3,
    fontWeight: '300'
  },
  distanceIcon: {
    paddingLeft: 2,
    paddingRight: 3,
    paddingTop: 2
  },
  content: {
    paddingLeft: 17,
    paddingRight: 17,
    paddingTop: 15,
    paddingBottom: 15
  },
  summary: {
    color: COLOR_GRAY,
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '300'
  }
});

export const agendaItemStyles = StyleSheet.create({
  container: {
    backgroundColor: COLOR_WHITE,
    flex: 1
  }
});
