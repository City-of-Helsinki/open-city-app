import { StyleSheet } from 'react-native';
import { TEXT_XSMALL_HEADLINE, TEXT_MEDIUM_HEADLINE } from './../../styles/text';
import { BLACK, WHITE, BRAND_LIGHT_TWO } from './../../styles/common';

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
  headlineText: {...TEXT_MEDIUM_HEADLINE, color: BLACK},
  cardOverlay: {
    backgroundColor: 'transparent',
    height: undefined,
    width: undefined,
    paddingBottom: 15,
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  cardText: { textShadowOffset: {width:1,height:1}, ...TEXT_XSMALL_HEADLINE, color: WHITE },
  cardImage: {
    height: 250
  }
});

export default styles
