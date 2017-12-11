import { TabNavigator, StackNavigator, addNavigationHelpers } from 'react-navigation'

import {TabStack, GlobalStack, ServiceStack } from './routes';


export const Navigator = StackNavigator({
  Home: {
    screen: ServiceStack
  }
}, {
  headerMode: 'none'
})
