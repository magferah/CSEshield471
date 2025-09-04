import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Vibration,
  Animated,
  Dimensions,
} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

const PanicScreen = ({ navigation, route }) => {
  const [user, setUser] = useState(null);
  const [pulseAnim] = useState(new Animated.Value(1));

  // Get user data from route params (passed from login)
  useEffect(() => {
    if (route.params?.user) {
      setUser(route.params.user);
    }
  }, [route.params]);

  // SOS Button pulse animation
  useEffect(() => {
    const startPulse = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };
    startPulse();
  }, []);

  const handleSOSPress = () => {
    Vibration.vibrate([0, 500, 200, 500]);
    
    Alert.alert(
      "Emergency SOS",
      "Are you in immediate danger?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "YES, SEND SOS", style: "destructive", onPress: () => triggerEmergency() }
      ]
    );
  };

  const triggerEmergency = () => {
    Alert.alert("SOS Activated!", "Emergency services and trusted contacts have been notified.");
  };
  
  const handleNotSurePress = () => {
    navigation.navigate('QuickQuestions');
  };

  // Logout handler
  const handleLogout = () => {
    setUser(null); // clear user state
    Alert.alert("Logged out", "You have been logged out successfully.");
    navigation.replace("Login"); // redirect to login
  };

  // Expandable Settings Menu Component
  const ExpandableSettingsMenu = ({ navigation, user }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [animation] = useState(new Animated.Value(0));

    const toggleMenu = () => {
      const toValue = isExpanded ? 0 : 1;
      
      Animated.spring(animation, {
        toValue,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
      
      setIsExpanded(!isExpanded);
    };

    const handleReportIncident = () => {
      setIsExpanded(false);
      Animated.spring(animation, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
      navigation.navigate('ReportIncident');
    };

    const handleViewIncidents = () => {
      setIsExpanded(false);
      Animated.spring(animation, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
      navigation.navigate('ViewIncidents');
    };

    const reportButtonStyle = {
      transform: [
        {
          translateY: animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -70], // Move up by 70 pixels
          }),
        },
        {
          scale: animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1], // Scale from 0 to 1
          }),
        },
      ],
      opacity: animation,
    };

    const viewButtonStyle = {
      transform: [
        {
          translateY: animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -140], // Move up by 140 pixels
          }),
        },
        {
          scale: animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
          }),
        },
      ],
      opacity: animation,
    };

    const mainButtonRotation = {
      transform: [
        {
          rotate: animation.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '45deg'], // Rotate settings icon
          }),
        },
      ],
    };

    return (
      <View style={styles.fabContainer}>
        {/* Report Incident Button */}
        <Animated.View style={[styles.fabButton, styles.reportButton, reportButtonStyle]}>
          <TouchableOpacity
            style={styles.fabButtonInner}
            onPress={handleReportIncident}
            activeOpacity={0.8}
          >
            <FontAwesome name="exclamation-triangle" size={20} color="#fff" />
          </TouchableOpacity>
          <View style={[styles.labelContainer, styles.labelRight]}>
            <Text style={styles.labelText}>Report Incident</Text>
          </View>
        </Animated.View>

        {/* View Incidents Button */}
        <Animated.View style={[styles.fabButton, styles.viewButton, viewButtonStyle]}>
          <TouchableOpacity
            style={styles.fabButtonInner}
            onPress={handleViewIncidents}
            activeOpacity={0.8}
          >
            <FontAwesome name="list" size={20} color="#fff" />
          </TouchableOpacity>
          <View style={[styles.labelContainer, styles.labelRight]}>
            <Text style={styles.labelText}>View Reports</Text>
          </View>
        </Animated.View>

        {/* Main Settings Button */}
        <Animated.View style={[styles.fabButton, styles.mainButton, mainButtonRotation]}>
          <TouchableOpacity
            style={styles.fabButtonInner}
            onPress={toggleMenu}
            activeOpacity={0.8}
          >
            <FontAwesome name="cog" size={24} color="#fff" />
          </TouchableOpacity>
        </Animated.View>

        {/* Overlay to close menu when tapping outside */}
        {isExpanded && (
          <TouchableOpacity
            style={styles.overlay}
            onPress={toggleMenu}
            activeOpacity={1}
          />
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.gradient}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>
            Hi, {user?.name?.toUpperCase() || 'USER'}!
          </Text>
          <Text style={styles.subtitle}>
            We are here to shield you from danger!
          </Text>
        </View>

        {/* Main SOS Button */}
        <View style={styles.sosContainer}>
          <Animated.View style={[styles.sosButtonContainer, { transform: [{ scale: pulseAnim }] }]}>
            <TouchableOpacity
              style={styles.sosButton}
              onPress={handleSOSPress}
              activeOpacity={0.8}
            >
              <View style={styles.sosGradient}>
                <Text style={styles.sosText}>SOS</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Not Sure Button */}
        <TouchableOpacity 
          style={styles.notSureButton}
          onPress={handleNotSurePress}
          activeOpacity={0.7}
        >
          <Text style={styles.notSureText}>
            Not sure what to do? Let us know your danger!
          </Text>
        </TouchableOpacity>

        {/* Help Message */}
        <View style={styles.helpContainer}>
          <Text style={styles.helpText}>We will help you!</Text>
        </View>

        {/* Bottom Navigation Icons */}
        <View style={styles.bottomNav}>
          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => navigation.navigate('Panic')}
          >
            <FontAwesome name="home" size={24} color="#000000ff" />
            <Text style={styles.navLabel}>Home</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => navigation.navigate('TrustedContacts')}
          >
            <FontAwesome name="users" size={24} color="#000000ff" />
            <Text style={styles.navLabel}>Contacts</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => navigation.navigate('LiveLocation', { user: user })}
          >
            <FontAwesome name="map-marker" size={24} color="#000000ff" />
            <Text style={styles.navLabel}>Location</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => navigation.navigate('NearbySafePlaces')}
          >
            <FontAwesome name="building" size={24} color="#000000ff" />
            <Text style={styles.navLabel}>Safe Places</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.navButton}
            onPress={handleLogout}
          >
            <FontAwesome name="sign-out" size={24} color="#100602ff" />
            <Text style={styles.navLabel}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Expandable Settings Menu - replaces the Settings button */}
        <ExpandableSettingsMenu navigation={navigation} user={user} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  gradient: {
    flex: 1,
    backgroundColor: '#f0f9f0',
  },
  header: {
    paddingTop: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 10,
  },
  sosContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  sosButtonContainer: {
    shadowColor: '#539956ff',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 15,
  },
  sosButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    overflow: 'hidden',
  },
  sosGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    backgroundColor: '#539956ff',
  },
  sosText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  notSureButton: {
    backgroundColor: '#333333',
    marginHorizontal: 20,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  notSureText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  helpContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  helpText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#539956ff',
    textAlign: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#539956ff',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
  },
  navButton: {
    padding: 8,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 50,
  },
  navLabel: {
    fontSize: 14,
    color: '#000000ff',
    marginTop: 4,
    textAlign: 'center',
    fontWeight: '500',
  },
  // Floating Action Button Styles
  fabContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 1000,
  },
  fabButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  fabButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  mainButton: {
    backgroundColor: '#4CAF50',
    zIndex: 3,
  },
  reportButton: {
    backgroundColor: '#FF5722',
    zIndex: 2,
  },
  viewButton: {
    backgroundColor: '#2196F3',
    zIndex: 1,
  },
  labelContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  labelRight: {
    marginRight: 8,
  },
  labelText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    whiteSpace: 'nowrap',
  },
  overlay: {
    position: 'absolute',
    top: -Dimensions.get('window').height,
    left: -Dimensions.get('window').width,
    width: Dimensions.get('window').width * 2,
    height: Dimensions.get('window').height * 2,
    zIndex: 0,
  },
});

export default PanicScreen;
