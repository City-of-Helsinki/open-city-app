import { configure }            from '@storybook/react-native';

import FeaturedEventStories     from './FeaturedEvent';
import LinkedEventsListStories  from './LinkedEventsList';
import HeroStories              from './Hero';
import HearingStories           from './Hearing';
import HearingListStories       from './HearingList'
import EventStories             from './Event';

export function configureStories() {
  FeaturedEventStories,
  LinkedEventsListStories,
  HeroStories,
  HearingStories,
  HearingListStories,
  EventStories
}
