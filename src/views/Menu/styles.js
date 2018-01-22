import { StyleSheet, Platform, Dimensions } from 'react-native';
import Global from '../../util/globals';
import { TEXT_MEDIUM_HEADLINE, FONT_NORMAL, TEXT_LARGE_HEADLINE, FONT_BOLD } from './../../styles/text';
import { BLACK, BRAND_LIGHT_ONE, WHITE } from './../../styles/common';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: Global.COLOR.LIGHT_GREY,
    paddingTop: 15
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
  infoText: { ...FONT_NORMAL, color: BLACK },
  icon: {
    height: 30,
    width: 30,
    marginRight: 5,
  },
  textBlock: {
    padding: 10
  },
  appFeedbackContentContainer: {
    padding: 10,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    flexDirection: 'column'
  },
  appFeedbackImage: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    height: 200,
    width: Dimensions.get('window').width,
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
    marginTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 5,
    paddingTop: 5,
    borderRadius: 2,
    backgroundColor: Global.COLOR.BLUE,
    alignItems: 'center'
  },
  appFeedbackButtonText: {
    color: Global.COLOR.WHITE,
    flexWrap: 'wrap',
    fontSize: 18,
    fontWeight: 'bold'
  },
});

export default styles
