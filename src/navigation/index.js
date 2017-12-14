import { TabNavigator, StackNavigator, addNavigationHelpers } from 'react-navigation'

import {TabStack, GlobalStack } from './routes';


export const Navigator = StackNavigator({
  Home: {
    screen: GlobalStack
  }
}, {
  headerMode: 'none'
})
