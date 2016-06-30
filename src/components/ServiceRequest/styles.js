import { StyleSheet, PixelRatio } from 'react-native';

import {
  COLOR_WHITE,
  COLOR_LIGHTER_GRAY,
  COLOR_BLUE
} from '../../constants/color';

const pixelRatio = PixelRatio.get();

export const mapStyles = StyleSheet.create({
  container: {
    backgroundColor: COLOR_WHITE,
    flex: 1
  },
  divider: {
    backgroundColor: COLOR_BLUE,
    height: 4
  },
  map: {
    alignItems: 'center',
    flex: 1
  },
  mapContainer: {
    flex: 1,
    borderTopColor: COLOR_LIGHTER_GRAY,
    borderTopWidth: 1 / pixelRatio,
  },
  mapLoader: {
    flex: 1,
    width: 20
  }
});

export const formStyles = StyleSheet.create({
  container: {
    backgroundColor: COLOR_WHITE,
    flex: 1,
    flexDirection: 'column'
  },
  divider: {
    backgroundColor: COLOR_BLUE,
    height: 4
  },
  scroller: {
  },
  form: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10
  },
  button: {
    backgroundColor: COLOR_BLUE,
    paddingTop: 15,
    paddingBottom: 15
  },
  buttonText: {
    color: COLOR_WHITE,
    textAlign: 'center'
  },
  addImageButton: {
    marginBottom: 20
  },
  addImageButtonText: {

  },
  addImageButtonImage: {
    height: 200,
    marginBottom: 20,
    marginLeft: -10,
    marginRight: -10,
    marginTop: -10,
    resizeMode: 'cover'
  },
  sendServiceRequestButton: {
    marginTop: 10,
    marginBottom: 10
  },
  sendServiceRequestButtonText: {

  },
  inputWrapper: {
    marginBottom: 10
  },
  input: {
    height: 40,
    borderColor: COLOR_LIGHTER_GRAY,
    borderWidth: 1,
    paddingLeft: 5,
    paddingRight: 5
  },
  label: {
    marginBottom: 5
  },
  inputMultiline: {
    height: 100
  },
  required: {
    color: 'red'
  }
});
