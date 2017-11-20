import { StyleSheet, Dimensions, Platform } from 'react-native';
import Global from '../../util/globals';

const SIDE_PADDING      = 64;
const CARET_ICON_HEIGHT = 12;
const CARET_ICON_WIDTH  = 12;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Dimensions.get('window').height / 2 - 50,
    left: SIDE_PADDING / 2,
    backgroundColor: Global.COLOR.LIGHT_GREY,
    width: Dimensions.get('window').width - SIDE_PADDING,
    borderRadius: 2,
    ...Platform.select({
      ios: {
        shadowColor: Global.COLOR.BLACK,
        shadowOffset: {width: 1, height: 2},
        shadowOpacity: 0.5,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      }
    }),
  },
  closeImageContainer: {
    padding: 16,
  },
  closeImage: {
    height: 16,
    width: 16,
  },
  enterContainer: {
    flex: 1,
    paddingLeft: 16,
    paddingBottom: 16,
    paddingRight: 48,
  },
  caretIcon: {
    position: 'absolute',
    right: 16,
    top: 16,
    height: CARET_ICON_HEIGHT,
    width: CARET_ICON_WIDTH
  },
  feedbackTextDescription: {
    flexWrap: 'wrap',
    flex: 1,
    color: Global.COLOR.BLACK,
    fontSize: 14,
    marginBottom: 8
  },
  feedbackTextAgency: {
    flexWrap: 'wrap',
    flex: 1,
    color: Global.COLOR.DARK_GREY,
    fontSize: 13,
    fontWeight: 'bold'
  },
});

export default styles
