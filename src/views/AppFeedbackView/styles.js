import { StyleSheet, Dimensions, Platform } from 'react-native';
import Global                     from '../../util/globals';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Global.COLOR.LIGHT_GREY
  },
  innerContainer: {
    flexDirection: 'column',
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    flex: 1,
  },
  helpText: {
    color: Global.COLOR.STEEL_GREY,
    fontSize: 12,
    fontWeight: 'bold'
  },
  titleView: {
    alignSelf: 'center',
    width: Dimensions.get('window').width - 32
  },
  titleText: {
    backgroundColor: Global.COLOR.WARM_GREY_10,
    height: 40,
    padding: 8,
  },
  descriptionView: {
    flex: 1,
    marginTop: 8,
  },
  descriptionText: {
    height: 400,
    alignSelf: 'stretch',
    backgroundColor: Global.COLOR.WARM_GREY_10,
    color: Global.COLOR.BLACK,
    textAlignVertical: 'top',
    padding: 8,
  },
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
