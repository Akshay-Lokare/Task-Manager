import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';  

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Home from './screens/home';
import AddTasks from './screens/addTasks';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = 'home'; 
            } else if (route.name === 'AddTasks') {
              iconName = 'plus';  
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen 
          name="Home" 
          component={Home}
          options={{ tabBarLabel: 'Home' }}  
        />
        <Tab.Screen 
          name="AddTasks" 
          component={AddTasks}
          options={{ tabBarLabel: 'Add Tasks' }}  
        />

      </Tab.Navigator>
    </NavigationContainer>
  );
}
