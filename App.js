import React from 'react'
import HomeScreen from './screen/homescreen'
import MainScreen from './screen/mainscreen'
import ProfileScreen from './screen/profilescreen'
import DetailScreen from './screen/detailscreen'
import LikedScreen from './screen/detailscreen'
import {
  createStackNavigator,
  createAppContainer
} from 'react-navigation'
import AsyncStorage from '@react-native-community/async-storage'

const AppNavigator_1 = createStackNavigator (
  {
      Home: {
        screen: HomeScreen,
      },

      Main: {
        screen: MainScreen,
      },

      Detail: {
        screen: DetailScreen,
      },

      Liked: {
        screen: LikedScreen,
      },

      Profile: {
        screen: ProfileScreen,
      }
  },

  {
      initialRouteName: 'Home',
  }
)

export default createAppContainer(AppNavigator_1)
