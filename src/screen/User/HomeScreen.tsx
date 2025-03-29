import React from 'react';
import { View, Text, Image, Button, StyleSheet } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../Components/asset/get_started_background.jpg')}
        style={styles.backgroundImage} // Use a specific background image style
        resizeMode='cover' // Cover the entire view
      />
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Bus Tracker </Text>
        <Text style={styles.subtitle}>Find Your Bus Easily ! </Text>
      </View>

      <View style={styles.content2}>
        <Text style={styles.Button} onPress={() => navigation.navigate("MainApp")}>Get's Start</Text>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Take up the entire screen
    position: 'relative',
  },
  backgroundImage: {
    position: 'absolute', // Position behind other content
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  maincontent: {
    // Optional: Add a semi-transparent background for content

  },
  content: {
    position: 'absolute',
    top: '35%',
    left: '15%',
    // backgroundColor: 'rgba(5, 5, 5, 0.12)', // Optional: Add a semi-transparent background for content
  },
  content2: {
    position: 'absolute',
    top: '80%',
    left: '15%'
  },
  title: {
    fontSize: 30,
    letterSpacing: 1,
    fontWeight: 900,
    textAlign: 'center',
    fontStyle: 'italic',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    textAlign: 'center',
    fontStyle: 'italic',
    fontWeight: 500,
    fontSize: 15,
    color: 'orange',
    marginBottom: 20,
  },
  Button: {
    textTransform: 'uppercase',
    fontStyle: 'italic',
    letterSpacing: 1,
    fontWeight: 900,
    fontSize: 20,
    color: '#fff',
    backgroundColor: '#007AFF',
    padding: 8,
    paddingHorizontal: 100,
    borderRadius: 4,
    shadowColor: 'black'
  }
});

export default HomeScreen;
