import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

export default function SettingsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Other settings buttons */}
      <Button
        title="My Schedule"
        onPress={() => navigation.navigate('Schedule')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
