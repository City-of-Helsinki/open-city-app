import React, { Component } from 'react';
import { ActivityIndicator, View, ScrollView, Text, Image, Linking   } from 'react-native';
import HTML                   from 'react-native-render-html';
import { connect }            from 'react-redux';
import { bindActionCreators } from 'redux';
import EventActions           from '../../redux/events/actions';
import MapView from 'react-native-maps';
import { styles, customMapStyles } from './styles';

class EventDetailView extends Component {

  static navigationOptions = {
    headerTitle: (
        <Image
          style={styles.headerLogo}
          resizeMode="contain"
          source={require('./../../img/city-logo.png')}
        />
    )
  };

  constructor(props) {
    super(props)
  }

  componentWillMount() {
    this.props.eventActions.getEvent(this.props.navigation.state.params.eventUrl)
  }

  render() {
    const { loading, imageUrl, headline, date, description, region, place, phone, infoUrl} = this.props
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
          zoomEnabled={false}
          customMapStyle={customMapStyles}>

          <MapView.Marker
            coordinate={this.props.region}
            image={require('../../img/marker_pin.png')}
          />
        </MapView>
        <View style={styles.eventMeta}>
          <View style={styles.eventMetaField}>
            <Image
              source={require('./../../img/icon-globe.png')}
              style={[styles.metaIcon]}
            />
            <Text onPress={() => Linking.openURL(infoUrl)} style={styles.metaText}>{infoUrl}</Text>
          </View>
          <View style={styles.eventMetaField}>
            <Image
              source={require('./../../img/icon-mobile.png')}
              style={[styles.metaIcon]}
            />
            <Text onPress={() => Linking.openURL('tel:' + phone)} style={styles.metaText}>{phone}</Text>
          </View>
        </View>
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
    region: state.events.event.region,
    place: state.events.event.place,
    phone: state.events.event.phone,
    infoUrl: state.events.event.infoUrl
  };
}

function mapDispatchToProps(dispatch) {
  return {
    eventActions: bindActionCreators(EventActions, dispatch)
  }
}

const ConnectedEventDetailView = connect(mapStateToProps, mapDispatchToProps)(EventDetailView);

export default ConnectedEventDetailView
