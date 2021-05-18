import React from 'react';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import HomeScreen from '../screens/HomeScreen';
import ExchangeScreen from '../screens/ExchangeScreen';
import { AppStackNavigator } from './AppStackNavigator';

export const AppTabNavigator = createBottomTabNavigator({
    Home: {
        screen: AppStackNavigator,
        navigationOptions: {
            tabBarLabel: "Home",
        }
    },
    Exchange: {
        screen: ExchangeScreen,
        navigationOptions: {
            tabBarLabel: "Exchange",
        }
    }
});