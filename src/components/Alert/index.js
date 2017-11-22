import React, { Component } from 'react';
import { Alert } from 'react-native';
module.exports = function(title, message, button) {
  Alert.alert(
    title,
    message,
    [
      {text: button},
    ]
  );
}