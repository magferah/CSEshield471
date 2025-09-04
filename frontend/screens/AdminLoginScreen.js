import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";

export default function AdminLoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAdminLogin = () => {
    if (email === "admin@example.com" && password === "admin123") {
      Alert.alert("Success", "Admin login successful");
      navigation.replace("AdminDashboard"); // <-- create AdminDashboard screen
    } else {
      Alert.alert("Error", "Invalid admin credentials");
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-black px-6">
      <Text className="text-green-400 text-2xl font-bold mb-6">
        Admin Login
      </Text>

      <TextInput
        placeholder="Admin Email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        className="w-full bg-white text-black px-4 py-3 rounded-lg mb-4"
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#999"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        className="w-full bg-white text-black px-4 py-3 rounded-lg mb-6"
      />

      <TouchableOpacity
        onPress={handleAdminLogin}
        className="bg-green-500 px-6 py-3 rounded-2xl"
      >
        <Text className="text-white font-bold text-lg">Login as Admin</Text>
      </TouchableOpacity>
    </View>
  );
}
