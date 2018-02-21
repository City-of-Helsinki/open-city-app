import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Image,
  Text
} from 'react-native';

import { connect }            from 'react-redux';
import { bindActionCreators } from 'redux';
import EventActions           from '../../redux/events/actions';
import HearingActions         from '../../redux/hearings/actions';

import Navbar             from '../../components/Navbar';
import Spinner            from '../../components/Spinner';
import Hero               from '../../components/Hero';
import HearingList        from '../../components/HearingList';
import EventList          from '../../components/EventList';
import backIcon           from '../../img/back.png';
import styles             from './styles';
import {HEADER_LOGO}      from '../../styles/common';


class HomeView extends Component {

  constructor(props, context) {
    super(props);
  }

  componentWillMount() {
    this.props.eventActions.getHero();
    this.props.eventActions.getList();
    this.props.hearingActions.getHearings();
  }

  static navigationOptions = {
    headerTitle: (
        <Image
          style={HEADER_LOGO}
          resizeMode="contain"
          source={require('./../../img/city-logo.png')}
        />
    ),
    tabBarLabel: 'Home',
    tabBarIcon: ({ tintColor }) => (
      <Image
        source={require('./../../img/icon-home.png')}
        style={[styles.icon, {tintColor: tintColor}]}
      />
    ),
  };

  render() {
    const { heroEvent, hearingList, eventList,heroLoading } = this.props
    return (
      <ScrollView Style={styles.container}>
        <Hero
          imageUrl={heroEvent.imageUrl}
          date={heroEvent.date}
          place={heroEvent.place}
          headline={heroEvent.headline}
          eventUrl={heroEvent.eventUrl}
          loading={heroLoading}
          navigation={this.props.navigation}
        />
        <EventList
          navigation={this.props.navigation}
          eventList={eventList}
        />
        <HearingList
          navigation={this.props.navigation}
          hearingList={hearingList}
        />
      </ScrollView>
    );
  }
}

function mapStateToProps(state) {
  return {
    events: state.events,
    heroEvent: state.events.heroEvent,
    heroLoading: state.events.heroLoading,
    hearingList: state.hearings.hearingList,
    eventList: state.events.eventList
  };
}

function mapDispatchToProps(dispatch) {
  return {
    eventActions: bindActionCreators(EventActions, dispatch),
    hearingActions: bindActionCreators(HearingActions, dispatch)
  }
}

const ConnectedHomeView = connect(mapStateToProps, mapDispatchToProps)(HomeView);

export default ConnectedHomeView
