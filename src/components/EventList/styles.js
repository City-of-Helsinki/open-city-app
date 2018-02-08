import { StyleSheet } from 'react-native';
import { TEXT_MEDIUM_HEADLINE } from './../../styles/text';
import { BLACK, BRAND_LIGHT_TWO } from './../../styles/common';

const styles = StyleSheet.create({
  eventWrapper: {
    flex: 1,
    backgroundColor: BRAND_LIGHT_TWO,
    paddingTop: 50,
    paddingBottom: 50
  },
  list: {
    alignItems: 'stretch'
  },
  listItemMargin: {
    marginHorizontal: 10
  },
  headline: {
    paddingVertical: 15,
    alignItems: 'center'
  },
  headlineText: {...TEXT_MEDIUM_HEADLINE, color: BLACK}
});

export default styles
