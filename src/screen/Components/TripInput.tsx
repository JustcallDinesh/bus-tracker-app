import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    StyleSheet,
    Platform,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
// import Tooltip from "react-native-walkthrough-tooltip";

interface Location {
    cityName: String;
    latitude: number | null;
    longitude: number | null;
    departureTime: String | Date | null;
    arrivalTime: String | Date | null;
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

interface TripInputProps {
    trip: Trip;
    setTrips: React.Dispatch<React.SetStateAction<Trip[]>>;
    index: number;
    trips: any[];
    handleRemoveTrip: (index: number) => void;
}

const TripInput: React.FC<TripInputProps> = ({ trip, setTrips, index, trips, handleRemoveTrip }) => {

    const [fromCityName, setFromCityName] = useState("");
    const [fromLatitude, setFromLatitude] = useState("");
    const [fromLongitude, setFromLongitude] = useState("");
    const [toCityName, setToCityName] = useState("");
    const [toLatitude, setToLatitude] = useState("");
    const [toLongitude, setToLongitude] = useState("");
    const [newStopName, setNewStopName] = useState("");
    const [newStopLatitude, setNewStopLatitude] = useState("");
    const [newStopLongitude, setNewStopLongitude] = useState("");
    const [showLatLonFields, setShowLatLonFields] = useState(false);
    const [showLatLonFieldsForroute, setShowLatLonFieldsForroute] = useState(false);
    const [fromDepartureTime, setFromDepartureTime] = useState<Date | null>(null);
    const [toArrivalTime, setToArrivalTime] = useState<Date | null>(null);
    const [showFromTimePicker, setShowFromTimePicker] = useState(false);
    const [showToTimePicker, setShowToTimePicker] = useState(false);

    const [busRoute, setBusRoute] = useState<RouteSegment[]>([]);
    const [busStops, setBusStops] = useState<BusStop[]>([]);

    const [routeDiasable, setRouteDiasble] = useState(false);
    const [currentTripIndex, setCurrentTripIndex] = useState(0);

    const onFromTimeChange = (event, selectedDate) => {
        const currentDate = selectedDate || fromDepartureTime;
        setShowFromTimePicker(Platform.OS === "ios");
        setFromDepartureTime(currentDate);
    };

    const onToTimeChange = (event, selectedDate) => {
        const currentDate = selectedDate || toArrivalTime;
        setShowToTimePicker(Platform.OS === "ios");
        setToArrivalTime(currentDate);
    };

    const handleFromTimePicker = () => {
        setShowFromTimePicker(true);
    };

    const handleToTimePicker = () => {
        setShowToTimePicker(true);
    }
    // -------------------------------------------------------------------
    const handleClearSegment = (index) => {
        const updatedBusRoute = busRoute.filter((_, i) => i !== index);
        setBusRoute(updatedBusRoute);
        setRouteDiasble(false);
    };
    const handleClearStopSegment = (index) => {
        const updatedBusStop = busStops.filter((_, i) => i !== index);
        setBusStops(updatedBusStop);
    };
    const handleRemove = () => {
        handleRemoveTrip(index);
    }

    // -------------------------------------------------------------------

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
                departureTime: null,
            },
        };
        setBusRoute((prevBusRoute) => [...prevBusRoute, newSegment]);

        setTrips((prevTrips) => {
            const updatedTrips = prevTrips.map((tripItem, tripIndex) => {
                if (tripIndex === index) {
                    return {
                        ...tripItem,
                        busRoute: [...tripItem.busRoute, newSegment],
                    };
                }
                return tripItem;
            });
            return updatedTrips;
        });

        setFromCityName("");
        setFromLatitude("");
        setFromLongitude("");
        setToCityName("");
        setToLatitude("");
        setToLongitude("");
        setFromDepartureTime(null);
        setToArrivalTime(null);
        setRouteDiasble(true);
        // setBusRoute([]);

    };

    const handleAddStop = () => {
        if (!newStopName) {
            Alert.alert("Error", "Please fill stop name");
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

        const newStop = {
            name: newStopName,
            latitude: stopLat,
            longitude: stopLon,
        };

        setBusStops((prevBusStops) => [...prevBusStops, newStop]);

        setTrips((prevTrips) => {
            const updatedTrips = prevTrips.map((tripItem, tripIndex) => {
                if (tripIndex === index) {
                    return {
                        ...tripItem,
                        busStops: [...tripItem.busStops, newStop],
                    };
                }
                return tripItem;
            });
            return updatedTrips;
        });

        setNewStopName("");
        setNewStopLatitude("");
        setNewStopLongitude("");
    };

    return (
        <View style={styles.tripInputContainer}>

            <View style={styles.tripERcontainer}>
                <Text style={styles.tripTitle}>Trip {index + 1}  </Text>
                <View style={styles.tripER}>
                    <TouchableOpacity onPress={handleRemove} style={styles.RemveBtn}>
                        <Icon name='trash-outline' size={16} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>

            <View>

                {/* Route Segments */}
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
                            <TouchableOpacity
                                style={[styles.clearButton]}
                                onPress={() => handleClearSegment(index)}
                            >
                                <Text style={styles.clearButtonText}><Icon name="close-outline" size={14} /></Text>
                            </TouchableOpacity>
                        </View>
                    ))}

                    <TouchableOpacity
                        style={[styles.button, routeDiasable && styles.routeDiasablebutton]}
                        onPress={handleAddRouteSegment}
                        disabled={routeDiasable}
                    >
                        <Text style={styles.buttonText}>Add Route Segment</Text>
                    </TouchableOpacity>

                </View>

                {/* Bus Stops */}
                <View style={styles.RouteContainer}>

                    <View style={styles.space}>
                        <Text style={styles.subtitle}>Bus Stops Segments</Text>


                        <TouchableOpacity
                            style={styles.buttonhide}
                            onPress={() => {
                                setShowLatLonFields(!showLatLonFields);

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


                    </View>

                    <View style={styles.etho}>
                        <View style={styles.fromfull2}>
                            <TextInput
                                style={styles.inputForStop}
                                placeholder="Stop Name,enter with dist"
                                value={newStopName}
                                onChangeText={setNewStopName}
                                keyboardType='name-phone-pad'
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
                            <Text style={styles.stopstext}>
                                Stop {index + 1}: {stop.name}
                            </Text>
                            <TouchableOpacity
                                style={[styles.clearButton]}
                                onPress={() => handleClearStopSegment(index)}
                            >
                                <Text style={styles.clearButtonText}><Icon name="close-outline" size={14} /></Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                    <TouchableOpacity style={styles.button} onPress={handleAddStop}>
                        <Text style={styles.buttonText}>Add Bus Stop </Text>
                    </TouchableOpacity>

                </View>

            </View>



        </View>
    );
};

const styles = StyleSheet.create({
    tripInputContainer: {
        // flex: 1,
        // backgroundColor: 'red',
        // width: '100%',
        width: 370,
        // padding: 20,
        // borderWidth: 1,
        marginRight: 20,
        // minWidth: 300,
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
    routeDiasablebutton: {
        backgroundColor: '#ccc',
        padding: 15,
        alignItems: "center",
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        marginTop: 0,
        borderColor: 'rgba(34, 107, 63, 0.5)',
        borderLeftWidth: 1,
        borderBottomWidth: 1,
        borderRightWidth: 1
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
        marginBottom: 10
        // backgroundColor: "#99BC85",//========================================

    },
    RouteContainer: {
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 5,
        // width: 370,

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
        borderBottomLeftRadius: 20,
        top: 4.5
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
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: "teal",
        padding: 10,
        // marginVertical: 5,
    },
    stopstext: {
        color: 'black'
    },
    clearButton: {
        backgroundColor: 'teal',
        borderRadius: '50%',
        // marginLeft: 10,
    },
    clearButtonText: {
        padding: 5,
        color: 'white',
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
    //-----------------------------stopstext
    tripContainer: {
        // backgroundColor: 'red',
        borderWidth: .5,
    },
    tripTitle: {
        textTransform: "uppercase"
    },
    tripERcontainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // backgroundColor: 'red'
    },
    tripER: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(251, 47, 47, 0.87)',
        padding: 4,
        borderRadius: '50%',

    },
    tripHB: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10
    },
    AddTripBtn: {},
    RemveBtn: {
        // backgroundColor: 'rgba(251, 47, 47, 0.87)',
        // paddingHorizontal: 8,
    },
    RemveBtntxt: {
        color: '#fff'
    },
});


export default TripInput;
