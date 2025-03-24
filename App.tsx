import React from 'react';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/screen/User/AppNavigator';
import { createStackNavigator } from '@react-navigation/stack';



const Stack = createStackNavigator();

export default function App() {
  return (
    <>
      <StatusBar style="auto" backgroundColor='rgba(180, 180, 180, 0.28)' />
      <AppNavigator />

    </>
  );
}