import React from 'react';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { AppTabNavigator } from './AppTabNavigator';
import CustomSideBarMenu from './CustomSideBarMenu';
import MyBartersScreen from '../screens/MyBartersScreen';
import SettingsScreen from '../screens/SettingsScreen';
import NotificationScreen from '../screens/NotificationsScreen';
import { Icon } from 'react-native-elements';

export const AppDrawerNavigator = createDrawerNavigator(
    {
        Home: {
            screen: AppTabNavigator,
            navigationOptions: {
                drawerIcon: <Icon name="home" type="font-awesome" />,
            },
        },
        MyBarters: {
            screen: MyBartersScreen,
            navigationOptions:{
                drawerIcon:<Icon name="exchange" type="font-awesome"/>
            }
        },
        Notifications: {
            screen: NotificationScreen,
            navigationOptions: {
                drawerIcon: <Icon name="bell" type="font-awesome" />,
            },
        },
        Settings: {
            screen: SettingsScreen,
            navigationOptions: {
                drawerIcon: <Icon name="gear" type="font-awesome" />,
            },
        },
    },
    {
        contentComponent: CustomSideBarMenu,
    },
    {
        initialRouteName: 'Home',
    }
);
