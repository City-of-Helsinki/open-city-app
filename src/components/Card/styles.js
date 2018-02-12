import { StyleSheet } from 'react-native';
import { TEXT_XSMALL_HEADLINE, FONT_NORMAL, TEXT_LARGE_HEADLINE } from './../../styles/text';
import { BLACK } from '../../styles/common';

const styles = StyleSheet.create({
  cardWrapper: {
    width: 150,
    backgroundColor: '#FFF',
    marginHorizontal: 10
  },
  cardImage: {
    width: undefined,
    height: 220,
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  cardOverlay: {
    backgroundColor: '#FFF',
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 80,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardHeadline: { textAlign: 'center', ...TEXT_XSMALL_HEADLINE, color: BLACK }
});

export default styles
