import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "../../../config";

const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [Error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // const navigation = useNavigation();

  const handleLogin = async () => {
    if (!email) {
      setError("Please enter the email..");
      return;
    }
    if (!password) {
      setError("Please enter the password..");
      return;
    }

    setLoading(true); // Start loading
    try {
      const response = await axios.post(`${config.apibaseUrl}/login`, {
        email,
        password,
      });


      if (response.status === 200) {
        console.log("Success", "Login successful");
        navigation.navigate("Home");
      } else {
        Alert.alert("Error", "Login failed");
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "Login failed"
      );
      setInterval(() => {
        setError("")

      }, 5000);
    } finally {
      ~~
      setLoading(false); // Stop loading
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Bus Tracker</Text>
        <Text style={styles.subtitle}>Welcome back ! </Text>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size={"small"} color="teal" />
          </View>
        ) : null}
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
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
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
