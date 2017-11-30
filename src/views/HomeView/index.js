import React, { Component } from 'react';
import {
  View,
} from 'react-native';

import { connect }            from 'react-redux';
import { bindActionCreators } from 'redux';
import EventActions           from '../../redux/events/actions';

import Navbar             from '../../components/Navbar';
import Spinner            from '../../components/Spinner';
import Hero               from '../../components/Hero';
import backIcon           from '../../img/back.png';
import styles             from './styles';

class HomeView extends Component {

  constructor(props, context) {
    super(props);
  }

  componentWillMount() {
    this.props.eventActions.getHero();
  }

  render() {
    const { heroEvent } = this.props
    return (
      <View style={styles.container}>
        <Hero
          imageUrl={heroEvent.imageUrl}
          date={heroEvent.date}
          place={heroEvent.place}
          headline={heroEvent.headline}
        />
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    events: state.events,
    heroEvent: state.events.heroEvent
  };
}

function mapDispatchToProps(dispatch) {
  return {
    eventActions: bindActionCreators(EventActions, dispatch)
  }
}

const ConnectedHomeView = connect(mapStateToProps, mapDispatchToProps)(HomeView);

export default ConnectedHomeView
