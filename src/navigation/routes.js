import { StackNavigator, TabNavigator }       from 'react-navigation';

import SplashScreen             from '../views/SplashScreen';
// import MainView                 from '../views/MainView';
// import SendServiceRequestView   from '../views/SendServiceRequestView';
// import ServiceRequestListView   from '../views/ServiceRequestListView';
import IntroductionView         from '../views/IntroductionView';
// import ServiceRequestDetailView from '../views/ServiceRequestDetailView';
import AppFeedbackView          from '../views/AppFeedbackView';
import ImageView                from '../views/ImageView';
import HomeView                 from '../views/HomeView';
import HearingDetailView        from '../views/HearingDetailView';
import EventDetailView          from '../views/EventDetailView';

// export const ServiceStack = StackNavigator({
//   MainView: { screen: MainView },
//   ServiceRequestListView: { screen: ServiceRequestListView },
//   SendServiceRequestView: { screen: SendServiceRequestView },
//   AppFeedbackView: { screen: AppFeedbackView },
//   ServiceRequestDetailView: { screen: ServiceRequestDetailView }
// }, {
//   headerMode: 'none' //hide built in navbar
// });

const HomeStack = StackNavigator({
  HomeView: { screen: HomeView},
  HearingDetailView: { screen: HearingDetailView},
  EventDetailView: { screen: EventDetailView}
})

export const TabStack = TabNavigator({
  Home: {
    screen: HomeStack,
  }
}, {
  tabBarPosition: 'bottom',
  tabBarOptions: {
    activeTintColor: '#000000',
    inactiveTintColor: '#454545'
  }
});

export const GlobalStack = StackNavigator({
  Tabs: { screen: TabStack },
  SplashScreen: { screen: SplashScreen },
  IntroductionView: { screen: IntroductionView },
  AppFeedbackView: { screen: AppFeedbackView },
  ImageView: { screen: ImageView }
}, {
  headerMode: 'none'
})
