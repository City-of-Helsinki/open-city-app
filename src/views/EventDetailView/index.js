import React, { Component } from 'react';
import { ActivityIndicator, View, ScrollView, Text, Image } from 'react-native';
import { connect }            from 'react-redux';
import { bindActionCreators } from 'redux';
import EventActions           from '../../redux/events/actions';
import MapView from 'react-native-maps';
import styles from './styles';

class EventDetailView extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    console.log("nav params", this.props.navigation)
    this.props.eventActions.getEvent(this.props.navigation.state.params.eventUrl)
  }

  render() {
    const { loading, imageUrl, headline, date, description, region } = this.props
    let pic = {
      uri: imageUrl
    }

    return loading ? (
      <ActivityIndicator size="large" />
    ): (
      <ScrollView style={styles.view}>
        <View style={styles.headerImage}>
          <Image source={pic} style={styles.image} resizeMode="cover" />
          <Image source={require('./../../img/main-image-decoration.png')}  resizeMode={'cover'} style={styles.headerImageDecoration}/>
        </View>
        <View style={styles.centeredContent}>
          <Text style={[styles.headline,styles.textBlockNarrow]}>{headline}</Text>
          <Text style={[styles.date,styles.textBlock]}>{date}</Text>
          <Text style={[styles.description,styles.textBlock]}>{description}</Text>
        </View>
        <MapView
          style={styles.map}
          region={region}
          showsUserLocation={false}
          followUserLocation={false}
          toolbarEnabled={false}
          scrollEnabled={false}
          zoomEnabled={false}>

          <MapView.Marker
            coordinate={this.props.region}
            image={require('../../img/marker_pin.png')}
          />
        </MapView>
      </ScrollView>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading: state.events.loading,
    imageUrl: state.events.event.imageUrl,
    headline: state.events.event.headline,
    date: state.events.event.date,
    description: state.events.event.description,
    region: state.events.event.region
  };
}

function mapDispatchToProps(dispatch) {
  return {
    eventActions: bindActionCreators(EventActions, dispatch)
  }
}

const ConnectedEventDetailView = connect(mapStateToProps, mapDispatchToProps)(EventDetailView);

export default ConnectedEventDetailView
