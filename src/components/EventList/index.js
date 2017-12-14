import React, { Component } from 'react';
import {
  ImageBackground,
  View,
  Text,
  FlatList
}                           from 'react-native';
import Card                 from '../Card';
import CardList             from '../CardList';
import Config               from '../../config';
import transEvents          from '../../translations/events'
import styles               from './styles';

class EventList extends Component {
  constructor(props) {
    super(props);
  }

  onPressItem = (item) => {
    this.props.navigation.navigate('EventDetailView', {
      eventUrl: item.eventUrl
    })
  }

  render() {
    const {eventList} = this.props

    return (
      <View style={styles.eventWrapper}>
        <View style={styles.headline}>
          <Text style={styles.headlineText}>
            {transEvents.title}
          </Text>
        </View>
        <CardList
          listData={eventList}
          onPress={this.onPressItem}
        />
      </View>
    );
  }
}

export default EventList
