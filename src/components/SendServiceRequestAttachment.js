import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  Animated,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';

import MapView                 from 'react-native-maps';
import Thumbnail               from '../components/Thumbnail';
import Global                  from '../util/globals';
import transSendServiceRequest from '../translations/sendServiceRequest';

class SendServiceRequestAttachment extends Component {

  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <Animated.View style={[styles.attachmentContainer, this.props.hideAnimation]}>
        {this.props.thumbnailImageSource === null &&
        <TouchableWithoutFeedback onPress={()=>this.props.onAddAttachmentClick()}>
          <View style={styles.attachmentButton}>
            <Text style={styles.attachmentButtonText}>{transSendServiceRequest.addAttachment}</Text>
          </View>
        </TouchableWithoutFeedback>
        }
        {this.props.thumbnailImageSource !== null &&
          <View style={styles.thubmnailView}>
            <Thumbnail
              show={this.props.showThumbnail}
              imageSource={this.props.thumbnailImageSource}
              imageHeight={62}
              imageWidth={62}
              imageClickAction={()=>this.props.removeThumbnail()} />
          </View>
        }
      </Animated.View>
    );
  }
}

module.exports = SendServiceRequestAttachment

const styles = StyleSheet.create({
  attachmentContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopColor: Global.COLOR.GREY,
  },
  attachmentButton: {
    flex: 1,
    height: 46,
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
  attachmentButtonText: {
    color: Global.COLOR.WHITE,
    fontSize: 16,
    fontWeight: 'bold'
  },
  thubmnailView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});