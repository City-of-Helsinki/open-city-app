import { StackNavigator, TabNavigator }       from 'react-navigation';

import SplashScreen             from '../views/SplashScreen';
import MainView                 from '../views/MainView';
import SendServiceRequestView   from '../views/SendServiceRequestView';
import ServiceRequestListView   from '../views/ServiceRequestListView';
import IntroductionView         from '../views/IntroductionView';
import ServiceRequestDetailView from '../views/ServiceRequestDetailView';
import AppFeedbackView          from '../views/AppFeedbackView';
import ImageView                from '../views/ImageView';

const ServiceStack = StackNavigator({
  MainView: { screen: MainView },
  ServiceRequestListView: { screen: ServiceRequestListView },
  SendServiceRequestView: { screen: SendServiceRequestView },
  ServiceRequestDetailView: { screen: ServiceRequestDetailView }
}, {
  headerMode: 'none' //hide built in navbar
});

export const TabStack = TabNavigator({
  ServiceRequest: {
    screen: ServiceStack,
    tabBarLabel: 'Palautteet'
  }
})

export const GlobalStack = StackNavigator({
  SplashScreen: { screen: SplashScreen },
  IntroductionView: { screen: IntroductionView },
  AppFeedbackView: { screen: AppFeedbackView },
  ImageView: { screen: ImageView },
  Tabs: { screen: TabStack }
}, {
  headerMode: 'none'
})
