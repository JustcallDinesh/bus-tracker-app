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

const AddScreen = () => {
  const [busName, setBusName] = useState("");
  const [busNumber, setBusNumber] = useState("");

  const [busType, setbusType] = useState([]);
  const [amenities, setAmenities] = useState([]);

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

  // console.log(fromDepartureTime.toLocaleTimeString());

  const busTypeOptions = [
    { label: "Normal ", value: "Normal " },
    { label: "Government ", value: "Government " },
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
  const onFromTimeChange = (event, selectedDate) => {
    const currentDate = selectedDate || fromDepartureTime;
    setShowFromTimePicker(Platform.OS === 'ios');
    setFromDepartureTime(currentDate);
  }

  const onToTimeChange = (event, selectedDate) => {
    const currentDate = selectedDate || toArrivalTime;
    setShowToTimePicker(Platform.OS === 'ios');
    setToArrivalTime(currentDate);
  }

  const handleFromTimePicker = () => {
    setShowFromTimePicker(true)
  }
  const handleToTimePicker = () => {
    setShowToTimePicker(true)
  }


  const handleAddRouteSegment = () => {

    if (!fromCityName || !toCityName) {
      Alert.alert("Error", "Please fill city names");
      return;
    }

    let fromLat: number | null = null;
    let fromLon: number | null = null;
    let toLat: number | null = null;
    let toLon: number | null = null;

    if (fromLatitude && fromLongitude) {
      const parsedFromLat = parseFloat(fromLatitude);
      const parsedFromLon = parseFloat(fromLongitude);

      if (isNaN(parsedFromLat) || isNaN(parsedFromLon)) {
        Alert.alert("Error", "Invalid 'from' latitude or longitude values");
        return;
      }

      fromLat = parsedFromLat;
      fromLon = parsedFromLon;
    }

    if (toLatitude && toLongitude) {
      const parsedToLat = parseFloat(toLatitude);
      const parsedToLon = parseFloat(toLongitude);

      if (isNaN(parsedToLat) || isNaN(parsedToLon)) {
        Alert.alert("Error", "Invalid 'to' latitude or longitude values");
        return;
      }

      toLat = parsedToLat;
      toLon = parsedToLon;
    }

    const newSegment = {
      from: {
        cityName: fromCityName,
        departureTime: fromDepartureTime,
        latitude: fromLat,
        longitude: fromLon,
        arrivalTime: null,
      },
      to: {
        cityName: toCityName,
        arrivalTime: toArrivalTime,
        latitude: toLat,
        longitude: toLon,
        departureTime: null
      },
    };

    setBusRoute([...busRoute, newSegment]);

    setFromCityName("");
    setFromLatitude("");
    setFromLongitude("");
    // setFromDepartureTime('');
    setToCityName("");
    setToLatitude("");
    setToLongitude("");

  };

  const handleAddStop = () => {
    if (!newStopName) {
      Alert.alert("Error", "Please fill stop name, latitude, and longitude");
      return;
    }
    let stopLat: number | null = null;
    let stopLon: number | null = null;
    if (showLatLonFields) {
      if (newStopLatitude && newStopLongitude) {
        const parsedLat = parseFloat(newStopLatitude);
        const parsedLon = parseFloat(newStopLongitude);

        if (isNaN(parsedLat) || isNaN(parsedLon)) {
          Alert.alert("Error", "Invalid latitude or longitude values for stop");
          return;
        }

        stopLat = parsedLat;
        stopLon = parsedLon;
      }
    }

    setBusStops([
      ...busStops,
      { name: newStopName, latitude: stopLat, longitude: stopLon },
    ]);
    setNewStopName("");
    setNewStopLatitude("");
    setNewStopLongitude("");

    // console.log(stopLat,stopLon);
  };

  const handleAddBus = async () => {
    try {
      const response = await axios.post(`${config.apibaseUrl}/addBus`, {
        busName,
        busNumber,
        busType,
        amenities,
        busRoute,
        busStops,
        isGovernt,
        busImageUri,
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

      <View style={styles.switchContainer}>
        <Text style={styles.text}>
          {isGovernt ? "Government Bus " : "Private Bus "}
        </Text>
        <Switch color="teal" value={isGovernt} onValueChange={setisGovernt} />
      </View>


      <View style={styles.RouteContainer}>
        <View style={styles.space}>
          <Text style={styles.subtitle}>Route Segments</Text>
          <TouchableOpacity
            style={styles.buttonhide}
            onPress={() => {
              setShowLatLonFieldsForroute(!showLatLonFieldsForroute);
            }}
          >
            <View style={styles.buttonContent}>
              <Icon
                name={showLatLonFieldsForroute ? 'caret-down-outline' : 'caret-forward-outline'}
                size={20}
                color="#143D60"
              />
              <Text style={styles.buttonTextfrOP}>
                {showLatLonFieldsForroute ? ' Hide Latitude/Longitude' : ' Add Latitude/Longitude'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>


        <View style={styles.etho}>
          <View style={styles.fromfull}>
            <TextInput
              style={styles.inputForselectTime1}
              placeholder="From Location "
              value={fromCityName}
              onChangeText={setFromCityName}
            />
            <TouchableOpacity onPress={handleFromTimePicker}>
              <TextInput
                style={styles.inputForselectTime2}
                placeholder="Departure Time (HH:MM)"
                value={
                  fromDepartureTime instanceof Date && !isNaN(fromDepartureTime)
                    ? fromDepartureTime.toLocaleTimeString('en-IN', { // Use 'en-IN' for India
                      hour: 'numeric',
                      minute: 'numeric',
                      hour12: true,
                    })
                    : "Select Time" // Default placeholder
                } // Display formatted time
                editable={false} // Disable text input
              />
            </TouchableOpacity>

            {showFromTimePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={fromDepartureTime instanceof Date ? fromDepartureTime : new Date()}
                mode="time"
                is24Hour={false}
                display='default'
                onChange={onFromTimeChange}
              />
            )}

          </View>
          {showLatLonFieldsForroute && (
            <View style={styles.latlon}>
              <TextInput
                style={styles.inputLL}
                placeholder="From Latitude"
                value={fromLatitude}
                onChangeText={setFromLatitude}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.inputRR}
                placeholder="From Longitude"
                value={fromLongitude}
                onChangeText={setFromLongitude}
                keyboardType="numeric"
              />
            </View>
          )}

          <View style={styles.fromfull}>
            <TextInput
              style={styles.inputForselectTime1}
              placeholder="To Location"
              value={toCityName}
              onChangeText={setToCityName}
            />
            <TouchableOpacity onPress={handleToTimePicker}>
              <TextInput
                style={styles.inputForselectTime2}
                placeholder="Arrival Time (HH:MM)"
                value={
                  toArrivalTime instanceof Date && !isNaN(toArrivalTime)
                    ? toArrivalTime.toLocaleTimeString('en-IN', { // Use 'en-IN' for India
                      hour: 'numeric',
                      minute: 'numeric',
                      hour12: true,
                    })
                    : "Select Time" // Default placeholder
                }// Display formatted time
                editable={false} // Disable text input
              />
            </TouchableOpacity>

            {showToTimePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={toArrivalTime instanceof Date ? toArrivalTime : new Date()}
                mode="time"
                is24Hour={false}
                display="default"
                onChange={onToTimeChange}
              />
            )}

          </View>
          {showLatLonFieldsForroute && (
            <View style={styles.latlon}>
              <TextInput
                style={styles.inputLL}
                placeholder="To Latitude"
                value={toLatitude}
                onChangeText={setToLatitude}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.inputRR}
                placeholder="To Longitude"
                value={toLongitude}
                onChangeText={setToLongitude}
                keyboardType="numeric"
              />
            </View>
          )}
        </View>
        {busRoute.map((segment, index) => (
          <View key={index} style={styles.segmentItem}>
            <Text style={styles.font}>
              Segment {index + 1}: From ({segment.from.cityName}), To ({segment.to.cityName})
            </Text>
          </View>
        ))}

        <TouchableOpacity
          style={styles.button}
          onPress={handleAddRouteSegment}
        >
          <Text style={styles.buttonText}>Add Route Segment</Text>
        </TouchableOpacity>

      </View>


      <View style={styles.RouteContainer}>

        <View style={styles.space}>
          <Text style={styles.subtitle}>Bus Stops Segments</Text>

          <Tooltip
            isVisible={showTooltip} // State variable to control tooltip visibility
            content={<Text>Enter latitude & longitude for precise stop location  </Text>}
            placement="top" // Tooltip placement
            onClose={() => setShowTooltip(false)} // Close tooltip
            contentStyle={styles.tooltipContent} // Style for tooltip content
            arrowStyle={styles.tooltipArrow} // Style for tooltip arrow
            backgroundStyle={styles.tooltipBackground} // Style for tooltip background
            ref={tooltipRef} // Attach the ref
          >
            <TouchableOpacity
              style={styles.buttonhide}
              onPress={() => {
                setShowLatLonFields(!showLatLonFields);
                setShowTooltip(!showTooltip); // Toggle tooltip visibility
                setTimeout(() => {
                  setShowTooltip(false);
                }, 2000)
              }}
            >
              <View style={styles.buttonContent}>
                <Icon
                  name={showLatLonFields ? 'caret-down-outline' : 'caret-forward-outline'}
                  size={20}
                  color="#143D60"
                />
                <Text style={styles.buttonTextfrOP}>
                  {showLatLonFields ? ' Hide Latitude/Longitude' : ' Add Latitude/Longitude'}
                </Text>
              </View>
            </TouchableOpacity>
          </Tooltip>

        </View>

        <View style={styles.etho}>
          <View style={styles.fromfull2}>
            <TextInput
              style={styles.inputForStop}
              placeholder="Stop Name,enter with dist"
              value={newStopName}
              onChangeText={setNewStopName}
              keyboardType='ascii-capable'
              keyboardAppearance='default'
            />
          </View>

          {/* Button to toggle optional fields */}
          {showLatLonFields && (
            <View style={styles.latlon}>
              <TextInput
                style={styles.inputLL}
                placeholder=" Latitude : (Optional)"
                value={newStopLatitude}
                onChangeText={setNewStopLatitude}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.inputRR}
                placeholder=" Longitude : (Optional)"
                value={newStopLongitude}
                onChangeText={setNewStopLongitude}
                keyboardType="numeric"
              />
            </View>
          )}
        </View>


        {busStops.map((stop, index) => (
          <View key={index} style={styles.segmentItem}>
            <Text>
              Stop {index + 1}: {stop.name}
            </Text>
          </View>
        ))}
        <TouchableOpacity style={styles.button} onPress={handleAddStop}>
          <Text style={styles.buttonText}>Add Bus Stop </Text>
        </TouchableOpacity>

      </View>

      <TouchableOpacity style={styles.buttonSummit} onPress={handleAddBus}>
        <Text style={styles.buttonText}>SUBMIT</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'aliceblue'
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
    // color: '#EB5A3C',
    // backgroundColor: "#99BC85",


  },
  inputForselectTime1: {
    borderWidth: 1,
    borderColor: "teal",
    padding: 13,
    marginBottom: 8,
    borderRadius: 5,
    fontStyle: 'italic',
    fontWeight: 'bold',
    flex: 1,
    marginLeft: 10,
    // justifyContent: 'space-around',
    marginTop: 5,

  },
  inputForselectTime2: {
    borderWidth: 1,
    borderColor: "teal",
    padding: 13,
    marginBottom: 8,
    borderRadius: 5,
    fontStyle: 'italic',
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
    marginTop: 5,
    color: 'grey'

  },
  inputLL: {
    fontStyle: 'italic',
    flex: 1,
    borderWidth: 1,
    borderColor: "teal",
    marginLeft: 10,
    padding: 10,
    marginBottom: 10,
    borderRadius: 3,
    fontWeight: 'bold',
    backgroundColor: "#99BC85",
    // elevation: 5,

  },
  inputRR: {
    backgroundColor: "#99BC85",
    fontStyle: 'italic',
    flex: 1,
    borderWidth: 1,
    borderColor: "teal",
    marginRight: 10,
    padding: 10,
    marginBottom: 10,
    borderRadius: 3,
    fontWeight: 'bold',
    // backgroundColor: "#99BC85"
  },
  inputForStop: {
    borderWidth: 1,
    borderColor: "teal",
    padding: 13,
    marginBottom: 5,
    borderRadius: 5,
    fontStyle: 'italic',
    fontWeight: 'bold',
    flex: 1,
    backgroundColor: "aliceblue",
    marginTop: 5,
  },
  buttonSummit: {
    backgroundColor: 'teal',
    padding: 15,
    alignItems: "center",
    borderRadius: 30,
    marginTop: 0,
    elevation: 3,
  },
  etho: {
    // backgroundColor: 'red',
    // alignItems: 'center'
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'teal',
    // borderStyle: 'dashed'
  },

  inputfrom: {
    marginBottom: 5,
  },
  latlon: {
    display: "flex",
    gap: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // backgroundColor: 'red'
  },
  latlon2: {
    display: "flex",
    gap: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: 'red'
  },
  button: {
    backgroundColor: 'orange',
    padding: 15,
    alignItems: "center",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginTop: 0,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontStyle: 'italic',
    fontWeight: 'bold',

  },
  buttonTextfrOP: {
    fontSize: 14,
    fontStyle: 'italic',
    fontWeight: 'bold',
    // color: 'white'
    textTransform: 'uppercase'
  },
  text: {
    paddingLeft: 15,
    fontSize: 16,
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: 'teal',
    borderRadius: 5,
    // backgroundColor: "#99BC85",//========================================

  },
  RouteContainer: {
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 5,

    overflow: 'hidden',

    // backgroundColor: '#F5F5F5',

  },
  space: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#143D60',
  },
  buttonhide: {
    padding: 1,
    paddingHorizontal: 7,
    marginBottom: 10,
    alignSelf: 'flex-start',
    backgroundColor: '#FBA518',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20
  },
  buttonContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fromfull: {
    flexDirection: 'row',
    gap: 5,
    // borderLeftWidth: 1,
    // borderRightWidth: 1,
    // borderColor: 'teal',

  },
  fromfull2: {
    flexDirection: 'row',
    gap: 5,
    paddingHorizontal: 10,
    marginBottom: 5
    // borderLeftWidth: 1,
    // borderRightWidth: 1,
    // borderColor: 'teal',

  },
  checkboxContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 10,
    // borderWidth: 1,
    // borderColor: "#ccc",
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
  disabledButton: {
    backgroundColor: 'gray',
  },
  segmentItem: {
    marginTop: 0,
    // marginBottom: 10,
    backgroundColor: 'rgba(34, 107, 63, 0.5)',

    borderWidth: 1,
    borderColor: "teal",
    padding: 10,
    // marginVertical: 5,
  },
  font: {
    fontSize: 16,
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
  tooltipContent: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
  },
  tooltipArrow: {
    borderTopColor: '#fff',
  },
  tooltipBackground: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
//AIzaSyC2w9WiuqlFqCpEsfGsQ79Ybap1TE4szJI
export default AddScreen;
