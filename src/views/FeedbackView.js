import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  TextInput,
  TouchableHighlight,
  BackAndroid
} from 'react-native';

import Dimensions from 'Dimensions';
import MapView from 'react-native-maps';
import Drawer  from 'react-native-drawer'
import Navbar  from './../components/Navbar';
import Menu    from './../components/Menu';

var navigator;

// Components
import FloatingActionButton from '../components/FloatingActionButton';

// Translations
import transFeedback from '../translations/feedback';
import transError    from '../translations/errors';

// Images
import sendIcon   from '../img/plus.png';
import markerIcon from '../img/location_marker.png';

class FeedbackView extends Component {
  constructor(props, context) {
    super(props, context);

    navigator = this.props.navigator;

    this.state = {
      // Initialize the marker with the center coordinates from region of the map being shown
      markerPosition: {
        latitude: this.props.route.mapRegion.latitude,
        longitude: this.props.route.mapRegion.longitude
      },
    };

    transFeedback.setLanguage('fi');
    transError.setLanguage('fi');
  }

  sendFeedback() {
    alert('lähetysx')
  }

  render() {
    return (
      <Drawer
        ref={(ref) => this._drawer = ref}
        type="overlay"
        openDrawerOffset={0.25}
        closedDrawerOffset={0}
        tapToClose={true}
        acceptTap={true}
        captureGestures={'open'}
        content={
          <Menu
            mapView={()=>{this.props.navigator.pop()}}
            feedbackView={()=>{this.navToIssueListView(this._drawer)}}
            onMenuClick={()=>this._drawer.close()}/>
        }>
        <View style={styles.container}>
          <Navbar
            onMenuClick={()=>this._drawer.open()}
            header={transFeedback.feedbackViewTitle}/>
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            region={this.props.route.mapRegion}
            showsUserLocation={false}
            followUserLocation={false}
            toolbarEnabled={false}>
            <MapView.Marker draggable
              image={markerIcon}
              coordinate={this.state.markerPosition}
              onPress={() => alert('ssas')}
            />
          </MapView>
        </View>
        <View style={styles.feedbackContainer}>
          <View style={styles.categoryContainer}>
            <Text>{transFeedback.category}</Text>
          </View>

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
                <FloatingActionButton
                  icon={sendIcon}
                  onButtonClick={()=>this.sendFeedback(this)}/>
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
  categoryContainer: {
    flexDirection: 'row',
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
});

BackAndroid.addEventListener('hardwareBackPress', function() {
  if (navigator) {
      navigator.pop();
      return true;
  }
  return false;
});

module.exports = FeedbackView
