import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  HomeIcon,
  BookOpenIcon,
  AcademicCapIcon,
  EllipsisHorizontalIcon,
  UserIcon,
} from 'react-native-heroicons/outline';
import {
  HomeIcon as HomeIconSolid,
  BookOpenIcon as BookOpenIconSolid,
  AcademicCapIcon as AcademicCapIconSolid,
  EllipsisHorizontalIcon as EllipsisHorizontalIconSolid,
  UserIcon as UserIconSolid,
} from 'react-native-heroicons/solid';

import HomeScreen from '../screens/HomeScreen';
import ResourcesScreen from '../screens/ResourcesScreen';
import MentorshipScreen from '../screens/MentorshipScreen';
import MoreScreen from '../screens/MoreScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          paddingBottom: 8,
          paddingTop: 8,
          height: 65,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 4,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let IconComponent;
          let IconComponentSolid;

          switch (route.name) {
            case 'Home':
              IconComponent = HomeIcon;
              IconComponentSolid = HomeIconSolid;
              break;
            case 'Resources':
              IconComponent = BookOpenIcon;
              IconComponentSolid = BookOpenIconSolid;
              break;
            case 'Mentorship':
              IconComponent = AcademicCapIcon;
              IconComponentSolid = AcademicCapIconSolid;
              break;
            case 'Profile':
              IconComponent = UserIcon;
              IconComponentSolid = UserIconSolid;
              break;
            case 'More':
              IconComponent = EllipsisHorizontalIcon;
              IconComponentSolid = EllipsisHorizontalIconSolid;
              break;
            default:
              IconComponent = HomeIcon;
              IconComponentSolid = HomeIconSolid;
          }

          const FinalIcon = focused ? IconComponentSolid : IconComponent;
          return <FinalIcon size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen 
        name="Resources" 
        component={ResourcesScreen}
        options={{ tabBarLabel: 'Resources' }}
      />
      <Tab.Screen 
        name="Mentorship" 
        component={MentorshipScreen}
        options={{ tabBarLabel: 'Mentorship' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
      <Tab.Screen 
        name="More" 
        component={MoreScreen}
        options={{ tabBarLabel: 'More' }}
      />
    </Tab.Navigator>
  );
}