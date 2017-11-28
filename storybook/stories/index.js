import { configure }            from '@storybook/react-native';

import FeaturedEventStories     from './FeaturedEvent';
import LinkedEventsListStories  from './LinkedEventsList';
import HeroStories           from './Hero';

export function configureStories() {
  FeaturedEventStories,
  LinkedEventsListStories,
  HeroStories
}
