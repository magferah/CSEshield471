import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import SosSentScreen from '../screens/SosSentScreen';
import DangerInfoScreen from '../screens/DangerInfoScreen'; 
import PeopleScreen from '../screens/PeopleScreen';
import HelpScreen from '../screens/HelpScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ReportIncidentScreen from '../screens/ReportIncidentScreen';
import ViewIncidentsScreen from '../screens/ViewIncidentsScreen';
import LiveLocationScreen from '../screens/LiveLocationScreen';
//import ReceivedAlertsScreen from '../screens/ReceivedAlertsScreen';
const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="SosSent" component={SosSentScreen} />
      <Stack.Screen name="DangerInfo" component={DangerInfoScreen} />
      <Stack.Screen name="People" component={PeopleScreen} />
      <Stack.Screen name="ReportIncident" component={ReportIncidentScreen} />
      <Stack.Screen name="ViewIncidents" component={ViewIncidentsScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Help" component={HelpScreen} />
      
      <Stack.Screen name="Live Location" component={LiveLocationScreen} />
    </Stack.Navigator>
  );
};

export default HomeStack;
