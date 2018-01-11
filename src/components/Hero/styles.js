import { StyleSheet } from 'react-native';
import { TEXT_SMALL_HEADLINE, FONT_NORMAL, TEXT_LARGE_HEADLINE } from './../../styles/text';
import { BLACK, BRAND_LIGHT_ONE, BRAND_LIGHT_TWO, WHITE } from './../../styles/common';

const styles = StyleSheet.create({
  heroWrapper: {
    alignContent: 'flex-start',
    flexDirection: 'column',
  },
  heroImage: {
    width: undefined,
    height: 250,
  },
  heroDecoration: {
    width: '100%',
    height: 30,
    backgroundColor: BRAND_LIGHT_TWO,
  },
  heroOverlay: {
    backgroundColor: BRAND_LIGHT_ONE,
    paddingTop: 30,
    paddingRight: 20,
    paddingLeft: 20,
    paddingBottom: 10,
  },
  heroHeadline: { ...TEXT_LARGE_HEADLINE, color: BLACK },
  heroPlace: { ...TEXT_SMALL_HEADLINE, color: BLACK },
  heroDate: { ...TEXT_SMALL_HEADLINE, color: BLACK },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default styles
