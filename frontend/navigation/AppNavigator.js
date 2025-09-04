// frontend/navigation/AppNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Auth Screens

import LoginScreen from '../views/screens/Auth/LoginScreen';
import SignupScreen from '../views/screens/Auth/SignupScreen';
import AdminLoginScreen from '../views/screens/Auth/AdminLoginScreen';
import AdminDashboardScreen from '../views/screens/Admin/AdminDashboardScreen';


//import AdminDashboard from "./screens/AdminDashboard"; // you create this later

// Emergency Screens
import PanicScreen from '../views/screens/Emergency/PanicScreen';
import QuickQuestionsScreen from '../views/screens/Emergency/QuestionsScreen';
import GuidanceScreen from '../views/screens/Emergency/GuidanceScreen';
import SafetyLibraryScreen from '../views/screens/Emergency/SafetyLibraryScreen';
import ManageRedZonesScreen from '../views/screens/Admin/ManageRedZoneScreen';

// import PoliceStationScreen from '../views/screens/Emergency/PoliceStationScreen';

// Location Screens
import LiveLocationScreen from '../views/screens/Location/LiveLocationScreen';
import ReportIncidentScreen from '../views/screens/ReportIncidentScreen'
import ViewIncidentsScreen from '../views/screens/ViewIncidentsScreen'
//contacts screen
import TrustedContactsScreen from '../views/screens/TrustedContactsScreen';




const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: true }}
    >
      {/* Auth Screens */}
      <Stack.Screen 
        name="Login" 
        component={LoginScreen} 
        options={{
          title: 'Login',
          headerStyle: { backgroundColor: '#4CAF50' },
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen 
        name="Signup" 
        component={SignupScreen}
        options={{
          title: 'Sign Up',
          headerStyle: { backgroundColor: '#4CAF50' },
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen 
        name="AdminLogin" 
        component={AdminLoginScreen}
        options={{
          title: 'Admin Login',
          headerStyle: { backgroundColor: '#4CAF50' },
          headerTintColor: '#fff',
        }}
      />

      {/* Emergency Screens */}
      <Stack.Screen 
        name="Panic" 
        component={PanicScreen}
        options={{
          title: 'Safety Dashboard',
          headerShown: false, // Hide header for main screen
        }}
      />
      <Stack.Screen 
        name="QuickQuestions" 
        component={QuickQuestionsScreen}
        options={{
          title: 'Quick Questions',
          headerStyle: { backgroundColor: '#4CAF50' },
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen 
        name="AdminDashboard" 
        component={AdminDashboardScreen}
        options={{
          headerShown: false,
        }}
/>
      {/* Uncomment later when GuidanceScreen is ready */}     
      <Stack.Screen 
        name="Guidance" 
        component={GuidanceScreen}
        options={{
          title: 'Guidance',
          headerStyle: { backgroundColor: '#4CAF50' },
          headerTintColor: '#fff',
        }}
      />

      {/* Location Screens */}
      { <Stack.Screen 
        name="LiveLocation" 
        component={LiveLocationScreen}
        options={{
          title: 'Live Location Sharing',
          headerStyle: { backgroundColor: '#4CAF50'},
          headerTintColor: '#fff',
        }}
      /> }
      <Stack.Screen name="TrustedContacts" component={TrustedContactsScreen} />
      {/* Incident Report Screens */}
         <Stack.Screen 
        name="ReportIncident"
        component={ReportIncidentScreen}
        options={{ title: 'Report Incident', headerStyle: { backgroundColor: '#4CAF50' }, headerTintColor: '#fff' }}
      />
        <Stack.Screen 
        name="ViewIncidents"
        component={ViewIncidentsScreen}
        options={{ title: 'All Incidents', headerStyle: { backgroundColor: '#4CAF50' }, headerTintColor: '#fff' }}
      /> 

        <Stack.Screen 
        name="ManageRedZones" 
        component={ManageRedZonesScreen}
        options={{ headerShown: false }}
/>    
      {/* <Stack.Screen name="PoliceStations" component={PoliceStationScreen} /> */}
    </Stack.Navigator>
  );
}