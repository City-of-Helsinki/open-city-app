import React          from 'react';
import { Text, View } from 'react-native';

import { storiesOf }  from '@storybook/react-native';
import { action }     from '@storybook/addon-actions';
import { linkTo }     from '@storybook/addon-links';

import Hero  from '../../src/components/Hero/';

const HeroStories = storiesOf('Hero', module)
  .addDecorator(getStory => <View>{getStory()}</View>)
  .add('Event Hero', () => (
    <Hero imageUrl='https://source.unsplash.com/rxTSzNCOZ8I/800x600' date='6.1 - 10.1.2018' place='Kruununhaka' headline='Lux Helsinki 2018' />
  ))
export default HeroStories
