import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const pages = [
  {
    title: 'SHIELD',
    description:
      'The safety of women matters a lot — whether at home, outside, or at work.\n\nUsing this app, you can instantly send your live location to family and trusted contacts during emergencies.',
  },
  {
    title: 'SOS & SMS Alerts',
    description:
      'With one tap, send emergency SMS alerts including your current live location to multiple trusted contacts.',
  },
  {
    title: 'Scheduler & Safety Tools',
    description:
      'Plan your daily movements (classes, meetings, travel, etc.) and stay safe with safety guidelines and incident reporting features.',
  },
];

const OnboardingScreen = ({ navigation }) => {
  const [pageIndex, setPageIndex] = useState(0);

  const handleNext = () => {
    if (pageIndex < pages.length - 1) {
      setPageIndex(pageIndex + 1);
    } else {
      navigation.replace('Home');
    }
  };

  const handleSkip = () => {
    navigation.replace('Home');
  };

  const { title, description } = pages[pageIndex];

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>🛡️</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      <View style={styles.pagination}>
        {pages.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, pageIndex === i && styles.activeDot]}
          />
        ))}
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextText}>
            {pageIndex === pages.length - 1 ? 'Got It' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logo: {
    fontSize: 48,
    color: '#76c043',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 20,
    textAlign: 'center',
    textShadowColor: '#aaa',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  description: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  pagination: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ccc',
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#76c043',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    backgroundColor: '#eee',
    elevation: 3,
  },
  skipText: {
    color: '#333',
    fontWeight: '600',
  },
  nextButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    backgroundColor: '#76c043',
    elevation: 5,
  },
  nextText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
