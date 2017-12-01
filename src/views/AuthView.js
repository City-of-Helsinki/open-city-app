// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Linking, Button, StyleSheet, View, WebView } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { store } from '../redux/store';

import AuthActions from '../redux/auth/actions';

const styles = StyleSheet.create({
  rootView: {
    flex: 1,
    flexDirection: 'column'
  }
});

const onLoadStartListeners = [];
const addOnLoadStartListener = (listener) => {
  onLoadStartListeners.push(listener);
};


const loadStart = (event) => {
  onLoadStartListeners.forEach((listener) => {
    listener(event.nativeEvent.url);
  });
};


class AuthView extends Component {
  constructor(props) {
    super();
  }

  close = () => {
    this.props.authActions.hide();
  };

  render() {
    if (this.props.showWebView === false || this.props.enabled === false) {
      return this.props.children;
    }

    return (
      <View style={ styles.rootView }>
        <Button
          color={ '#d81111' }
          onPress={ this.close }
          title="Cancel"
        />
        <WebView
          source={{ uri: this.props.url }}
          onLoadStart={ loadStart }
        />
      </View>
    );
  }
}

AuthView.propTypes = {
  children: PropTypes.element.isRequired,
  enabled: PropTypes.bool.isRequired,
  showWebView: PropTypes.bool.isRequired,
  url: PropTypes.string.isRequired
};

function mapStateToProps(state) {
  return {
    showWebView: state.auth.showWebView,
    url: state.auth.url
  };
}

function mapDispatchToProps(dispatch) {
  return {
    authActions: bindActionCreators(AuthActions, dispatch)
  }
}

const ConnectedAuthView = connect(mapStateToProps, mapDispatchToProps)(AuthView);

export {
  addOnLoadStartListener
}

export default ConnectedAuthView;
