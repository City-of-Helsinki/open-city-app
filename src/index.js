import React, { Component } from 'react';
import {
  AppRegistry,
  AsyncStorage,
  Platform,
  BackHandler
} from 'react-native';

import { Provider } from 'react-redux';
import { OidcProvider } from 'redux-oidc';
import { store } from './redux/store';
import userManager from './util/userManager';

import ConnectedAuthView        from './views/AuthView';
import Global                   from './util/globals';
import { Navigator }            from './navigation';
import { View } from 'react-native';

class OpenCity extends Component<{}> {

  constructor(props, context) {
    super(props);
  }

  render() {
    return (

      <Provider store={store} >
            <Navigator />
      </Provider>
    );
  }

}

BackHandler.addEventListener('hardwareBackPress', function() {

  // Refactor after adding redux
  // If drawer is open, close it
  // if (Global.menuOpen && Global.menuRef !== null) {
  //   Global.menuRef.close();
  //   return true;
  //
  //   // If a marker popup is open, close it
  // } else if (Global.isMainView && Global.mainViewRef && Global.mainViewRef.state.showPopup) {
  //   Global.mainViewRef.setState({ showPopup:false });
  //   return true;
  //
  //   // If map view is active, exit the app
  // } else if (Global.isMainView) {
  //   BackHandler.exitApp();
  //
  //   // If the view is anyother than MapView, pop to the previous view
  // } else if (!Global.isMainView) {
  //   Global.navigatorRef.pop();
  //   return true;
  // }
  BackHandler.exitApp();
  return false;
});


AppRegistry.registerComponent('OpenCity', () => OpenCity);
