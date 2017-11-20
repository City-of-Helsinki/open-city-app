import { StyleSheet, Platform, Dimensions } from 'react-native';
import Global from '../../util/globals';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: Global.COLOR.LIGHT_GREY,
    paddingTop: Platform.OS === 'ios' ? 15 : 0,
  },
  closeIconView: {
    height: 55,
    width: 56,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 16,
    paddingRight: 16,
  },
  closeIcon: {
    height: 16,
    width: 16,
  },
  innerContainer: {
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'space-between',
  },
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'stretch',
    flex: 1,
  },
  buttonView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 16,
    paddingRight: 16,
  },
  menuText: {
    fontSize: 16,
    color: '#212121',
    flexWrap: 'wrap',
    flex: 1
  },
  icon: {
    height: 30,
    width: 30,
    marginRight: 5,
  },
  versionTextView: {
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
    padding: 8,
    flex: 1,
  },
  versionText: {
    fontSize: 14,
    color: Global.COLOR.WARM_GREY,
    textAlign: 'right'
  },
  appFeedbackContainer: {
    flexDirection: 'row',
  },
  appFeedbackInnerContainer: {
    flex:1,
    height: 200,
    flexDirection: 'row',
  },
  appFeedbackContentContainer: {
    padding: 10,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  },
  appFeedbackImage: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    height: 200,
    width: Dimensions.get('window').width - (Dimensions.get('window').width * Global.OPEN_DRAWER_OFFSET),
  },
  appFeedbackText: {
    color: Global.COLOR.WHITE,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: Global.COLOR.TRANSPARENT,
  },
  appPrivacyPolicy: {
    color: Global.COLOR.WHITE,
    fontWeight: 'normal',
    textAlign: 'left',
    marginTop: 10,
    fontSize: 16,
    textDecorationLine: 'underline',
    backgroundColor: Global.COLOR.TRANSPARENT,
  },
  appFeedbackButton: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 5,
    paddingTop: 5,
    borderRadius: 2,
    backgroundColor: Global.COLOR.WHITE
  },
  appFeedbackButtonText: {
    color: Global.COLOR.BLUE,
    flexWrap: 'wrap',
    fontSize: 18,
    fontWeight: 'bold'
  },
});

export default styles
