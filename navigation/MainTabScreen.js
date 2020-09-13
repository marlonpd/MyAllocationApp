import React from 'react';

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import Icon from 'react-native-vector-icons/Ionicons';

import HomeScreen from '../screens/HomeScreen';
import BudgetDetailScreen from '../screens/BudgetDetailScreen';
import DetailsScreen from '../screens/DetailsScreen';
//import ExploreScreen from '../screens/ExploreScreen';

const HomeStack = createStackNavigator();
const DetailsStack = createStackNavigator();

const Tab = createMaterialBottomTabNavigator();

const MainTabScreen = () => (
  <Tab.Navigator initialRouteName='Home' activeColor='#fff'>
    <Tab.Screen
      name='Home'
      component={HomeStackScreen}
      options={{
        tabBarLabel: 'Personal',
        tabBarColor: '#009387',
        tabBarIcon: ({ color }) => (
          <Icon name='ios-person' color={color} size={26} />
        ),
      }}
    />
    <Tab.Screen
      name='Notifications'
      component={DetailsStackScreen}
      options={{
        tabBarLabel: 'Shared',
        tabBarColor: '#1f65ff',
        tabBarIcon: ({ color }) => (
          <Icon name='ios-people' color={color} size={26} />
        ),
      }}
    />
  </Tab.Navigator>
);

export default MainTabScreen;

const HomeStackScreen = ({ navigation }) => (
  <HomeStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#009387',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}
  >
    <HomeStack.Screen
      name='Home'
      component={HomeScreen}
      options={{
        title: 'Personal',
        headerLeft: () => (
          <Icon.Button
            name='ios-menu'
            size={25}
            backgroundColor='#009387'
            onPress={() => {
              navigation.toggleDrawer();
            }}
          ></Icon.Button>
        ),
      }}
    />
    <HomeStack.Screen
      name='BudgetDetail'
      component={BudgetDetailScreen}
      options={{
        title: 'Budget Details',
        headerLeft: () => (
          <Icon.Button
            name='ios-menu'
            size={25}
            backgroundColor='#009387'
            onPress={() => {
              navigation.toggleDrawer();
            }}
          ></Icon.Button>
        ),
      }}
    />
  </HomeStack.Navigator>
);

const DetailsStackScreen = ({ navigation }) => (
  <DetailsStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#1f65ff',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}
  >
    <DetailsStack.Screen
      name='Shared'
      component={DetailsScreen}
      options={{
        headerLeft: () => (
          <Icon.Button
            name='ios-menu'
            size={25}
            backgroundColor='#1f65ff'
            onPress={() => navigation.toggleDrawer()}
          ></Icon.Button>
        ),
      }}
    />
  </DetailsStack.Navigator>
);
