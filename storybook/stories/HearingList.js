import React          from 'react';
import { Text, View } from 'react-native';

import { storiesOf }  from '@storybook/react-native';
import { action }     from '@storybook/addon-actions';
import { linkTo }     from '@storybook/addon-links';

import HearingList  from '../../src/components/HearingList';

const hearingList = [
  { key: 1, imageUrl:'https://source.unsplash.com/rxTSzNCOZ8I/800x600', headline:'Important hearing' },
  { key: 2, imageUrl:'https://source.unsplash.com/rxTSzNCOZ8I/800x600', headline:'Important hearing' },
  { key: 3, imageUrl:'https://source.unsplash.com/rxTSzNCOZ8I/800x600', headline:'Important hearing' },
  { key: 4, imageUrl:'https://source.unsplash.com/rxTSzNCOZ8I/800x600', headline:'Important hearing' },
  { key: 5, imageUrl:'https://source.unsplash.com/rxTSzNCOZ8I/800x600', headline:'Important hearing' }
]
const HearingListStories = storiesOf('HearingList', module)
  .add('with data', () => (
    <HearingList hearingList={hearingList} />
  ))
export default HearingListStories
