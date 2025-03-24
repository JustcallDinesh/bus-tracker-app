import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import MapView, { Marker, Region, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";

interface MapScreenProps {
  route: {
    legs: any;
    params: {
      selectedRoute: {
        busRoute: {
          from: { latitude: number; longitude: number; cityName: string };
          to: { latitude: number; longitude: number; cityName: string };
        }[];
        busStops: { name: string; latitude: number; longitude: number }[];
      };
    };
  };
}

const MapScreen: React.FC<MapScreenProps> = ({ route }) => {
  const [region, setRegion] = useState<Region | null>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [directions, setDirections] = useState<any[]>([]); // Store direction coordinates
  const [selectedRoute, setSelectedRoute] = useState(route.params?.selectedRoute);



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
        setError("Turn On loction. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);


  // Helper function for geocoding
  const handleGeocoding = async (locationName: string) => {
    try {
      const geocodingResponse = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${locationName},India&key=AIzaSyC2w9WiuqlFqCpEsfGsQ79Ybap1TE4szJI` // Replace YOUR_API_KEY
      );
      if (geocodingResponse.data.results && geocodingResponse.data.results.length > 0) {
        // console.log(`inside The helper Function${locationName}`,geocodingResponse.data.results[0].geometry.location);
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


  useEffect(() => {
    const fetchDirections = async () => {
      if (route.params?.selectedRoute?.busRoute && route.params?.selectedRoute?.busRoute.length > 0) {

        let from = { ...route.params.selectedRoute.busRoute[0].from };
        let to = { ...route.params.selectedRoute.busRoute[0].to };

        // Geocode 'from' location if coordinates are missing
        if (!from.latitude || !from.longitude) {
          const fromCoordinates = await handleGeocoding(from.cityName);
          if (fromCoordinates) {
            from.latitude = fromCoordinates.lat;
            from.longitude = fromCoordinates.lng;
            // console.log("From (after geocoding):", from); // Log updated from
          } else {
            console.log(`Could not geocode 'from' location: ${from.cityName}`); // Exit if geocoding fails for 'from'
          }
        }

        // Geocode 'to' location if coordinates are missing
        if (!to.latitude || !to.longitude) {
          const toCoordinates = await handleGeocoding(to.cityName);
          if (toCoordinates) {
            to.latitude = toCoordinates.lat;
            to.longitude = toCoordinates.lng;
            // console.log("To (after geocoding):", to); // Log updated to
          } else {
            console.error(`Could not geocode 'to' location: ${to.cityName}`);
            return; // Exit if geocoding fails for 'to'
          }
        }

        const updatedBusRoute = [{
          from: from,
          to: to,
        }];

        const updatedBusStopsPromises = route.params.selectedRoute.busStops.map(async (stop) => {
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
        const validBusStops = updatedBusStops.filter(stop => stop && stop.latitude !== null && stop.longitude !== null);


        const updatedSelectedRoute = {
          ...route.params.selectedRoute,
          busRoute: updatedBusRoute,
          busStops: validBusStops,
        };

        setSelectedRoute(updatedSelectedRoute);
        const waypointsString = validBusStops.map((stop) => `${stop.latitude},${stop.longitude}`).join("|");

        try {
          const response = await axios.get(
            `https://maps.googleapis.com/maps/api/directions/json?origin=${from.latitude},${from.longitude}&destination=${to.latitude},${to.longitude}&waypoints=${waypointsString}&key=AIzaSyC2w9WiuqlFqCpEsfGsQ79Ybap1TE4szJI` // Replace YOUR_API_KEY
          );
          console.log(response);



          if (response.data.routes && response.data.routes.length > 0) {
            const points = response.data.routes[0].overview_polyline.points;
            const decodedPoints = decodePolyline(points);
            setDirections(decodedPoints);

            const distanceInKm = response.data.routes[0].legs[0].distance.value;
            console.log("DISTANCE", distanceInKm);
          }

        } catch (err) {
          console.error("Error fetching directions:", err);
          setError("Error fetching directions.");
        }
      }
    };

    fetchDirections();
  }, [route.params?.selectedRoute]);

  if (!selectedRoute) {
    // Show user location if no route data
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

          {selectedRoute.busStops.map((stop, index) => {
            if (stop && stop.latitude !== null && stop.longitude !== null) {
              return (
                <Marker
                  key={index}
                  coordinate={{ latitude: stop.latitude, longitude: stop.longitude }}
                  title={stop.name}
                  image={require('../Components/asset/pin.png')}
                />
              );
            }
            return null;
          })}
          {route.params?.selectedRoute.busRoute &&
            selectedRoute.busRoute.map((routeItem, index) => (
              <View key={`route-item-${index}`}>
                <Marker
                  key={`from-${index}`}
                  coordinate={{
                    latitude: routeItem.from.latitude,
                    longitude: routeItem.from.longitude,
                  }}
                  title={`From: ${routeItem.from.cityName}`}
                  image={require('../Components/asset/locationf.png')}
                />
                <Marker
                  key={`to-${index}`}
                  coordinate={{
                    latitude: routeItem.to.latitude,
                    longitude: routeItem.to.longitude,
                  }}
                  title={`To: ${routeItem.to.cityName}`}
                  image={require('../Components/asset/locationt.png')}
                />
              </View>
            ))}
          {directions.length > 0 && (
            <Polyline coordinates={directions} strokeWidth={6} strokeColor="#4B70F5" />
          )}
        </MapView>
      ) : null}
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

export default MapScreen;