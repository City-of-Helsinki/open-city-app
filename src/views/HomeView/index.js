import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Image
} from 'react-native';

import { connect }            from 'react-redux';
import { bindActionCreators } from 'redux';
import EventActions           from '../../redux/events/actions';
import HearingActions         from '../../redux/hearings/actions';

import Navbar             from '../../components/Navbar';
import Spinner            from '../../components/Spinner';
import Hero               from '../../components/Hero';
import HearingList        from '../../components/HearingList';
import backIcon           from '../../img/back.png';
import transHome          from '../../translations/homeView';
import styles             from './styles';

class HomeView extends Component {

  constructor(props, context) {
    super(props);
  }

  componentWillMount() {
    this.props.eventActions.getHero();
    this.props.hearingActions.getHearings();
  }

  static navigationOptions = {
    headerTitle: (
        <Image
          style={styles.headerLogo}
          resizeMode="contain"
          source={require('./../../img/city-logo.png')}
        />
    ),
    tabBarLabel: transHome.tabBarLabel,
    tabBarIcon: ({ tintColor }) => (
      <Image
        source={require('./../../img/icon-home.png')}
        style={[styles.icon, {tintColor: tintColor}]}
      />
    ),
  };

  render() {
    const { heroEvent, hearingList, heroLoading } = this.props
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
    hearingList: state.hearings.hearingList
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
