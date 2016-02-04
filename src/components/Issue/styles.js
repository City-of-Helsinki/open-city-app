import {StyleSheet, PixelRatio} from 'react-native';
import {COLOR_GRAY} from '../../constants/color';

const pixelRatio = PixelRatio.get();

export const listStyles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1
  },
  separator: {
    backgroundColor: '#DFDEDE',
    height: 1
  },
  list: {
    borderBottomColor: COLOR_GRAY,
    borderBottomWidth: 1 / pixelRatio,
    borderRightColor: COLOR_GRAY,
    borderRightWidth: 1 / pixelRatio,
    borderTopColor: COLOR_GRAY,
    borderTopWidth: 1 / pixelRatio
  }
});

export const rowStyles = StyleSheet.create({
  container: {
    borderLeftColor: '#39A795',
    borderLeftWidth: 4,
    borderBottomColor: COLOR_GRAY,
    borderBottomWidth: 1 / pixelRatio,
    padding: 20
  },
  subject: {
    color: '#4E4D4D',
    fontSize: 18,
    marginBottom: 10
  },
  address: {
    color: '#A7A7A7',
    fontSize: 18,
    marginBottom: 10
  },
  distance: {
    color: '#D7D7D7',
    fontSize: 14
  }
});

export const detailStyles = StyleSheet.create({
  container: {
    borderTopColor: '#39A795',
    borderTopWidth: 4
  },
  map: {
    height: 200
  },
  top: {
    padding: 15
  },
  subject: {
    color: '##4E4D4D',
    fontSize: 18,
    marginBottom: 10
  },
  distance: {
    color: '#D7D7D7',
    fontSize: 14
  },
  content: {
    padding: 15
  },
  summary: {
    color: '#A7A7A7',
    fontSize: 18
  }
});
