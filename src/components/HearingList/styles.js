import { StyleSheet } from 'react-native';
import { TEXT_MEDIUM_HEADLINE } from './../../styles/text';
import { BLACK, BRAND_LIGHT_TWO } from './../../styles/common';

const styles = StyleSheet.create({
  hearingWrapper: {
    flex: 1,
    backgroundColor: BRAND_LIGHT_TWO,
    paddingTop: 50,
    paddingBottom: 50
  },
  headline: {
    paddingVertical: 15,
    alignItems: 'center'
  },
  headlineText: { ...TEXT_MEDIUM_HEADLINE, color: BLACK }
});

export default styles
