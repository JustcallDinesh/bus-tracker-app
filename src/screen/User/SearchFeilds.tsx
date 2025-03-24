import React, { useState, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Modal,
    FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { Calendar } from "react-native-calendars";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import config from "../../../config";

interface SearchFeildsProbs {
    onSearch: () => void;
}
const SearchFields: React.FC<SearchFeildsProbs> = ({ onSearch }) => {
    const navigation = useNavigation();
    const [fromLocation, setFromLocation] = useState("");
    const [toLocation, setToLocation] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isCalendarVisible, setIsCalendarVisible] = useState(false);


    const fromInputRef = useRef(null);
    const toInputRef = useRef(null);

    const openCalendar = () => {
        setIsCalendarVisible(true);
    };

    const closeCalendar = () => {
        setIsCalendarVisible(false);
    };

    const onDayPress = (day) => {
        setSelectedDate(new Date(day.year, day.month - 1, day.day));
        closeCalendar();
    };

    const swapLocations = () => {
        const temp = fromLocation;
        setFromLocation(toLocation);
        setToLocation(temp);
    };

    const getDatesOfMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const dates = [];
        for (let i = 1; i <= lastDay.getDate(); i++) {
            dates.push(new Date(year, month, i));
        }
        return dates;
    };

    const renderDateItem = ({ item }) => {
        const isSelected = item.toDateString() === selectedDate.toDateString();
        const isToday = item.toDateString() === new Date().toDateString();

        return (
            <TouchableOpacity
                style={[
                    styles.dateButton,
                    isSelected && styles.selectedDateButton,
                    isToday && styles.currentDateButton,
                ]}
                onPress={() => setSelectedDate(item)}
            >
                <Text style={styles.dateText}>{item.getDate()}</Text>
                <Text style={styles.dayText}>
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][item.getDay()]}
                </Text>
            </TouchableOpacity>
        );
    };

    const handleSearch = async () => {
        const from = fromLocation.trim().toLowerCase();
        const to = toLocation.trim().toLowerCase();

        if (!fromLocation.trim() || !toLocation.trim()) {
            alert("Please enter From and To fields");
            return;
        }

        try {
            const response = await axios.get(
                `${config.apibaseUrl}/findRoutes?from=${from}&to=${to}`
            );

            navigation.navigate("SearchResults", {
                from: from,
                to: to,
                date: selectedDate.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                }),
                searchResults: response.data, // Pass the fetched results
            });
        } catch (error) {
            console.error("Error fetching routes:", error);
            alert("Failed to fetch routes. Please try again.");
        }

        fromInputRef.current?.blur();
        toInputRef.current?.blur();

        onSearch();



    };


    return (
        <View style={styles.card}  >
            {/* Leaving From */}
            <View style={styles.section}>
                <Icon name="navigate-sharp" size={24} color="teal" style={styles.icon} />
                <View style={styles.textContainer}>
                    <Text style={styles.label}>Leaving From</Text>
                    <TextInput style={styles.location}
                        value={fromLocation}
                        onChangeText={setFromLocation}
                        ref={fromInputRef}
                    />
                </View>
            </View>

            {/* Going To */}
            <View style={styles.section}>
                <Icon name="location-sharp" size={24} color="teal" style={styles.icon} />
                <View style={styles.textContainer}>
                    <Text style={styles.label}>Going To</Text>
                    <TextInput style={styles.location}
                        value={toLocation}
                        onChangeText={setToLocation}
                        ref={toInputRef}
                    />
                </View>
            </View>

            {/* Swap Button */}
            <TouchableOpacity style={styles.swapButton} onPress={swapLocations}>
                <Icon name="swap-vertical" size={28} color="#fff" />
            </TouchableOpacity>

            {/* Journey Date */}
            <View style={styles.dateSection}>
                <Text style={styles.label}>Journey Date</Text>
                <TouchableOpacity style={styles.dateSelector} onPress={openCalendar}>
                    <Icon name="calendar" size={20} color="#333" />
                    <Text style={styles.monthYear}>
                        {selectedDate.toLocaleDateString('en-US', {
                            month: 'short',
                            year: 'numeric',
                        })}
                    </Text>
                    <FlatList
                        data={getDatesOfMonth(selectedDate)}
                        renderItem={renderDateItem}
                        keyExtractor={(item) => item.toISOString()}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    />
                </TouchableOpacity>
            </View>

            {/* Calendar Modal */}
            <Modal visible={isCalendarVisible} animationType="slide">
                <View style={styles.calendarModal}>
                    <Calendar
                        onDayPress={onDayPress}
                        markedDates={{
                            [selectedDate.toISOString().split("T")[0]]: {
                                selected: true,
                                selectedColor: "red",
                            },
                        }}
                    />
                    <TouchableOpacity style={styles.closeButton} onPress={closeCalendar}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            {/* Search Buses Button */}
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                <Text style={styles.searchButtonText}>Search Buses</Text>
            </TouchableOpacity>

        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f0f0f0",
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 15,
        margin: 1,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        marginBottom: 10,
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        borderBottomWidth: .5,
        borderColor: 'grey',
    },
    icon: {
        marginRight: 10,
    },
    textContainer: {
        flex: 1,
    },
    label: {
        fontStyle: 'italic',
        fontSize: 12,
        color: '#666',
        fontWeight: 'bold',
    },
    location: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    swapButton: {
        position: 'absolute',
        top: 50,
        right: 16,
        borderColor: 'black',
        borderRadius: 20,
        padding: 4,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        backgroundColor: 'teal',
    },
    calendarModal: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    closeButton: {
        padding: 15,
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: 18,
        color: 'white',
        backgroundColor: 'teal',
        padding: 5,
        borderRadius: 5,

    },
    dateSection: {
        marginBottom: 20,
    },
    dateSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    monthYear: {
        fontStyle: 'italic',
        marginLeft: 5,
        fontWeight: 'bold',
    },
    dateButtons: {
        flexDirection: 'row',
        marginLeft: 15,

    },
    dateButton: {
        backgroundColor: '#FFB433',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        marginRight: 5,
        alignItems: 'center',
        minWidth: 40,
    },
    selectedDateButton: {
        backgroundColor: 'teal',
    },
    dateText: {
        fontStyle: 'italic',
        fontSize: 15,
        color: 'white',

        fontWeight: 'bold',
    },
    dayText: {
        fontWeight: 'bold',
        fontStyle: 'italic',
        fontSize: 12,
        color: 'white',
    },
    currentDateButton: {
        backgroundColor: 'teal',
    },
    searchButton: {
        backgroundColor: 'teal',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    searchButtonText: {
        fontStyle: 'italic',
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    locationInputContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
    },
    locationInput: {
        flex: 1,
        backgroundColor: "white",
        padding: 15,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#ddd",
        marginRight: 5,
    },
    errorMessage: {
        color: "red",
        marginTop: 5,
        marginBottom: 10,
        textAlign: "center",
    },
    routeFromTo: {
        fontSize: 18,
        color: "grey",
        marginBottom: 10,
    },
    //-------------------
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
    },
    noRouteMessage: {
        color: "red",
        textAlign: "center",
        fontSize: 16,
        marginBottom: 4,
    },
    BusContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    BusName: {
        fontWeight: "bold",
        fontSize: 20,
        color: "black",
        marginBottom: 5,
        paddingLeft: 5,
    },
    BusNumber: {
        fontSize: 14,
        paddingLeft: 5,
        color: 'grey'

    },
    Busdiv: {
        color: 'white',
        backgroundColor: '#FFB433',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
        fontWeight: "bold",
    },
    searchBar: {
        backgroundColor: "white",
        padding: 15,
        marginBottom: 15,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#ddd",
    },
    routeList: {
        borderRadius: 10,
        marginBottom: 20,
    },
    routeItem: {
        backgroundColor: "white",
        padding: 10,
        marginBottom: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#ddd",
    },
    routeName: {
        fontSize: 10,
        fontWeight: "bold",
    },
    routeDetails: {
        backgroundColor: "white",
        padding: 10,
        borderRadius: 5,
        // borderWidth: 1,
        // borderColor: "#ddd",
        position: "relative",
    },
    routeHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 5,
        // backgroundColor:'red',
    },
    detailView: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0, // Align to the bottom of the screen
        backgroundColor: '#fff',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        padding: 15,
        zIndex: 4,
    },
    detailedViewContent: {
        flex: 1,
    },
    line: {
        height: 1,
        width: 30,
        backgroundColor: 'red',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
    },
    overlayBackground: {
        flex: 1,
        backgroundColor: 'black',
        opacity: 0.5,
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    TimeInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 10,
    },
    FromTo: {
        fontSize: 16,
        color: 'grey',
    },
    distanceContainer: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        // marginHorizontal:5,
    },
    distance: {
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 16,
        color: '#666',
    },
    ConnectingLine: {
        height: 1,
        backgroundColor: '#ccc',
        width: 20,
    },
    hours: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'black',
        marginLeft: 'auto',
    },
    bottomLieInFlat: {
        marginTop: 10,
        borderTopColor: '#ccc',
        borderTopWidth: 1,
        flexDirection: 'row-reverse'
    },
    BusDetails: {
        color: 'black',
        marginTop: 5,
    },
    cancelButton: {
        padding: 5,
    },
    routeTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
    },
    BusType: {
        fontSize: 12,
        alignItems: "center",
        backgroundColor: "#e37400",
        textAlign: "center",
        padding: 4,
        color: "white",
        borderRadius: 3,
    },
    stopList: {
        marginBottom: 10,
    },
    stopItemContainer: {
        marginBottom: 10,
    },
    stopName: {
        fontSize: 17,
        fontWeight: "bold",
    },
    mapButton: {
        backgroundColor: "#007bff",
        padding: 10,
        borderRadius: 5,
        marginTop: 15,
        alignItems: "center",
    },
    mapButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
});
export default SearchFields;

