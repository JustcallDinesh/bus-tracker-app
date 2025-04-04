import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import { StyleSheet, View, Text, ActivityIndicator, Image } from "react-native";
import MapView, { Marker, Region, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";
import config from "../../../config";
import { useNavigation } from '@react-navigation/native'; // Import useNavigation


interface MapScreenProps {
  route: {
    params: {
      selectedRoute: {
        trips: [
          {
            busRoute: {
              from: { latitude: number; longitude: number; cityName: string };
              to: { latitude: number; longitude: number; cityName: string };
            };
            busStops: { name: string; latitude: number; longitude: number }[];
          }
        ];
      };
    };
  };
}

const MapScreen: React.FC<MapScreenProps> = ({ route }) => {
  const [region, setRegion] = useState<Region | null>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [directions, setDirections] = useState<any[]>([]);
  const [selectedRoute, setSelectedRoute] = useState(route.params?.selectedRoute);

  // console.log(" RouteFrom Map Screeen //////////////////", route);
  // console.log(";;;;;;;;;;;;;;;;;;;", route.params.selectedRoute.trips[0].busRoute);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);

      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setError("Permission to access location was denied");
          setLoading(false);
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      } catch (err) {
        console.error("Error getting location:", err);
        setError("Turn On location. Please try again.");
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      // Cleanup function: Reset state on unmount
      setSelectedRoute(
        {
          trips: [{
            busRoute: {
              from: { latitude: 0, longitude: 0, cityName: '' },
              to: { latitude: 0, longitude: 0, cityName: '' },
            },
            busStops: [],
          }],
        }
      );
      setDirections([]);
      setError(null);
      setLoading(false);
    };
  }, [navigation]); // Add navigation as dependency

  useEffect(() => {
    if (selectedRoute) {
      fetchDirections();
    }
  }, [navigation]);

  const handleGeocoding = async (locationName: string) => {
    try {
      const geocodingResponse = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${locationName},India&key=${config.KeyToken}` // Replace YOUR_API_KEY
      );
      if (geocodingResponse.data.results && geocodingResponse.data.results.length > 0) {
        return geocodingResponse.data.results[0].geometry.location;
      } else {
        console.error(`Geocoding failed for ${locationName}`);
        return null;
      }
    } catch (geocodingError) {
      console.error(`Geocoding error for ${locationName}:`, geocodingError);
      return null;
    }
  };

  const fetchDirections = async () => {
    if (selectedRoute && selectedRoute.trips && selectedRoute.trips.length > 0) {
      const trip = selectedRoute.trips[0];
      if (trip.busRoute && trip.busStops) {
        let from = { ...trip.busRoute.from };
        let to = { ...trip.busRoute.to };

        // Geocode 'from' location if coordinates are missing
        if (!from.latitude || !from.longitude) {
          const fromCoordinates = await handleGeocoding(from.cityName);
          if (fromCoordinates) {
            from.latitude = fromCoordinates.lat;
            from.longitude = fromCoordinates.lng;
          } else {
            console.log(`Could not geocode 'from' location: ${from.cityName}`);
          }
        }

        // Geocode 'to' location if coordinates are missing
        if (!to.latitude || !to.longitude) {
          const toCoordinates = await handleGeocoding(to.cityName);
          if (toCoordinates) {
            to.latitude = toCoordinates.lat;
            to.longitude = toCoordinates.lng;
          } else {
            console.error(`Could not geocode 'to' location: ${to.cityName}`);
            return;
          }
        }

        // Geocode busStops if coordinates are missing
        const updatedBusStopsPromises = trip.busStops.map(async (stop) => {
          if (stop.latitude && stop.longitude) {
            return { ...stop };
          } else {
            const geocodingResponse = await handleGeocoding(stop.name);
            if (geocodingResponse) {
              return { ...stop, latitude: geocodingResponse.lat, longitude: geocodingResponse.lng };
            } else {
              console.error(`Geocoding failed for ${stop.name}`);
              return { ...stop, latitude: null, longitude: null };
            }
          }
        });

        const updatedBusStops = await Promise.all(updatedBusStopsPromises);
        const validBusStops = updatedBusStops.filter((stop) => stop && stop.latitude !== null && stop.longitude !== null);

        // Update selectedRoute with geocoded coordinates
        const updatedSelectedRoute = {
          ...selectedRoute,
          trips: [{
            ...trip,
            busRoute: { from: from, to: to }, // Correctly update busRoute as an object
            busStops: validBusStops,
          }],
        };
        setSelectedRoute(updatedSelectedRoute);

        const waypointsString = validBusStops.map((stop) => `${stop.latitude},${stop.longitude}`).join("|");

        try {
          const response = await axios.get(
            `https://maps.googleapis.com/maps/api/directions/json?origin=${from.latitude},${from.longitude}&destination=${to.latitude},${to.longitude}&waypoints=${waypointsString}&key=${config.KeyToken}`
          );

          if (response.data.routes && response.data.routes.length > 0) {
            const points = response.data.routes[0].overview_polyline.points;
            const decodedPoints = decodePolyline(points);
            setDirections(decodedPoints);
          } else {
            console.log("-------------------------------------------------------------");
          }
        } catch (err) {
          console.error("Error fetching directions:", err);
          setError("Error fetching directions.");
        }
      }
    }
  };


  if (!selectedRoute) {
    return (
      <View style={styles.container}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007bff" />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : region ? (
          <MapView style={styles.map} initialRegion={region}>
            <Marker coordinate={region} title="Your Location" image={require('../Components/asset/mylocation.png')} />
          </MapView>
        ) : null}
      </View>
    );
  }

  const busRoute = selectedRoute.trips[0].busRoute;
  const busStops = selectedRoute.trips[0].busStops;

  // Extract coordinates from busRoute object
  const fromCoordinate = {
    latitude: busRoute.from.latitude,
    longitude: busRoute.from.longitude,
  };

  const toCoordinate = {
    latitude: busRoute.to.latitude,
    longitude: busRoute.to.longitude,
  };

  // Create coordinates array for Polyline
  const polylineCoordinates = [fromCoordinate, toCoordinate];

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : region ? (
        <MapView style={styles.map} initialRegion={region}>
          <Marker coordinate={region} title="Your Location" image={require('../Components/asset/mylocation.png')} />

          {busStops
            .filter(stop => stop && stop.latitude !== null && stop.longitude !== null)
            .map((stop, index) => (
              <Marker
                key={index}
                coordinate={{ latitude: stop.latitude, longitude: stop.longitude }}
                title={stop.name}
                image={require('../Components/asset/pin.png')}
              />
            ))}

          {/* Markers for From and To locations */}
          <Marker
            coordinate={fromCoordinate}
            title={`From: ${busRoute.from.cityName}`}
            image={require('../Components/asset/locationf.png')}
          />
          <Marker
            coordinate={toCoordinate}
            title={`To: ${busRoute.to.cityName}`}
            image={require('../Components/asset/locationt.png')}
          />

          {directions && directions.length > 0 && <Polyline coordinates={directions} strokeWidth={6} strokeColor="#4B70F5" />}
        </MapView>
      ) : (
        <View><Text style={styles.errorText}>Something Went Wronge..Please try again..</Text></View>
      )}
    </View>
  );
};


const decodePolyline = (encoded: string): any[] => {
  const points: any[] = [];
  let index = 0, len = encoded.length;
  let lat = 0, lng = 0;

  while (index < len) {
    let b, shift = 0, result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = ((result & 1) !== 0 ? ~(result >> 1) : (result >> 1));
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = ((result & 1) !== 0 ? ~(result >> 1) : (result >> 1));
    lng += dlng;

    points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
  }
  return points;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    fontSize: 16,
    margin: 10,
  },
});

export default memo(MapScreen);