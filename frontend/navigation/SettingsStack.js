// import React from 'react';
// import { createStackNavigator } from '@react-navigation/stack';
// import SettingsScreen from '../screens/SettingsScreen';
// import ReportIncidentScreen from '../screens/ReportIncidentScreen';

// const Stack = createStackNavigator();

// const SettingsStack = () => {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen name="SettingsMain" component={SettingsScreen} options={{ title: 'Settings' }} />
//       <Stack.Screen name="ReportIncident" component={ReportIncidentScreen} options={{ title: 'Report an Incident' }} />
//     </Stack.Navigator>
//   );
// };

// export default SettingsStack;

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import SettingsScreen from '../screens/SettingsScreen';
import ScheduleScreen from '../screens/ScheduleScreen';

const Stack = createStackNavigator();

const SettingsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="SettingsHome" component={SettingsScreen} options={{ title: 'Settings' }} />
      <Stack.Screen name="Schedule" component={ScheduleScreen} options={{ title: 'My Schedule' }} />
    </Stack.Navigator>
  );
};

export default SettingsStack;
