// frontend/views/screens/Emergency/QuestionsScreen.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';

const QuickQuestionsScreen = ({ navigation }) => {
  const [inVehicle, setInVehicle] = useState(null);
  const [isFollowed, setIsFollowed] = useState(null);
  const [offender, setOffender] = useState(null);

  const handleSubmit = () => {
    if (inVehicle === null || isFollowed === null || offender === null) {
      alert('Please answer all questions before submitting.');
      return;
    }

    // Navigate to GuidanceScreen with answers
    navigation.navigate('Guidance', {
      answers: { inVehicle, isFollowed, offender }
    });
  };

  const renderOption = (label, value, selectedValue, setSelected) => (
    <TouchableOpacity
      style={[
        styles.optionButton,
        selectedValue === value && styles.optionSelected
      ]}
      onPress={() => setSelected(value)}
    >
      <Text
        style={[
          styles.optionText,
          selectedValue === value && styles.optionTextSelected
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerText}>
        YOUR ANSWERS WILL GET US A CLEAR PICTURE!
      </Text>
      <Text style={styles.subText}>
        Don’t worry! We will get through this, TOGETHER!
      </Text>

      {/* Q1 */}
      <Text style={styles.question}>ARE YOU IN VEHICLE?</Text>
      <View style={styles.row}>
        {renderOption('YES', 'yes', inVehicle, setInVehicle)}
        {renderOption('NO', 'no', inVehicle, setInVehicle)}
      </View>

      {/* Q2 */}
      <Text style={styles.question}>IS SOMEONE FOLLOWING YOU?</Text>
      <View style={styles.row}>
        {renderOption('YES', 'yes', isFollowed, setIsFollowed)}
        {renderOption('NO', 'no', isFollowed, setIsFollowed)}
      </View>

      {/* Q3 */}
      <Text style={styles.question}>WHO IS OFFENDER?</Text>
      <View style={styles.row}>
        {renderOption('DRIVER', 'driver', offender, setOffender)}
        {renderOption('PASSENGER', 'passenger', offender, setOffender)}
        {renderOption('PASSER-BY', 'passerby', offender, setOffender)}
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>SUBMIT</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // dark background
    padding: 20,
    justifyContent: 'flex-start',
  },
  headerText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  subText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  question: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  optionButton: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginHorizontal: 8,
    borderRadius: 8,
  },
  optionSelected: {
    backgroundColor: '#4CAF50',
  },
  optionText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  optionTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    alignSelf: 'center',
    width: '80%',
  },
  submitText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default QuickQuestionsScreen;
