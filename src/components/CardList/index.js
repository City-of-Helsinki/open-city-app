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
        <Card
          imageUrl={item.imageUrl}
          headline={item.headline}
          overlayStyle={this.props.overlayStyle}
          textStyle={this.props.textStyle}
          onPressItem={() => this.onPressItem(item)}
        />
    )
  }

  render() {
    const {listData, onEndReached} = this.props

    return (
      <FlatList
        data={listData}
        renderItem={this.renderItem}
        initialNumToRender={3}
        horizontal={true}
        onEndReached={onEndReached}
        onEndReachedTreshold={0.3}
      />
    );
  }
}

export default CardList
