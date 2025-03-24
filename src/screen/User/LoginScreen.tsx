import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "../../../config";

const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [Error, setError] = useState("");
  // const navigation = useNavigation();

  const handleLogin = () => {
    // Implement login logic
    axios
      .post(`${config.apibaseUrl}/Login`, { email, password })
      .then((response) => {
        console.log("Login Successfully...");
        const token = response.data.token;
        // console.log("Token Received ", token);
        AsyncStorage.setItem("token", token);
        // console.log("Token Saved to Asyncstorage");
        navigation.navigate("Home");
      })
      .catch((error) => {
        console.log('Login error :', error);
        if (!email || !password) {
          setEmail("Please enter data")
        } else {
          if (error.response && error.response.status === 401) {
            setError("You are enter Wrong Password/Email or Please Register");
            setTimeout(() => {
              setError("");
            }, 3000);
          } else {
            setError("Try Again Later..");
            setTimeout(() => {
              setError("");
            }, 3000);
          }
        }
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Bus Tracker</Text>
        <Text style={styles.subtitle}>Welcome back ! </Text>
        {Error ? <Text style={styles.errors}>{Error}</Text> : null}

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate("Register")}
          style={styles.linkContainer}
        >
          <Text style={styles.link}>Don't have an account? Register </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  errors: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  form: {
    gap: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  Alert: {
    color: "red",
  },
  linkContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  link: {
    color: "#007AFF",
    fontSize: 16,
  },
});

export default LoginScreen;
