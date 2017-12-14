import React, { Component } from 'react';
import {
  ImageBackground,
  View,
  Text,
  FlatList
}                           from 'react-native';
import Card                 from '../Card';
import transHearings        from '../../translations/hearings';
import Config               from '../../config';
import styles               from './styles';

class CardList extends Component {
  constructor(props) {
    super(props);
  }

  onPressItem = (item) => {
    this.props.onPress(item)
  }

  renderItem = ({item}) => {
    return (
      <View style={styles.listItemMargin} collapsable={false}>
        <Card
          imageUrl={item.imageUrl}
          headline={item.headline}
          onPressItem={() => this.onPressItem(item)}
        />
      </View>
    )
  }

  render() {
    const {listData} = this.props

    return (
        <FlatList
          data={listData}
          renderItem={this.renderItem}
          horizontal={true}
        />
    );
  }
}

export default CardList
