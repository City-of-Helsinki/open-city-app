import React            from 'react';
import { Text }         from 'react-native';

import { storiesOf }    from '@storybook/react-native';
import { action }       from '@storybook/addon-actions';
import { linkTo }       from '@storybook/addon-links';

import CenterView       from './CenterView';
// import LinkedEventsList from '../../src/components/LinkedEventsList';

// const LinkedEventStories = storiesOf('LinkedEvents', module)
//   .addDecorator(getStory => <CenterView>{getStory()}</CenterView>)
//   .add('without events', () => (
//     <LinkedEventsList />
//   ))
//   add.('with data', () => (
//     <LinkedEventsList
//       events={[]} />
//   ))

const LinkedEventStories = storiesOf('LinkedEvents', module)
  .addDecorator(getStory => <CenterView>{getStory()}</CenterView>)
  .add('without events', () => (
    <Text>This will be a LinkedEvent</Text>
  ))
export default LinkedEventStories
