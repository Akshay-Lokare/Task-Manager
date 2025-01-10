import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';  
import { View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './screens/home';
import AddTasks from './screens/addTasks';
import Tasks from './screens/tasks';
import Login from './screens/login';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          let iconName = route.name === 'Home' ? 'home' : 'plus';
          return <Icon name={iconName} size={30} color={color} />;
        },
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarLabel: '',
        tabBarActiveTintColor: 'purple',
        tabBarInactiveTintColor: 'grey',
        tabBarStyle: {
          backgroundColor: '#f5f5f5',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        }
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="AddTasks" component={AddTasks} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen 
          name="MainTabs" 
          component={TabNavigator} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Login" 
          component={Login}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="Tasks" 
          component={Tasks}
          options={{
            headerShown: false,
            presentation: 'card'
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
