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
    tabBarLabel: 'Home',
    tabBarIcon: ({ tintColor }) => (
      <Image
        source={require('./../../img/icon-home.png')}
        style={[styles.icon, {tintColor: tintColor}]}
      />
    ),
  };

  render() {
    const { heroEvent, hearingList } = this.props
    return (
      <ScrollView Style={styles.container}>
        <Hero
          imageUrl={heroEvent.imageUrl}
          date={heroEvent.date}
          place={heroEvent.place}
          headline={heroEvent.headline}
          navigation={this.props.navigation}
          eventUrl={heroEvent.eventUrl}
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
