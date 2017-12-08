import { StyleSheet } from 'react-native';
import { TEXT_SMALL_HEADLINE, FONT_NORMAL, TEXT_LARGE_HEADLINE } from './../../styles/text';
import { BRAND_LIGHT_ONE } from './../../styles/common';

const styles = StyleSheet.create({
  heroWrapper: {
    backgroundColor: BRAND_LIGHT_ONE,
    alignContent: 'flex-start',
    flexDirection: 'column',
  },
  heroImage: {
    width: undefined,
    height: 250,
  },
  heroOverlay: {
    backgroundColor: BRAND_LIGHT_ONE,
    padding: 20,
  },
  heroHeadline: TEXT_LARGE_HEADLINE,
  heroPlace: TEXT_SMALL_HEADLINE,
  heroDate: FONT_NORMAL
});

export default styles
