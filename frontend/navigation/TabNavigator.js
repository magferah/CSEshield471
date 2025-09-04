import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeStack from './HomeStack';
import SettingsStack from './SettingsStack';

//import ReceivedAlertsScreen from '../screens/ReceivedAlertsScreen';

import PeopleScreen from '../screens/PeopleScreen';
import LiveLocationScreen from '../screens/LiveLocationScreen';
import HelpScreen from '../screens/HelpScreen';
//import SettingsScreen from '../screens/SettingsScreen';
//import SignupScreen from '../screens/SignupScreen'; // 👈 Import SignupScreen


const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#388e3c',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { backgroundColor: '#c8e6c9' },
        tabBarIcon: ({ color, size }) => {
          let iconName = 'home'; // default
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'People') iconName = 'people';
          else if (route.name === 'Location') iconName = 'location';
          else if (route.name === 'Help') iconName = 'alert-circle';
          else if (route.name === 'Settings') iconName = 'settings';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="People" component={PeopleScreen} />
      <Tab.Screen name="Location" component={LiveLocationScreen} />
      <Tab.Screen name="Help" component={HelpScreen} />
      <Tab.Screen name="Settings" component={SettingsStack} />
      
    </Tab.Navigator>
  );
};

export default TabNavigator;
