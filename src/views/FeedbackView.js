import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  TextInput,
  TouchableHighlight,
} from 'react-native';

import Dimensions from 'Dimensions';
import MapView from 'react-native-maps';
import Drawer  from 'react-native-drawer'
import Navbar  from './../components/Navbar';
import Menu    from './../components/Menu';

class FeedbackView extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <Drawer
        ref={(ref) => this._drawer = ref}
        type="static"
        content={<Menu mapView={()=>{alert('mappii')}} FeedbackView={()=>{this._drawer.close()}}/>}
        openDrawerOffset={100}
        tweenHandler={Drawer.tweenPresets.parallax}>
        <View style={styles.container}>
          <Navbar
            menuAction={()=>this._drawer.open()}
            />
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            showsUserLocation={true}
            followUserLocation={false}
            >
          </MapView>
        </View>
        <View style={styles.feedbackContainer}>

          <TextInput
          style={styles.titleInput}
          placeholder="Title"
          name="title"

          />

          <TextInput
          style={styles.contentInput}
          placeholder="Give city of Helsinki feedback"
          name="content"
          multiline={true}
          />

          <View style={styles.bottomContainer}>
              <View style={{flex: 0.8}}>
              </View>
              <View style={styles.buttonView}>
              </View>

          </View>

        </View>
      </View>
      </Drawer>
    );
  }
}

const styles = StyleSheet.create({
  container: {

    flexDirection: 'column',
    flex: 1,
    height: 100,
  },
  mapContainer: {
    flex: 0.35,
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  map: {
    flex: 1,
  },
  feedbackContainer: {
    flex: 0.65,
    backgroundColor: '#EEEEEE',
  },
  bottomContainer:{
    flex: 0.18,
    flexDirection: 'row',
  },
  titleInput: {
    flex: 0.1,
    paddingLeft: 10,
    margin: 10,
    backgroundColor: 'white',
    fontSize: 16,

  },
  contentInput: {
    flex: 0.62,
    paddingLeft: 10,
    margin: 10,
    marginTop: 0,
    backgroundColor: 'white',
    fontSize: 16,
    shadowColor: 'black',
    shadowOpacity: 0.8,
    shadowOffset: {
      height: 0,
      width: 0
    },
    shadowRadius:1,
  },
  buttonView: {
    borderRadius: (Dimensions.get('window').height * (0.12) -10) / 2,
    backgroundColor: 'blue',
    width: Dimensions.get('window').height * (0.12) - 10,
    height: Dimensions.get('window').height * (0.12) - 10,
    marginRight: 25,
  }

});

module.exports = FeedbackView
