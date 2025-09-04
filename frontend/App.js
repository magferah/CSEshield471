// App.js (in root directory, same level as package.json)
// frontend/App.js
import 'react-native-gesture-handler';
import React from 'react';
import { AppRegistry } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';

function App() {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}

// Register the app component
AppRegistry.registerComponent('main', () => App);

export default App;