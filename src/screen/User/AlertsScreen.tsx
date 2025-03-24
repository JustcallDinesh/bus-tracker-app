import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, ScrollView } from 'react-native';
import CommunityUpdates from '../Components/CommunityUpdates';
import { communityUpdatesData } from '../../utils/communityUpdatesData';

const NotificationScreen = () => {
  const [showSimpleAlert, setShowSimpleAlert] = useState(false);
  const [showCustomAlert, setShowCustomAlert] = useState(false);

  const triggerSimpleAlert = () => {
    Alert.alert('Simple Alert', 'This is a basic alert message.');
  };

  const triggerCustomAlert = () => {
    Alert.alert(
      'Custom Alert Title',
      'This is a custom alert with buttons.',
      [
        {
          text: 'Cancel',
          style: 'cancel', // 'cancel' will style button differently
        },
        { text: 'OK' },
      ],
      { cancelable: false } // Prevent closing the alert by tapping outside
    );
  };

  // <Button title="Show Simple Alert" onPress={triggerSimpleAlert} />
  // <Button title="Show Custom Alert" onPress={triggerCustomAlert} />
  // <Text>{showSimpleAlert ?"Conditional Alert" : "yetho onnu"}</Text>
  return (
    <ScrollView style={styles.container}>
      <CommunityUpdates updates={communityUpdatesData} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    padding: 8,
    backgroundColor: 'aliceblue'
  },
});

export default NotificationScreen;
