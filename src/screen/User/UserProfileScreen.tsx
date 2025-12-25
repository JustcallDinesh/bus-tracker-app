import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "../../../config";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";

interface UserProfile {
  username: string;
  email: string;
  phone: string;
  profilePicture?: string; // Add profilePicture to the interface
}

const ProfileScreen: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>({
    username: "",
    email: "",
    phone: "",
    profilePicture: "", // Initialize profilePicture
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem("token");
        // console.log(token);
        if (!token) {
          setError("User not logged in.");
          setLoading(false);
          return;
        }

        const response = await axios.get(`${config.apibaseUrl}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Profile Data: ", response.data);
        setProfile(response.data);
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to fetch profile."
        );
        console.log("Error fetching profile: ", err);//
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setProfile({ ...profile, [field]: value });
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        setError("User not logged in.");
        setLoading(false);
        return;
      }

      await axios.put(`${config.apibaseUrl}/profile`, profile, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEditing(false);
      Alert.alert("Success", "Profile updated successfully.");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to update profile."
      );
      console.log("Error updating profile: ", err);
    } finally {
      setLoading(false);
    }
  };

  const hnadleLogOut = async () => {
    setLoading(true);
    setError(null);
    try {
      await AsyncStorage.removeItem("token");
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      console.log("Error on logout ", error);
      Alert.alert("Error", "Failed On Logout ");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Profile</Text>

      {/* Display profile picture or default image */}
      <View style={styles.profileImageContainer}>
        {profile.profilePicture ? (
          <Image
            source={{ uri: profile.profilePicture }}
            style={styles.profileImage}
          />
        ) : (
          <Image
            source={require("../Components/asset/default-user4.jpeg")}
            style={styles.profileImage}
          />
        )}
      </View>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={profile.username}
        onChangeText={(text) => handleInputChange("username", text)}
        editable={editing}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={profile.email}
        onChangeText={(text) => handleInputChange("email", text)}
        editable={editing}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={profile.phone}
        onChangeText={(text) => handleInputChange("phone", text)}
        editable={editing}
        keyboardType="phone-pad"
      />

      {editing ? (
        <Button title="Save" onPress={handleSave} />
      ) : (
        <Button title="Edit Profile" onPress={handleEdit} />
      )}

      <View style={styles.Logoutcontainer}>
        <View style={styles.logSemiContainer}>
          <Icon name={"log-out-outline"} size={20} color="#007bff" />
          <Text style={styles.LogoutText} onPress={hnadleLogOut}>
            LOGOUT{" "}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "aliceblue",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  error: {
    color: "red",
  },
  profileImageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 100,
    borderColor: "#FFF",
    borderWidth: 8,
    elevation: 3,
  },
  Logoutcontainer: {
    // backgroundColor: "yellow",
    padding: 4,
    width: 80,
    position: "absolute",
    right: 20,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
  },
  logSemiContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  LogoutText: {
    fontSize: 12,
    textAlign: "center",
    color: "#007bff",
  },
});
export default ProfileScreen;
