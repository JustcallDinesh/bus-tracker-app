import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import config from '../../../config';
import bcrypt from "bcryptjs";

const RegisterScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [Error, setError] = useState('');
  const [loading, setLoading] = useState(false);


  const handleRegister = async () => {
    if ((!username || !email || !phone || !password)) {
      setError('Please enter all feild');
      setTimeout(() => {
        setError('');
      }, 3000);
    } else {
      try {
        await axios.post(`${config.apibaseUrl}/register`, {
          username,
          email,
          phone,
          password,
          //register
        });
        Alert.alert('Success', 'User registered successfully!');
        navigation.navigate('Login'); // Navigate to login screen
      } catch (error: any) {
        Alert.alert('Error', error.response?.data?.message || 'Registration failed');
      }
    }

  };



  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      {Error ? <Text style={styles.errors}>{Error}</Text> : null}
      <TextInput style={styles.input} placeholder="Username" onChangeText={setUsername} />
      <TextInput style={styles.input} placeholder="Email" onChangeText={setEmail} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Phone" onChangeText={setPhone} keyboardType="phone-pad" />
      <TextInput style={styles.input} placeholder="Password" onChangeText={setPassword} secureTextEntry />
      <Button title="Register" onPress={handleRegister} />
    </View>
  );
};

// ... (styles) ...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  errors: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});

export default RegisterScreen;