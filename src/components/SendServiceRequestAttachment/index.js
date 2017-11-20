import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';

import MapView                 from 'react-native-maps';
import Thumbnail               from '../../components/Thumbnail';
import transSendServiceRequest from '../../translations/sendServiceRequest';
import styles                  from './styles';

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
