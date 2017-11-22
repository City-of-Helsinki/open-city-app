import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Platform,
  TouchableWithoutFeedback,
  Linking,
  Dimensions
} from 'react-native';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AuthActions from '../redux/auth/actions';

import Global from './../util/globals';
import Config from './../config.json';
import userManager from './../util/userManager';
// Images
import feedbackIcon     from '../img/feedback.png';
import listIcon         from '../img/list.png';
import closeIcon        from '../img/close.png';
import appFeedbackImage from '../img/feedback.png';

import transMenu from '../translations/menu';

class Menu extends Component {

  constructor(props, context) {
    super(props);

    transMenu.setLanguage('fi');
  }

  login = () => {
    userManager.signinPopup()
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={this.props.onMenuClick}>
          <View style={styles.closeIconView}>
            <Image
              source={closeIcon}
              style={[styles.icon, styles.closeIcon]}/>
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.innerContainer}>
          <View style={styles.buttonContainer}>
            <TouchableWithoutFeedback onPress={this.props.mapView}>
              <View style={[styles.buttonView, styles.buttonDividerGray]}>
                <Text style={styles.menuText}>{transMenu.menuTitleFeedback}</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={this.login}>
              <View style={[styles.buttonView, styles.buttonDividerGray]}>
                <Text style={styles.menuText}>Login</Text>
              </View>
            </TouchableWithoutFeedback>
            <View style={styles.versionTextView}>
              <Text style={styles.versionText}>{Config.APP_VERSION}</Text>
            </View>
          </View>

          <View style={styles.appFeedbackContainer}>
            <View style={styles.appFeedbackInnerContainer}>
              <Image style={styles.appFeedbackImage} source={appFeedbackImage} />
              <View style={styles.appFeedbackContentContainer}>
                <Text style={styles.appFeedbackText}>{transMenu.menuAppFeedbackDescription}</Text>
                <TouchableWithoutFeedback onPress={this.props.onAppFeedbackClick}>
                  <View style={styles.appFeedbackButton}>
                    <Text style={styles.appFeedbackButtonText}>{transMenu.menuAppFeedbackButton}</Text>
                  </View>
                </TouchableWithoutFeedback>
                  <Text style={styles.appPrivacyPolicy}
                        onPress={() => Linking.openURL(Config.PRIVACY_POLICY_URL)}>
                      {transMenu.menuPrivacyPolicy}
                  </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

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

function mapStateToProps(state) {
  return {
    showWebView: state.auth.showWebView,
    url: state.auth.url,
    oidc: state.OIDC
  };
}

function mapDispatchToProps(dispatch) {
  return {
    authActions: bindActionCreators(AuthActions, dispatch)
  }
}

const ConnectedMenu = connect(mapStateToProps, mapDispatchToProps)(Menu);

export default ConnectedMenu;
