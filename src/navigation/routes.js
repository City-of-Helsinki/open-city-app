import { StackNavigator, TabNavigator, TabBarBottom }       from 'react-navigation';

import SplashScreen             from '../views/SplashScreen';
import MainView                 from '../views/MainView';
import SendServiceRequestView   from '../views/SendServiceRequestView';
import ServiceRequestListView   from '../views/ServiceRequestListView';
import IntroductionView         from '../views/IntroductionView';
import ServiceRequestDetailView from '../views/ServiceRequestDetailView';
import AppFeedbackView          from '../views/AppFeedbackView';
import ImageView                from '../views/ImageView';
import HomeView                 from '../views/HomeView';
import HearingDetailView        from '../views/HearingDetailView';
import EventDetailView          from '../views/EventDetailView';

const HomeStack = StackNavigator({
  HomeView: { screen: HomeView},
  HearingDetailView: { screen: HearingDetailView},
  EventDetailView: { screen: EventDetailView}
})

export const TabStack = TabNavigator({
  Home: {
    screen: HomeView
  },
  ServiceRequest: {
    screen: MainView
  }
}, {
  tabBarComponent: TabBarBottom,
  tabBarPosition: 'bottom',
  tabBarOptions: {
    activeTintColor: '#000000',
    inactiveTintColor: '#454545'
  }
});

export const GlobalStack = StackNavigator({
  Home: { screen: TabStack },
  HearingDetailView: { screen: HearingDetailView},
  EventDetailView: { screen: EventDetailView},
  ServiceRequestListView: { screen: ServiceRequestListView },
  SendServiceRequestView: { screen: SendServiceRequestView },
  AppFeedbackView: { screen: AppFeedbackView },
  ServiceRequestDetailView: { screen: ServiceRequestDetailView }
}, {})
