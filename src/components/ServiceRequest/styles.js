import { StyleSheet, PixelRatio } from 'react-native';

import {
  COLOR_WHITE,
  COLOR_LIGHTER_GRAY
} from '../../constants/color';

const pixelRatio = PixelRatio.get();

export const mapStyles = StyleSheet.create({
  container: {
    backgroundColor: COLOR_WHITE,
    flex: 1
  },
  map: {
    alignItems: 'center',
    flex: 1
  },
  mapContainer: {
    flex: 1,
    borderTopColor: COLOR_LIGHTER_GRAY,
    borderTopWidth: 1 / pixelRatio
  }
});

export const formStyles = StyleSheet.create({
  container: {
    backgroundColor: COLOR_WHITE,
    flex: 1
  }
});