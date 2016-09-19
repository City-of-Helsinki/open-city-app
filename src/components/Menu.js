import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';

// Images
import feedbackIcon from '../img/feedback.png';
import listIcon     from '../img/list.png';
import mapIcon      from '../img/map.png';

import transMenu   from '../translations/menu';

class Menu extends Component {

  constructor(props, context) {
    super(props);

    transMenu.setLanguage('fi');
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <View style={styles.titleView}>
            <Text style={styles.titleText}>{transMenu.menuTitleView}</Text>
          </View>
          <TouchableWithoutFeedback onPress={this.props.mapView}>
            <View style={styles.buttonView}>
              <Image
                source={mapIcon}
                style={styles.icon}/>
              <Text style={styles.menuText}>Kartta viewiin</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={this.props.FeedbackView}>
            <View style={styles.buttonView}>
              <Image
                source={listIcon}
                style={styles.icon}/>
              <Text style={styles.menuText}>Toiseen viewiin</Text>
            </View>
          </TouchableWithoutFeedback>
          <View style={styles.titleView}>
            <Text style={styles.titleText}>{transMenu.menuTitleFeedback}</Text>
          </View>
          <TouchableWithoutFeedback>
            <View style={styles.buttonView}>
              <Image
                source={feedbackIcon}
                style={styles.icon}/>
              <Text style={styles.menuText}>Palaute hommaan</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingTop: 50,
    marginTop: 55,
    borderWidth: 2,
    borderColor: 'red'
  },
  innerContainer: {
    flexDirection: 'column',
    alignItems: 'stretch',

  },
  buttonView: {
    marginBottom: 10,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 18,
    color: '#fff',
  },
  icon: {
    height: 30,
    width: 30,
    marginRight: 5,
  },
  titleView: {
    backgroundColor: '#FEF47D',
    paddingLeft: 10,
    marginBottom: 10,
  },
  titleText: {
    fontSize: 20,
    color: '#000',
  }
});


module.exports = Menu
