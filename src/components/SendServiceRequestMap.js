import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  Animated,
  TouchableWithoutFeedback,
  Platform
} from 'react-native';

import Global                  from '../util/globals';
import MapView                 from 'react-native-maps';
import transSendServiceRequest from '../translations/sendServiceRequest';

const MARKER_IMAGE_SIZE = 42;
const MAP_HEIGHT        = 140;
const MAP_MARGIN        = 24;

class SendServiceRequestMap extends Component {

  constructor(props, context) {
    super(props, context);

    this.markerTop = (Dimensions.get('window').height - MAP_MARGIN) / 2 - MARKER_IMAGE_SIZE;
  }

  mapHeight() {
    if (!this.props.locationEnabled) {
      return {
        height: 0,
      }
    }
    else if (this.props.fullScreenMap) {
      return {
        height: Dimensions.get('window').height - MAP_MARGIN
      }
    } else {
      return {
        height: MAP_HEIGHT,
      }
    }
  }

  render() {
    return (
      <Animated.View style={[styles.container, this.mapHeight(), this.props.animation]}>
          {this.props.locationEnabled &&
            <View style={[styles.mapView, {
              flex: 1,
            }]}>
              <MapView.Animated
                style={styles.map}
                region={this.props.region}
                showsUserLocation={false}
                followUserLocation={false}
                toolbarEnabled={false}
                scrollEnabled={this.props.fullScreenMap}
                zoomEnabled={this.props.fullScreenMap}
                onPanDrag={(e) => this.props.setFullScreenMap(true)}
                onPress={(e) => this.props.setFullScreenMap(true)}
                onLongPress={(e) => this.props.setFullScreenMap(true)}
                onMarkerDragStart={(e) => this.props.setFullScreenMap(true)}
                onRegionChange={(e) => this.props.onRegionChange(e)}
                onRegionChangeComplete={(e) => this.props.onRegionChangeComplete(e)}>
                <MapView.Marker.Animated
                  ref={(m) => this.marker = m}
                  coordinate={this.props.region}
                  onPress={(e) => this.props.setFullScreenMap(true)}
                  onDragEnd={(e) => this.updateMarkerPos(e.nativeEvent.coordinate, this.marker)}>
                <Image // This image hides the default marker
                  source={this.props.markerIcon}
                  style={{height: 0, width: 0}} />
                </MapView.Marker.Animated>
              </MapView.Animated>
              <TouchableWithoutFeedback onPress={() => this.props.setFullScreenMap(true)}>
                <Image  // Marker is inside a button in order to enlarge the map if ther marker is pressed
                  source={this.props.markerIcon}
                  style={[styles.markerImage, {
                    top: this.props.fullScreenMap ? this.markerTop : 35,
                  }]} />
              </TouchableWithoutFeedback>
            </View>
          }
        {this.props.locationEnabled && this.props.fullScreenMap &&
          <View style={styles.doneButtonContainer}>
            <TouchableWithoutFeedback onPress={()=>this.props.onDoneClick()}>
              <Animated.View style={[styles.doneButton, this.props.animation]}>
                <Text style={styles.doneButtonText}>{transSendServiceRequest.done}</Text>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        }
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  mapView: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  markerImage: {
    position: 'absolute',
    height: MARKER_IMAGE_SIZE,
    width: MARKER_IMAGE_SIZE,
    left: (Dimensions.get('window').width / 2) - (MARKER_IMAGE_SIZE / 2)
  },
  doneButton: {
    marginTop: -64,
    marginLeft: Dimensions.get('window').width / 2 - 42,
    height: 46,
    width: 96,
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
  doneButtonText: {
    color: Global.COLOR.WHITE,
    fontSize: 16,
    fontWeight: 'bold'
  },
});

module.exports = SendServiceRequestMap