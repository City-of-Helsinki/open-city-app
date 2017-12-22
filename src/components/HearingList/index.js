import React, { Component } from 'react';
import {
  ImageBackground,
  View,
  Text,
  FlatList
}                           from 'react-native';
import Card                 from '../Card';
import CardList             from '../CardList';
import transHearings        from '../../translations/hearings';
import Config               from '../../config';
import styles               from './styles';

class HearingList extends Component {
  constructor(props) {
    super(props);
  }

  onPressItem = (item) => {
    this.props.navigation.navigate('HearingDetailView', {
      url: Config.HEARINGS_WEB_URL + item.urlSlug,
      JStoInject: 'document.querySelector(".navbar-primary").style.display="none";'
    })
  }

  render() {
    const {hearingList} = this.props

    return (
      <View style={styles.hearingWrapper}>
        <View style={styles.headline}>
          <Text style={styles.headlineText}>
            {transHearings.title}
          </Text>
        </View>
        <CardList
          listData={hearingList}
          onPress={this.onPressItem}
        />
      </View>
    );
  }
}

export default HearingList
