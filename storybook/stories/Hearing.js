import React          from 'react';
import { Text, View } from 'react-native';

import { storiesOf }  from '@storybook/react-native';
import { action }     from '@storybook/addon-actions';
import { linkTo }     from '@storybook/addon-links';

import Hearing  from '../../src/components/Hearing';

const HearingStories = storiesOf('Hearing', module)
  .addDecorator(getStory => <View>{getStory()}</View>)
  .add('with data', () => (
    <Hearing imageUrl='https://source.unsplash.com/rxTSzNCOZ8I/800x600' headline='Lux Helsinki 2018' />
  ))
export default HearingStories
