import { StyleSheet, Platform } from 'react-native';
import Global from '../../util/globals';

const styles = StyleSheet.create({
  attachmentContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopColor: Global.COLOR.GREY,
  },
  attachmentButton: {
    flex: 1,
    height: 46,
    backgroundColor: Global.COLOR.BLUE,
    alignItems: 'center',
    justifyContent: 'center',
    // Shadow
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
  attachmentButtonText: {
    color: Global.COLOR.WHITE,
    fontSize: 16,
    fontWeight: 'bold'
  },
  thubmnailView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default styles
