import { StyleSheet } from 'react-native';
import { TEXT_SMALL_HEADLINE, FONT_NORMAL, TEXT_LARGE_HEADLINE } from './../../styles/text';

const styles = StyleSheet.create({
  hearingWrapper: {
    width: 240,
    backgroundColor: '#FFF',
  },
  hearingImage: {
    width: undefined,
    minHeight: 240,
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  hearingOverlay: {
    minHeight: 100,
    width: '100%',
    padding: 10,
  },
  hearingHeadline: TEXT_SMALL_HEADLINE
});

export default styles
