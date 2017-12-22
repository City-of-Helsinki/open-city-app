import React          from 'react';
import { Text, View } from 'react-native';

import { storiesOf }  from '@storybook/react-native';
import { action }     from '@storybook/addon-actions';
import { linkTo }     from '@storybook/addon-links';

import EventDetailView  from '../../src/views/EventDetailView';

const EventStories = storiesOf('Event', module)
  .addDecorator(getStory => <View>{getStory()}</View>)
  .add('with data', () => (
    <EventDetailView
      imageUrl="https://source.unsplash.com/rxTSzNCOZ8I/800x600"
      headline="This is a title"
      date="4.2. 16:00"
      description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eget libero vitae nisi sollicitudin finibus. Donec pulvinar sodales enim, vitae volutpat ex fermentum a. Nulla facilisi. Sed id dapibus nulla. Etiam id porta lectus. Aliquam nisl velit, porttitor ac volutpat ac, suscipit sit amet odio. Nunc et nibh eget mauris facilisis finibus. Integer imperdiet egestas tellus non ultricies."
      region={{
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      }}
    />
  ))
export default EventStories
