import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  StyleSheet,
  Platform,
} from "react-native";
import axios from "axios";
import { Switch } from "react-native-elements";
import Icon from "react-native-vector-icons/Ionicons";
import Tooltip from "react-native-walkthrough-tooltip";
import config from "../../../config";
import DateTimePicker from "@react-native-community/datetimepicker"
import TripInput from "../Components/TripInput";

interface Location {
  cityName: String;
  latitude: number | null;
  longitude: number | null;
  departureTime: String | Date;
  arrivalTime: String | Date;

}

interface RouteSegment {
  from: Location;
  to: Location;
}

interface BusStop {
  name: String;
  latitude: number | null;
  longitude: number | null;
}
interface Trip {
  busRoute: RouteSegment[];
  busStops: BusStop[];
}

const AddScreen = () => {
  const [busName, setBusName] = useState("");
  const [busNumber, setBusNumber] = useState("");

  const [busType, setbusType] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [capacity, setCapacity] = useState('');

  const [isGovernt, setisGovernt] = useState(true);

  const [busRoute, setBusRoute] = useState<RouteSegment[]>([]);

  const [fromCityName, setFromCityName] = useState("");
  const [fromLatitude, setFromLatitude] = useState("");
  const [fromLongitude, setFromLongitude] = useState("");

  const [toCityName, setToCityName] = useState("");
  const [toLatitude, setToLatitude] = useState("");
  const [toLongitude, setToLongitude] = useState("");

  const [busStops, setBusStops] = useState<BusStop[]>([]);
  const [newStopName, setNewStopName] = useState("");
  const [newStopLatitude, setNewStopLatitude] = useState("");
  const [newStopLongitude, setNewStopLongitude] = useState("");

  const [showLatLonFields, setShowLatLonFields] = useState(false);
  const [showLatLonFieldsForroute, setShowLatLonFieldsForroute] = useState(false);

  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef(null); // Create a ref for the tooltip
  const [busImageUri, setBusImageUri] = useState(null);

  const [fromDepartureTime, setFromDepartureTime] = useState(null); // Initialize with current time
  const [toArrivalTime, setToArrivalTime] = useState(null);


  const [showFromTimePicker, setShowFromTimePicker] = useState(false);
  const [showToTimePicker, setShowToTimePicker] = useState(false);

  const [routeDiasable, setRouteDiasble] = useState(false);

  const [visibleAminities, setVisibleAminities] = useState(false);

  const [trips, setTrips] = useState<Trip[]>([{ busRoute: [], busStops: [] }]);
  const [currentTripIndex, setCurrentTripIndex] = useState(0);

  const busTypeOptions = [
    { label: "Normal ", value: "Normal " },
    { label: "Sleeper ", value: "Sleeper " },
    { label: "Semi-Sleeper ", value: "Semi-Sleeper " },
    { label: "AC Seater ", value: "AC Seater " },
    { label: "Non-AC Seater ", value: "Non-AC Seater " },
    { label: "Luxury ", value: "Luxury " },
  ];
  const amenitiesOptions = [
    { label: "Wifi ", value: "Wifi " },
    { label: "ChargingPort ", value: "ChargingPort " },
    { label: "WaterBottle ", value: "WaterBottle " },
    { label: "Blankets ", value: "Blankets " },
    { label: "ReadingLight ", value: "ReadingLight " },
    { label: "AC ", value: "AC " },
    { label: "TV ", value: "TV " },
  ];

  // const selectImage = async () => {
  //   const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  //   if (status !== 'granted') {
  //     Alert.alert('Sorry, we need camera roll permissions to make this work!');
  //     return;
  //   }

  //   let result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //     allowsEditing: true,
  //     aspect: [4, 3],
  //     quality: 1,
  //     base64:true,
  //   });

  //   if (!result.canceled) {
  //     const base64Image = result.assets[0].base64;
  //     setBusImageUri(`data:image/jpeg;base64,${base64Image}`); // Store the base64 string
  //   }
  // };

  //----------------------------------------------------------------
  const handleAddTrip = () => {
    setTrips((prevTrips) => [...prevTrips, { busRoute: [], busStops: [] }]);
  };

  const handleRemoveTrip = (index: number) => {
    const updatedTrips = trips.filter((_, i) => i !== index);
    setTrips(updatedTrips);
    if (currentTripIndex >= updatedTrips.length && updatedTrips.length > 0) {
      setCurrentTripIndex(updatedTrips.length - 1);
    }
  };

  //----------------------------------------------------------------

  const handleAddBus = async () => {
    try {
      // console.log(trips)
      const response = await axios.post(`${config.apibaseUrl}/addBus`, {
        busName,
        busNumber,
        busType,
        amenities,
        capacity,
        trips, // Send the trips array
        busStops,
        isGovernt,
        // busImageUri,
      });

      if (response.status === 201) {
        Alert.alert("Success", "Bus added successfully");
        setBusName("");
        setBusNumber("");
        setbusType([]);
        setAmenities([]);
        setBusRoute([]);
        setFromDepartureTime(null);
        setToArrivalTime(null);
        setBusStops([]);
        setisGovernt(true);
        setRouteDiasble(false);
      } else {
        Alert.alert("Error", "Failed to add bus");
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to add bus"
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add Bus Informations</Text>

      {/* <TouchableOpacity style={styles.button} onPress={selectImage}>
        <Text style={styles.buttonText}>Select Bus Image</Text>
      </TouchableOpacity>

      {busImageUri && (
        <Image source={{ uri: busImageUri }} style={styles.busImage} />
      )} */}


      <TextInput
        style={styles.input}
        placeholder="Bus Name"
        value={busName}
        onChangeText={setBusName}
      />
      <TextInput
        style={styles.input}
        placeholder="Bus Number"
        value={busNumber}
        onChangeText={setBusNumber}
      />
      <View style={styles.switchContainer}>
        <Text style={styles.text}>
          {isGovernt ? "Government Bus " : "Private Bus "}
        </Text>
        <Switch color="teal" value={isGovernt} onValueChange={setisGovernt} />
      </View>
      <TextInput
        autoComplete='off'
        style={styles.input}
        placeholder="Bus Capacity"
        value={capacity}
        onChangeText={setCapacity}
      />

      <View style={styles.checkboxContainer}>
        <View style={styles.selectBusTitle}><Text style={styles.selectBusheader}>Select Bus Type </Text></View>
        <View style={styles.BusTypeAligh}>
          {busTypeOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.checkboxOption,
                busType.includes(option.value) && styles.selectedOption,
              ]}
              onPress={() => {
                if (busType.includes(option.value)) {
                  setbusType(busType.filter((type) => type !== option.value));
                } else {
                  setbusType([...busType, option.value]);
                }
              }}
            >
              <Text>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      {isGovernt ? null : (
        <View style={styles.checkboxContainer}>
          <View style={styles.selectBusTitle}><Text style={styles.selectBusheader}>Amenities Features </Text></View>
          <View style={styles.BusTypeAligh}>
            {amenitiesOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.checkboxOption,
                  amenities.includes(option.value) && styles.selectedOption,
                ]}
                onPress={() => {
                  if (amenities.includes(option.value)) {
                    setAmenities(amenities.filter((type) => type !== option.value));
                  } else {
                    setAmenities([...amenities, option.value]);
                  }
                }}
              >
                <Text>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <View style={styles.tripHB}>
        <Text style={styles.subtitle}>Trip Details </Text>
        <View style={styles.tripER}>
          <Icon name='add-circle-outline' size={16} color="#143D60" />
          <TouchableOpacity style={styles.AddTripBtn} onPress={handleAddTrip}>
            <Text style={styles.tripTitle}>Add Trip </Text>
          </TouchableOpacity>
        </View>
      </View>



      <ScrollView horizontal={true}
        contentContainerStyle={styles.Feildcontainer}
        showsHorizontalScrollIndicator={false}
      >
        {trips.map((trip, index) => (

          <TripInput key={index} trip={trip} setTrips={setTrips} index={index} trips={trips}
            handleRemoveTrip={handleRemoveTrip}
          />


        ))}
      </ScrollView>

      <TouchableOpacity style={styles.buttonSummit} onPress={handleAddBus}>
        <Text style={styles.buttonText}>SUBMIT</Text>
      </TouchableOpacity>
    </ScrollView >
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'aliceblue'
  },
  Feildcontainer: {
    flexGrow: 1
  },
  mapall: {
    zIndex: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    fontStyle: 'italic',
    color: '#212121'

  },
  subtitle: {
    paddingLeft: 2,
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 5,
    marginBottom: 5,
    fontStyle: 'italic',
    color: 'white',
    marginLeft: 5,
  },
  busImage: {
    width: 200,
    height: 200,
    marginTop: 10,
    borderRadius: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "teal",
    padding: 13,
    marginBottom: 10,
    borderRadius: 5,
    fontStyle: 'italic',
    fontWeight: 'bold',
    flex: 1,

  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: 'teal',
    borderRadius: 5,
    marginBottom: 10

  },
  text: {
    paddingLeft: 15,
    fontSize: 16,
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
  checkboxContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 10,

    backgroundColor: '#143D60',//fav--------------------------------------------
    borderRadius: 6,
    overflow: 'hidden',
  },
  selectBusTitle: {
    left: 2,
    marginBottom: 0,
  },
  selectBusheader: {
    fontSize: 18,
    fontStyle: 'italic',
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 5,
    paddingVertical: 1,
  },
  checkboxOption: {
    borderWidth: 1,
    borderColor: 'teal',
    borderRadius: 5,
    padding: 8,
    margin: 3,
    marginLeft: 10,
    marginRight: 8,
    // width:85,
    backgroundColor: '#fff',

  },
  BusTypeAligh: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderColor: "teal",
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    backgroundColor: "aliceblue",
    padding: 5
  },
  selectedOption: {
    backgroundColor: 'rgba(34, 107, 63, 0.5)',
  },
  tripTitle: {
    color: '#000'
  },

  tripHB: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#143D60',
    borderRadius: 3,
    height: 30
  },
  AddTripBtn: {

  },
  tripER: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FBA518',
    padding: 2,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    gap: 8,

  },
  buttonSummit: {
    backgroundColor: 'teal',
    padding: 15,
    alignItems: "center",
    borderRadius: 30,
    marginTop: 0,
    elevation: 3,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontStyle: 'italic',
    fontWeight: 'bold',

  },
  //-----------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------


});
//AIzaSyC2w9WiuqlFqCpEsfGsQ79Ybap1TE4szJI
export default AddScreen;
