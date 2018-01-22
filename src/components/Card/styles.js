import { StyleSheet } from 'react-native';
import { TEXT_SMALL_HEADLINE, FONT_NORMAL, TEXT_LARGE_HEADLINE } from './../../styles/text';

const styles = StyleSheet.create({
  cardWrapper: {
    width: 200,
    backgroundColor: '#FFF',
  },
  cardImage: {
    width: undefined,
    minHeight: 160,
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  cardOverlay: {
    minHeight: 100,
    width: '100%',
    padding: 10,
  },
  cardHeadline: TEXT_SMALL_HEADLINE
});

export default styles
