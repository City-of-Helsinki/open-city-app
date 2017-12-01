import React, { Component } from 'react';
import { ImageBackground, View, Text, FlatList } from 'react-native';
import Hearing from '../Hearing';
import transHearings from '../../translations/hearings';
import Config from '../../config';
import styles from './styles';

class HearingList extends Component {
  constructor(props) {
    super(props);
  }

  onPressItem = (item) => {
    this.props.navigation.navigate('HearingDetailView', {
      url: Config.HEARINGS_WEB_URL + item.urlSlug,
      JStoInject: 'Array.from(document.getElementsByTagName("nav")).map(function(elem){element.style.display="none"});'
    })
  }

  renderItem = ({item}) => {
    return (
      <View style={styles.listItemMargin}>
        <Hearing
          imageUrl={item.imageUrl}
          headline={item.headline}
          onPressItem={() => this.onPressItem(item)}
        />
      </View>
    )
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
        <FlatList
          data={hearingList}
          renderItem={this.renderItem}
          horizontal={true}
        />
      </View>
    );
  }
}

export default HearingList
