import React          from 'react';
import { Text }       from 'react-native';

import { storiesOf }  from '@storybook/react-native';
import { action }     from '@storybook/addon-actions';
import { linkTo }     from '@storybook/addon-links';

import CenterView     from './CenterView';
// import FeaturedEvent  from '../../src/components/FeaturedEvent';

// const FeaturedEventStories = storiesOf('FeaturedEvent', module)
//   .addDecorator(getStory => <CenterView>{getStory()}</CenterView>)
//   .add('without event', () => (
//     <FeaturedEvent />
//   ))
//   .add('with event data', () => (
//     <FeaturedEvent
//       onPress={action=('clicked featured event')}
//       event={{}} />
//   ))

const FeaturedEventStories = storiesOf('FeaturedEvent', module)
  .addDecorator(getStory => <CenterView>{getStory()}</CenterView>)
  .add('without events', () => (
    <Text>This will be a FeaturedEvent</Text>
  ))
export default FeaturedEventStories
