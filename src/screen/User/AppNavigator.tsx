import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";

// Auth Screens

// User Screens
import MapScreen from "./MapScreen";
import RoutesScreen from "./RoutesScreen";
import AlertsScreen from "./AlertsScreen";
import HomeScreen from "./HomeScreen";
import AddScreen from "./AddScreen";
import UserProfileScreen from "./UserProfileScreen";
import RegisterScreen from "./RegisterScreen";
import LoginScreen from "./LoginScreen";
import SearchResultsScreen from "./SearchResultsScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const UserTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          RoutesScreen;

          switch (route.name) {
            case "Map":
              iconName = focused ? "map" : "map-outline";
              break;
            case "Routes":
              iconName = focused ? "bus" : "bus-outline";
              break;
            case "Alerts":
              iconName = focused ? "notifications" : "notifications-outline";
              break;
            case "Add":
              iconName = focused ? "add-circle" : "add-circle-outline";
              break;
            case "Profile":
              iconName = focused ? "person" : "person-outline";
              break;
            default:
              iconName = "help";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Routes" component={RoutesScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Add" component={AddScreen} />
      <Tab.Screen name="Alerts" component={AlertsScreen} />
      <Tab.Screen name="Profile" component={UserProfileScreen} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const isAuthenticated = false; // Replace with actual auth state

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          // Auth Stack
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="MainApp" component={UserTabs} />
            <Stack.Screen name="SearchResults" component={SearchResultsScreen} />
            <Stack.Screen name="Map" component={MapScreen} />

          </>
        ) : (
          // User Stack
          <></>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
